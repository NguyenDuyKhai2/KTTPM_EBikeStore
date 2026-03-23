package com.ebike.productModule.dto;

import java.math.BigDecimal;

public record ProductVariantDto(
    Long id,
    String sku,
    String variantName,
    String colorName,
    String colorHex,
    BigDecimal batteryCapacityAh,
    BigDecimal additionalPrice,
    Integer stockQuantity,
    Boolean defaultVariant
) {
}
