package com.ebike.notificationModule.event;

public record OrderStatusChangedEvent(
    Long orderId,
    Long userId,
    String orderNumber,
    String previousStatus,
    String currentStatus
) {
}
