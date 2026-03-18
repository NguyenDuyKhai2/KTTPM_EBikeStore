-- =====================================================
-- Product Module Tables
-- =====================================================

CREATE TABLE IF NOT EXISTS ebike_product.categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS ebike_product.products (
    id BIGSERIAL PRIMARY KEY,
    category_id INT NOT NULL REFERENCES ebike_product.categories(id),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    discount_price DECIMAL(10, 2),
    stock_quantity INT DEFAULT 0,
    rating DECIMAL(3, 2) DEFAULT 0,
    review_count INT DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_products_category ON ebike_product.products(category_id);
CREATE INDEX idx_products_slug ON ebike_product.products(slug);
CREATE INDEX idx_products_active ON ebike_product.products(is_active);

CREATE TABLE IF NOT EXISTS ebike_product.reviews (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL REFERENCES ebike_product.products(id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES ebike_auth.users(id) ON DELETE CASCADE,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    title VARCHAR(255),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(product_id, user_id)
);