package com.ebike.productModule.service;

import com.ebike.productModule.dto.CategorySummaryDto;
import com.ebike.productModule.dto.ProductDetailDto;
import com.ebike.productModule.dto.ProductSpecificationDto;
import com.ebike.productModule.dto.ProductSummaryDto;
import com.ebike.productModule.dto.ProductVariantDto;
import com.ebike.productModule.entity.Product;
import com.ebike.productModule.entity.ProductImage;
import com.ebike.productModule.entity.ProductSpecification;
import com.ebike.productModule.entity.ProductVariant;
import com.ebike.productModule.repository.ProductRepository;
import java.util.Comparator;
import java.util.List;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@Transactional(readOnly = true)
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<ProductSummaryDto> getProducts(String query, Integer categoryId) {
        Specification<Product> specification = Specification.where(isActive());

        if (query != null && !query.trim().isEmpty()) {
            specification = specification.and(nameOrDescriptionContains(query.trim()));
        }
        if (categoryId != null) {
            specification = specification.and(hasCategoryId(categoryId));
        }

        return productRepository.findAll(specification).stream()
            .map(this::toSummaryDto)
            .toList();
    }

    public ProductDetailDto getProductBySlug(String slug) {
        Product product = productRepository.findBySlug(slug)
            .filter(item -> Boolean.TRUE.equals(item.getActive()))
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));

        return toDetailDto(product);
    }

    private Specification<Product> isActive() {
        return (root, query, criteriaBuilder) -> criteriaBuilder.isTrue(root.get("active"));
    }

    private Specification<Product> hasCategoryId(Integer categoryId) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("category").get("id"), categoryId);
    }

    private Specification<Product> nameOrDescriptionContains(String queryText) {
        return (root, query, criteriaBuilder) -> {
            String pattern = "%" + queryText.toLowerCase() + "%";
            return criteriaBuilder.or(
                criteriaBuilder.like(criteriaBuilder.lower(root.get("name")), pattern),
                criteriaBuilder.like(criteriaBuilder.lower(root.get("description")), pattern)
            );
        };
    }

    private ProductSummaryDto toSummaryDto(Product product) {
        return new ProductSummaryDto(
            product.getId(),
            product.getName(),
            product.getSlug(),
            product.getDescription(),
            product.getPrice(),
            product.getDiscountPrice(),
            product.getRating(),
            product.getReviewCount(),
            product.getStockQuantity(),
            new CategorySummaryDto(
                product.getCategory().getId(),
                product.getCategory().getName(),
                product.getCategory().getSlug()
            ),
            mapImages(product)
        );
    }

    private ProductDetailDto toDetailDto(Product product) {
        return new ProductDetailDto(
            product.getId(),
            product.getName(),
            product.getSlug(),
            product.getDescription(),
            product.getPrice(),
            product.getDiscountPrice(),
            product.getRating(),
            product.getReviewCount(),
            product.getStockQuantity(),
            product.getFeatured(),
            new CategorySummaryDto(
                product.getCategory().getId(),
                product.getCategory().getName(),
                product.getCategory().getSlug()
            ),
            mapSpecification(product.getSpecification()),
            product.getVariants().stream()
                .sorted(Comparator.comparing(ProductVariant::getId))
                .map(this::mapVariant)
                .toList(),
            mapImages(product)
        );
    }

    private ProductSpecificationDto mapSpecification(ProductSpecification specification) {
        if (specification == null) {
            return null;
        }
        return new ProductSpecificationDto(
            specification.getModelCode(),
            specification.getBrand(),
            specification.getVehicleType() == null ? null : specification.getVehicleType().name(),
            specification.getBatteryType() == null ? null : specification.getBatteryType().name(),
            specification.getBatteryCapacityAh(),
            specification.getMaxSpeedKmh(),
            specification.getMaxRangeKm(),
            specification.getMotorPowerWatts(),
            specification.getBrakeType() == null ? null : specification.getBrakeType().name(),
            specification.getDriveType() == null ? null : specification.getDriveType().name(),
            specification.getWarrantyMonths()
        );
    }

    private ProductVariantDto mapVariant(ProductVariant variant) {
        return new ProductVariantDto(
            variant.getId(),
            variant.getSku(),
            variant.getVariantName(),
            variant.getColorName(),
            variant.getColorHex(),
            variant.getBatteryCapacityAh(),
            variant.getAdditionalPrice(),
            variant.getStockQuantity(),
            variant.getDefaultVariant()
        );
    }

    private List<String> mapImages(Product product) {
        return product.getImages().stream()
            .sorted(Comparator.comparing(ProductImage::getSortOrder))
            .map(ProductImage::getImageUrl)
            .toList();
    }
}
