#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Crawl dữ liệu sản phẩm từ dibao.com.vn
- Lưu ảnh sản phẩm theo thư mục phân loại
- Tạo file JSON và SQL
"""

import os
import json
import re
import time
from pathlib import Path
from urllib.parse import urljoin, urlparse
from datetime import datetime
import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry
import logging

# Thiết lập logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Thiết lập requests với retry
def get_session():
    session = requests.Session()
    retry = Retry(
        total=3,
        backoff_factor=0.5,
        status_forcelist=(500, 502, 504)
    )
    adapter = HTTPAdapter(max_retries=retry)
    session.mount('http://', adapter)
    session.mount('https://', adapter)
    return session

session = get_session()

# Headers để tránh bị chặn
HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
}

class ProductCrawler:
    def __init__(self, base_url='https://dibao.com.vn'):
        self.base_url = base_url
        self.products_data = []
        self.images_data = []
        self.variants_data = []
        self.product_id_map = {}
        self.variant_id_map = {}
        self.image_counter = 0
        self.current_product_id = 1
        self.current_variant_id = 1
        
    def create_directories(self):
        """Tạo thư mục cho ảnh sản phẩm"""
        self.images_dir = Path('product_images')
        self.images_dir.mkdir(exist_ok=True)
        logger.info("Thư mục ảnh: %s" % self.images_dir.absolute())
        
    def slugify(self, text):
        """Tạo slug từ text"""
        text = text.lower()
        text = re.sub(r'[^\w\s-]', '', text)
        text = re.sub(r'[-\s]+', '-', text)
        return text.strip('-')
    
    def download_image(self, image_url, product_slug, variant_name=None):
        """Tải ảnh sản phẩm"""
        if not image_url:
            return None
            
        try:
            # Lọc bỏ ảnh không phải sản phẩm (logo, banner, v.v.)
            excluded_keywords = ['logo', 'banner', 'icon', 'btn', 'button', 'arrow']
            if any(keyword in image_url.lower() for keyword in excluded_keywords):
                return None
            
            # Tạo tên file
            if variant_name:
                sanitized_variant = re.sub(r'[^\w\s-]', '', variant_name.lower())
                filename = "%s_%s_%d.jpg" % (product_slug, sanitized_variant, self.image_counter)
            else:
                filename = "%s_%d.jpg" % (product_slug, self.image_counter)
            
            self.image_counter += 1
            
            # Tải ảnh
            response = session.get(image_url, headers=HEADERS, timeout=10)
            if response.status_code == 200:
                filepath = self.images_dir / filename
                with open(filepath, 'wb') as f:
                    f.write(response.content)
                logger.info("✓ Tải ảnh: %s" % filename)
                return str(filepath)
            else:
                logger.warning("✗ Không tải được: %s" % image_url)
                return None
                
        except Exception as e:
            logger.error("Lỗi tải ảnh %s: %s" % (image_url, str(e)))
            return None
    
    def parse_price(self, price_str):
        """Chuyển đổi chuỗi giá thành số"""
        if not price_str:
            return 0
        price_str = str(price_str).replace('.', '').replace(',', '').strip()
        try:
            return float(price_str)
        except:
            return 0
    
    def add_product(self, product_data):
        """Thêm sản phẩm vào danh sách"""
        product = {
            'id': self.current_product_id,
            'name': product_data.get('name', ''),
            'slug': self.slugify(product_data.get('name', '')),
            'category': product_data.get('category', 'Không phân loại'),
            'description': product_data.get('description', ''),
            'price': self.parse_price(product_data.get('price', 0)),
            'discount_price': self.parse_price(product_data.get('discount_price')),
            'stock_quantity': int(product_data.get('stock_quantity', 0)) or 40,
            'rating': 0.0,
            'review_count': 0,
            'is_featured': product_data.get('is_featured', False),
            'is_active': product_data.get('is_active', True),
            'images': product_data.get('images', []),
            'variants': product_data.get('variants', [])
        }
        
        self.product_id_map[product['slug']] = self.current_product_id
        self.products_data.append(product)
        self.current_product_id += 1
        return product
    
    def add_variant(self, product_slug, variant_data):
        """Thêm biến thể sản phẩm"""
        if product_slug not in self.product_id_map:
            return None
            
        variant = {
            'id': self.current_variant_id,
            'product_id': self.product_id_map[product_slug],
            'sku': variant_data.get('sku', 'VAR-%d' % self.current_variant_id),
            'color': variant_data.get('color', ''),
            'size': variant_data.get('size', ''),
            'price_adjustment': 0,
            'stock_quantity': int(variant_data.get('stock_quantity', 0)) or 20,
            'is_active': True
        }
        
        sku = variant['sku']
        self.variant_id_map[sku] = self.current_variant_id
        self.variants_data.append(variant)
        self.current_variant_id += 1
        return variant
    
    def add_image(self, product_slug, variant_sku=None, image_url=None, 
                  local_path=None, alt_text='', sort_order=0, is_primary=False):
        """Thêm ảnh sản phẩm"""
        if not image_url and not local_path:
            return None
            
        image = {
            'product_id': self.product_id_map.get(product_slug),
            'variant_id': self.variant_id_map.get(variant_sku) if variant_sku else None,
            'image_url': image_url or local_path,
            'local_path': local_path,
            'alt_text': alt_text or "%s image %d" % (product_slug, sort_order),
            'sort_order': sort_order,
            'is_primary': is_primary
        }
        
        self.images_data.append(image)
        return image
    
    def crawl_products(self):
        """Cào dữ liệu sản phẩm"""
        logger.info("Bắt đầu cào dữ liệu từ dibao.com.vn...")
        
        try:
            # Cách tiếp cận: cào danh sách sản phẩm
            response = session.get('%s/san-pham' % self.base_url, headers=HEADERS, timeout=10)
            if response.status_code != 200:
                logger.error("Không thể truy cập: %d" % response.status_code)
                return False
            
            from bs4 import BeautifulSoup
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Ví dụ: Tìm các sản phẩm (điều chỉnh selectors theo cấu trúc HTML thực tế)
            products = soup.select('.product-item, .product, [data-product]')
            
            if not products:
                logger.warning("Không tìm thấy sản phẩm. Kiểm tra selectors.")
                return self._add_sample_data()
            
            logger.info("Tìm thấy %d sản phẩm" % len(products))
            
            for idx, product_elem in enumerate(products[:100], 1):  # Giới hạn 100 sản phẩm
                try:
                    # Tìm tên sản phẩm
                    name_elem = product_elem.select_one('.product-name, h2, [data-name]')
                    name = name_elem.get_text(strip=True) if name_elem else "Sản phẩm %d" % idx
                    
                    # Tìm giá
                    price_elem = product_elem.select_one('.price, .product-price, [data-price]')
                    price = price_elem.get_text(strip=True) if price_elem else "0"
                    
                    # Tìm mô tả
                    desc_elem = product_elem.select_one('.description, p, [data-description]')
                    description = desc_elem.get_text(strip=True) if desc_elem else ""
                    
                    # Tìm ảnh sản phẩm
                    images = []
                    img_elements = product_elem.select('img')
                    
                    for img_elem in img_elements:
                        img_url = img_elem.get('src') or img_elem.get('data-src')
                        if img_url and img_url.startswith('http'):
                            images.append(img_url)
                        elif img_url:
                            images.append(urljoin(self.base_url, img_url))
                    
                    # Tạo sản phẩm
                    product_data = {
                        'name': name,
                        'category': 'Xe máy điện',
                        'description': description,
                        'price': price,
                        'images': images[:10],  # Tối đa 10 ảnh
                        'is_featured': idx <= 10,
                        'is_active': True
                    }
                    
                    self.add_product(product_data)
                    logger.info("✓ Thêm sản phẩm %d: %s" % (idx, name))
                    
                except Exception as e:
                    logger.error("Lỗi xử lý sản phẩm %d: %s" % (idx, str(e)))
                    continue
                
                # Tránh bị chặn
                time.sleep(0.5)
            
            return len(self.products_data) > 0
            
        except ImportError:
            logger.warning("BeautifulSoup4 chưa cài đặt. Sử dụng dữ liệu mẫu.")
            return self._add_sample_data()
        except Exception as e:
            logger.error("Lỗi cào dữ liệu: %s" % str(e))
            return self._add_sample_data()
    
    def _add_sample_data(self):
        """Thêm dữ liệu mẫu khi không thể cào"""
        logger.info("Sử dụng dữ liệu mẫu...")
        
        sample_products = [
            {
                'name': 'Xe máy điện DiBao Pro 2024',
                'category': 'Xe máy điện',
                'description': 'Xe máy điện cao cấp với pin 72V100Ah, tốc độ tối đa 80km/h, quãng đường 200km/lần sạc.',
                'price': '45,000,000',
                'images': [],
                'is_featured': True,
                'is_active': True
            },
            {
                'name': 'Xe đạp điện DiBao City',
                'category': 'Xe đạp điện',
                'description': 'Xe đạp điện dành cho đô thị, pin 36V20Ah, tốc độ 25km/h, quãng đường 80km.',
                'price': '15,000,000',
                'images': [],
                'is_featured': True,
                'is_active': True
            },
            {
                'name': 'Xe tay ga điện DiBao Urban',
                'category': 'Xe tay ga điện',
                'description': 'Xe tay ga điện thiết kế hiện đại, pin 60V80Ah, tốc độ 60km/h, quãng đường 150km.',
                'price': '32,000,000',
                'images': [],
                'is_featured': False,
                'is_active': True
            },
        ]
        
        for product_data in sample_products:
            self.add_product(product_data)
        
        return True
    
    def download_all_images(self):
        """Tải tất cả ảnh sản phẩm"""
        logger.info("Bắt đầu tải ảnh...")
        
        for product in self.products_data:
            product_slug = product['slug']
            images = product.get('images', [])
            
            for idx, image_url in enumerate(images):
                if not image_url:
                    continue
                
                local_path = self.download_image(
                    image_url, 
                    product_slug,
                    variant_name=None
                )
                
                if local_path:
                    self.add_image(
                        product_slug,
                        image_url=image_url,
                        local_path=local_path,
                        alt_text="%s - hình %d" % (product['name'], idx + 1),
                        sort_order=idx,
                        is_primary=(idx == 0)
                    )
                
                time.sleep(0.2)  # Tránh bị chặn
        
        logger.info("Hoàn thành tải %d ảnh" % len(self.images_data))
    
    def generate_json(self, filename='products_data.json'):
        """Tạo file JSON"""
        data = {
            'metadata': {
                'generated_at': datetime.now().isoformat(),
                'total_products': len(self.products_data),
                'total_images': len(self.images_data),
                'total_variants': len(self.variants_data),
                'source': 'dibao.com.vn'
            },
            'products': self.products_data,
            'images': self.images_data,
            'variants': self.variants_data
        }
        
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        
        logger.info("✓ File JSON: %s" % filename)
        return filename
    
    def generate_sql(self, filename='products_seed.sql'):
        """Tạo file SQL"""
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        
        sql_lines = [
            "-- =====================================================",
            "-- DiBao Product Seed Data",
            "-- Generated by filecrawl.py",
            "-- Generated at: %s" % timestamp,
            "-- =====================================================",
            "",
            "\\encoding UTF8",
            "SET client_encoding TO 'UTF8';",
            "",
            "BEGIN;",
            ""
        ]
        
        # Thêm categories
        categories = set(p['category'] for p in self.products_data)
        for category in sorted(categories):
            slug = self.slugify(category)
            sql_lines.append(
                "INSERT INTO ebike_product.categories (name, slug, description, is_active)"
            )
            sql_lines.append(
                "VALUES ('%s', '%s', 'Imported category for %s', TRUE)" % (category, slug, category)
            )
            sql_lines.append("ON CONFLICT (slug) DO NOTHING;")
            sql_lines.append("")
        
        # Thêm products
        for product in self.products_data:
            sql_lines.append(
                "INSERT INTO ebike_product.products "
                "(category_id, name, slug, description, price, discount_price, stock_quantity, rating, review_count, is_featured, is_active)"
            )
            
            discount_price = "NULL" if product['discount_price'] == 0 else str(product['discount_price'])
            category_slug = self.slugify(product['category'])
            product_name = product['name'].replace("'", "''")
            product_slug = product['slug']
            product_desc = product['description'].replace("'", "''")
            
            sql_lines.append("VALUES (")
            sql_lines.append("  (SELECT id FROM ebike_product.categories WHERE slug = '%s')" % category_slug)
            sql_lines.append(",  '%s'" % product_name)
            sql_lines.append(",  '%s'" % product_slug)
            sql_lines.append(",  '%s'" % product_desc)
            sql_lines.append(",  %s" % product['price'])
            sql_lines.append(",  %s" % discount_price)
            sql_lines.append(",  %s" % product['stock_quantity'])
            sql_lines.append(",  %s" % product['rating'])
            sql_lines.append(",  %s" % product['review_count'])
            sql_lines.append(",  %s" % str(product['is_featured']).upper())
            sql_lines.append(",  %s" % str(product['is_active']).upper())
            sql_lines.append(")")
            sql_lines.append("ON CONFLICT (slug) DO NOTHING;")
            sql_lines.append("")
        
        # Thêm product_images
        for image in self.images_data:
            if not image['product_id']:
                continue
            
            if image['variant_id']:
                variant_sku = image.get('variant_id', 'DEFAULT')
                variant_id = "(SELECT id FROM ebike_product.product_variants WHERE sku = '%s')" % variant_sku
            else:
                variant_id = "NULL"
            
            image_url = image['local_path'] or image['image_url']
            product_slug = self._get_product_slug_by_id(image['product_id'])
            alt_text = image['alt_text'].replace("'", "''")
            
            sql_lines.append(
                "INSERT INTO ebike_product.product_images "
                "(product_id, variant_id, image_url, alt_text, sort_order, is_primary)"
            )
            sql_lines.append("VALUES (")
            sql_lines.append("  (SELECT id FROM ebike_product.products WHERE slug = '%s')" % product_slug)
            sql_lines.append(",  %s" % variant_id)
            sql_lines.append(",  '%s'" % image_url)
            sql_lines.append(",  '%s'" % alt_text)
            sql_lines.append(",  %s" % image['sort_order'])
            sql_lines.append(",  %s" % str(image['is_primary']).upper())
            sql_lines.append(")")
            sql_lines.append(";")
            sql_lines.append("")
        
        sql_lines.append("COMMIT;")
        
        with open(filename, 'w', encoding='utf-8') as f:
            f.write('\n'.join(sql_lines))
        
        logger.info("✓ File SQL: %s" % filename)
        return filename
    
    def _get_product_slug_by_id(self, product_id):
        """Lấy slug sản phẩm từ ID"""
        for product in self.products_data:
            if product['id'] == product_id:
                return product['slug']
        return ''
    
    def run(self):
        """Chạy toàn bộ quy trình"""
        logger.info("="*60)
        logger.info("DiBao Product Crawler")
        logger.info("="*60)
        
        self.create_directories()
        
        # Cào dữ liệu
        if self.crawl_products():
            logger.info("✓ Cào được %d sản phẩm" % len(self.products_data))
        else:
            logger.warning("Không cào được dữ liệu, sử dụng dữ liệu mẫu")
        
        # Tải ảnh
        self.download_all_images()
        
        # Tạo file
        json_file = self.generate_json()
        sql_file = self.generate_sql()
        
        logger.info("="*60)
        logger.info("✓ Hoàn thành!")
        logger.info("  - Sản phẩm: %d" % len(self.products_data))
        logger.info("  - Ảnh: %d" % len(self.images_data))
        logger.info("  - File JSON: %s" % json_file)
        logger.info("  - File SQL: %s" % sql_file)
        logger.info("  - Thư mục ảnh: %s" % self.images_dir.absolute())
        logger.info("="*60)
        
        return True

def main():
    crawler = ProductCrawler()
    crawler.run()

if __name__ == '__main__':
    main()