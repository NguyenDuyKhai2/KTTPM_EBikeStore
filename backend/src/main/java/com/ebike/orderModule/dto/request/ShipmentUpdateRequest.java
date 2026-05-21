package com.ebike.orderModule.dto.request;

public record ShipmentUpdateRequest(
    String status,
    String trackingNumber
) {
}
