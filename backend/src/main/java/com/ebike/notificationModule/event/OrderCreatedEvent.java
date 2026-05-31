package com.ebike.notificationModule.event;

import java.math.BigDecimal;

public record OrderCreatedEvent(
    Long orderId,
    Long userId,
    String orderNumber,
    String customerEmail,
    BigDecimal totalAmount
) {
}
