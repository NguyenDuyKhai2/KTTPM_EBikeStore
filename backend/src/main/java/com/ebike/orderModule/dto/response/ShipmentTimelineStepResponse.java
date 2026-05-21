package com.ebike.orderModule.dto.response;

import java.time.LocalDateTime;

public record ShipmentTimelineStepResponse(
    String status,
    String label,
    boolean completed,
    boolean active,
    LocalDateTime occurredAt
) {
}
