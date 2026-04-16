package com.ebike.orderModule.dto.request;

import java.math.BigDecimal;
import java.util.List;

public record OrderCreateRequest(
    Long userId,
    String customerName,
    String phoneNumber,
    String customerEmail,
    String customerIdentityNumber,
    Long pickupShowroomId,
    String detailedAddress,
    BigDecimal shippingFee,
    BigDecimal discountAmount,
    String notes,
    List<OrderCreateItemRequest> items
) {
}
