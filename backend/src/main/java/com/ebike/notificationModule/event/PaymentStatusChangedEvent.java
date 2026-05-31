package com.ebike.notificationModule.event;

import java.math.BigDecimal;

public record PaymentStatusChangedEvent(
    Long paymentId,
    Long orderId,
    Long userId,
    String orderNumber,
    String paymentMethod,
    String previousStatus,
    String currentStatus,
    BigDecimal amount
) {
}
