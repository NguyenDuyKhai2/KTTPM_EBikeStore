package com.ebike.orderModule.dto.response;

import java.time.LocalDateTime;
import java.util.List;

public record ShipmentTimelineResponse(
    Long orderId,
    Long shipmentId,
    boolean hasShipment,
    String currentStatus,
    String currentStatusLabel,
    String trackingNumber,
    LocalDateTime lastUpdatedAt,
    List<ShipmentTimelineStepResponse> steps
) {
}
