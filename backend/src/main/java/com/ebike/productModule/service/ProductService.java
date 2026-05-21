package com.ebike.productModule.service;

import com.ebike.productModule.dto.response.CategorySummaryDto;
import com.ebike.productModule.dto.response.ProductDetailDto;
import com.ebike.productModule.dto.response.ProductFilterOptionsDto;
import com.ebike.productModule.dto.response.ProductSpecificationDto;
import com.ebike.productModule.dto.response.ProductSummaryDto;
import com.ebike.productModule.dto.response.ProductVariantDto;
import com.ebike.productModule.entity.BatteryType;
import com.ebike.productModule.entity.Product;
import com.ebike.productModule.entity.ProductImage;
import com.ebike.productModule.entity.ProductImageStatus;
import com.ebike.productModule.entity.ProductSpecification;
import com.ebike.productModule.entity.ProductVariant;
import com.ebike.productModule.entity.VehicleType;
import com.ebike.productModule.repository.ProductRepository;
import jakarta.persistence.criteria.JoinType;
import java.math.BigDecimal;
import java.util.Comparator;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import org.springframework.data.domain.Sort;
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

    public List<ProductSummaryDto> getProducts(
        String query,
        Integer categoryId,
        BigDecimal minPrice,
        BigDecimal maxPrice,
        String brand,
        String batteryType,
        String vehicleType,
        BigDecimal minRangeKm,
        BigDecimal maxRangeKm,
        Boolean inStock,
        String sort
    ) {
        Specification<Product> specification = Specification.where(isActive());

        if (query != null && !query.trim().isEmpty()) {
            specification = specification.and(nameOrDescriptionContains(query.trim()));
        }
        if (categoryId != null) {
            specification = specification.and(hasCategoryId(categoryId));
        }
        if (minPrice != null) {
            specification = specification.and(hasMinPrice(minPrice));
        }
        if (maxPrice != null) {
            specification = specification.and(hasMaxPrice(maxPrice));
        }
        if (brand != null && !brand.trim().isEmpty()) {
            specification = specification.and(hasBrand(brand.trim()));
        }
        if (batteryType != null && !batteryType.trim().isEmpty()) {
            specification = specification.and(hasBatteryType(parseBatteryType(batteryType)));
        }
        if (vehicleType != null && !vehicleType.trim().isEmpty()) {
            specification = specification.and(hasVehicleType(parseVehicleType(vehicleType)));
        }
        if (minRangeKm != null) {
            specification = specification.and(hasMinRangeKm(minRangeKm));
        }
        if (maxRangeKm != null) {
            specification = specification.and(hasMaxRangeKm(maxRangeKm));
        }
        if (Boolean.TRUE.equals(inStock)) {
            specification = specification.and(hasStockAvailable());
        }

        return productRepository.findAll(specification, resolveSort(sort)).stream()
            .map(this::toSummaryDto)
            .toList();
    }

    public ProductFilterOptionsDto getFilterOptions() {
        Set<String> brands = new LinkedHashSet<>();
        Set<String> batteryTypes = new LinkedHashSet<>();
        Set<String> vehicleTypes = new LinkedHashSet<>();

        productRepository.findAll(isActive()).forEach(product -> {
            ProductSpecification specification = product.getSpecification();
            if (specification == null) {
                return;
            }
            if (specification.getBrand() != null && !specification.getBrand().isBlank()) {
                brands.add(specification.getBrand());
            }
            if (specification.getBatteryType() != null) {
                batteryTypes.add(specification.getBatteryType().name());
            }
            if (specification.getVehicleType() != null) {
                vehicleTypes.add(specification.getVehicleType().name());
            }
        });

        return new ProductFilterOptionsDto(List.copyOf(brands), List.copyOf(batteryTypes), List.copyOf(vehicleTypes));
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

    private Specification<Product> hasMinPrice(BigDecimal minPrice) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.greaterThanOrEqualTo(root.get("price"), minPrice);
    }

    private Specification<Product> hasMaxPrice(BigDecimal maxPrice) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.lessThanOrEqualTo(root.get("price"), maxPrice);
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

    private Specification<Product> hasBrand(String brand) {
        return (root, query, criteriaBuilder) -> {
            var specificationJoin = root.join("specification", JoinType.INNER);
            return criteriaBuilder.equal(criteriaBuilder.lower(specificationJoin.get("brand")), brand.toLowerCase(Locale.ROOT));
        };
    }

    private Specification<Product> hasBatteryType(BatteryType batteryType) {
        return (root, query, criteriaBuilder) -> {
            var specificationJoin = root.join("specification", JoinType.INNER);
            return criteriaBuilder.equal(specificationJoin.get("batteryType"), batteryType);
        };
    }

    private Specification<Product> hasVehicleType(VehicleType vehicleType) {
        return (root, query, criteriaBuilder) -> {
            var specificationJoin = root.join("specification", JoinType.INNER);
            return criteriaBuilder.equal(specificationJoin.get("vehicleType"), vehicleType);
        };
    }

    private Specification<Product> hasMinRangeKm(BigDecimal minRangeKm) {
        return (root, query, criteriaBuilder) -> {
            var specificationJoin = root.join("specification", JoinType.INNER);
            return criteriaBuilder.greaterThanOrEqualTo(specificationJoin.get("maxRangeKm"), minRangeKm);
        };
    }

    private Specification<Product> hasMaxRangeKm(BigDecimal maxRangeKm) {
        return (root, query, criteriaBuilder) -> {
            var specificationJoin = root.join("specification", JoinType.INNER);
            return criteriaBuilder.lessThanOrEqualTo(specificationJoin.get("maxRangeKm"), maxRangeKm);
        };
    }

    private Specification<Product> hasStockAvailable() {
        return (root, query, criteriaBuilder) -> criteriaBuilder.greaterThan(root.get("stockQuantity"), 0);
    }

    private BatteryType parseBatteryType(String rawValue) {
        try {
            return BatteryType.valueOf(rawValue.trim().toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException exception) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid battery type filter");
        }
    }

    private VehicleType parseVehicleType(String rawValue) {
        try {
            return VehicleType.valueOf(rawValue.trim().toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException exception) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid vehicle type filter");
        }
    }

    private Sort resolveSort(String sort) {
        if (sort == null || sort.isBlank()) {
            return Sort.by(Sort.Direction.DESC, "featured").and(Sort.by(Sort.Direction.ASC, "name"));
        }
        return switch (sort.trim().toLowerCase(Locale.ROOT)) {
            case "price_asc" -> Sort.by(Sort.Direction.ASC, "price");
            case "price_desc" -> Sort.by(Sort.Direction.DESC, "price");
            case "name_asc" -> Sort.by(Sort.Direction.ASC, "name");
            case "name_desc" -> Sort.by(Sort.Direction.DESC, "name");
            case "newest" -> Sort.by(Sort.Direction.DESC, "createdAt");
            default -> throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid sort option");
        };
    }

    public ProductSummaryDto toSummaryDto(Product product) {
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
            product.getFeatured(),
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
            mapVariantImage(variant),
            variant.getBatteryCapacityAh(),
            variant.getAdditionalPrice(),
            variant.getStockQuantity(),
            variant.getDefaultVariant()
        );
    }

    private String mapVariantImage(ProductVariant variant) {
        return variant.getImages().stream()
            .filter(this::isActiveImage)
            .sorted(Comparator.comparing(ProductImage::getSortOrder))
            .map(ProductImage::getImageUrl)
            .findFirst()
            .orElse(null);
    }

    private List<String> mapImages(Product product) {
        return product.getImages().stream()
            .filter(this::isActiveImage)
            .sorted(Comparator.comparing(ProductImage::getSortOrder))
            .map(ProductImage::getImageUrl)
            .toList();
    }

    private boolean isActiveImage(ProductImage image) {
        return image.getStatus() == null || image.getStatus() == ProductImageStatus.ACTIVE;
    }
}
