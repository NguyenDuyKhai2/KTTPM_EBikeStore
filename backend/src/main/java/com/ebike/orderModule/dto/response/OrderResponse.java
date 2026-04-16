package com.ebike.orderModule.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record OrderResponse(
    Long id,
    Long userId,
    String orderNumber,
    String status,
    BigDecimal subtotal,
    BigDecimal shippingFee,
    BigDecimal discountAmount,
    BigDecimal registrationFee,
    BigDecimal totalAmount,
    String notes,
    String customerEmail,
    String customerIdentityNumber,
    LocalDateTime createdAt,
    LocalDateTime updatedAt,
    List<OrderItemResponse> items,
    ShipmentResponse shipment
) {
}
