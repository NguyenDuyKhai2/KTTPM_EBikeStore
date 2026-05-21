package com.ebike.orderModule.service;

import com.ebike.orderModule.dto.request.ShipmentUpdateRequest;
import com.ebike.orderModule.dto.response.ShipmentTimelineResponse;
import org.springframework.security.core.Authentication;

public interface ShipmentService {

    ShipmentTimelineResponse getShipmentTimeline(Long orderId, Authentication authentication);

    ShipmentTimelineResponse updateShipment(Long orderId, ShipmentUpdateRequest request);
}
