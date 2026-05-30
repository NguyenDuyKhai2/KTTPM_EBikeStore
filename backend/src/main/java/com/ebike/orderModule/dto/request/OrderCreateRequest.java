package com.ebike.orderModule.dto.request;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public record OrderCreateRequest(
    Long userId,
    String customerName,
    String phoneNumber,
    String customerEmail,
    UUID emailVerificationSessionId,
    Long pickupShowroomId,
    String detailedAddress,
    String paymentMethod,
    BigDecimal shippingFee,
    BigDecimal discountAmount,
    Boolean includeRegistrationService,
    String notes,
    List<OrderCreateItemRequest> items
) {
}
