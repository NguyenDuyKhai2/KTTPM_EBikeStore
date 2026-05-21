package com.ebike.orderModule.service.impl;

import com.ebike.authModule.entity.User;
import com.ebike.authModule.repository.UserRepository;
import com.ebike.orderModule.dto.request.ShipmentUpdateRequest;
import com.ebike.orderModule.dto.response.ShipmentTimelineResponse;
import com.ebike.orderModule.dto.response.ShipmentTimelineStepResponse;
import com.ebike.orderModule.entity.Order;
import com.ebike.orderModule.entity.OrderStatus;
import com.ebike.orderModule.entity.Shipment;
import com.ebike.orderModule.entity.ShipmentStatus;
import com.ebike.orderModule.repository.OrderRepository;
import com.ebike.orderModule.service.ShipmentService;
import com.ebike.shared.constants.PermissionConstants;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ShipmentServiceImpl implements ShipmentService {

    private static final List<TimelineDefinition> ACTIVE_TIMELINE = List.of(
        new TimelineDefinition(ShipmentStatus.PENDING, "Chờ xử lý", 0),
        new TimelineDefinition(ShipmentStatus.PREPARING, "Đang chuẩn bị", 1),
        new TimelineDefinition(null, "Đang giao", 2, ShipmentStatus.SHIPPED, ShipmentStatus.IN_TRANSIT),
        new TimelineDefinition(ShipmentStatus.DELIVERED, "Đã giao", 3)
    );

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    public ShipmentServiceImpl(OrderRepository orderRepository, UserRepository userRepository) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public ShipmentTimelineResponse getShipmentTimeline(Long orderId, Authentication authentication) {
        Order order = findOrder(orderId);
        assertCanAccessOrder(order, authentication);
        return buildTimeline(order);
    }

    @Override
    @Transactional
    public ShipmentTimelineResponse updateShipment(Long orderId, ShipmentUpdateRequest request) {
        if (request == null || request.status() == null || request.status().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "status is required");
        }

        Order order = findOrder(orderId);
        if (order.getStatus() == OrderStatus.CANCELLED) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot update shipment for a cancelled order");
        }

        Shipment shipment = order.getShipment();
        if (shipment == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Shipment not found for this order");
        }

        ShipmentStatus nextStatus = parseShipmentStatus(request.status());
        shipment.setShipmentStatus(nextStatus);

        if (request.trackingNumber() != null) {
            String trackingNumber = request.trackingNumber().trim();
            shipment.setTrackingNumber(trackingNumber.isEmpty() ? null : trackingNumber);
        }

        applyStatusTimestamps(shipment, nextStatus);
        syncOrderStatus(order, nextStatus);

        orderRepository.save(order);
        return buildTimeline(order);
    }

    private Order findOrder(Long orderId) {
        return orderRepository.findById(orderId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found"));
    }

    private ShipmentStatus parseShipmentStatus(String rawStatus) {
        try {
            return ShipmentStatus.valueOf(rawStatus.trim().toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException exception) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid shipment status");
        }
    }

    private void applyStatusTimestamps(Shipment shipment, ShipmentStatus status) {
        LocalDateTime now = LocalDateTime.now();
        if (status == ShipmentStatus.SHIPPED || status == ShipmentStatus.IN_TRANSIT) {
            if (shipment.getShippedAt() == null) {
                shipment.setShippedAt(now);
            }
        }
        if (status == ShipmentStatus.DELIVERED && shipment.getDeliveredAt() == null) {
            shipment.setDeliveredAt(now);
        }
    }

    private void syncOrderStatus(Order order, ShipmentStatus shipmentStatus) {
        OrderStatus mappedStatus = switch (shipmentStatus) {
            case PENDING -> OrderStatus.PENDING;
            case PREPARING -> OrderStatus.CONFIRMED;
            case SHIPPED, IN_TRANSIT -> OrderStatus.SHIPPED;
            case DELIVERED -> OrderStatus.DELIVERED;
            case RETURNED -> order.getStatus();
        };
        if (order.getStatus() != OrderStatus.CANCELLATION_REQUESTED) {
            order.setStatus(mappedStatus);
        }
    }

    private ShipmentTimelineResponse buildTimeline(Order order) {
        Shipment shipment = order.getShipment();
        if (order.getStatus() == OrderStatus.CANCELLED) {
            return cancelledTimeline(order, shipment);
        }
        if (shipment == null) {
            return new ShipmentTimelineResponse(
                order.getId(),
                null,
                false,
                null,
                "Chưa có thông tin giao hàng",
                null,
                order.getUpdatedAt(),
                List.of()
            );
        }

        int currentIndex = resolveTimelineIndex(shipment.getShipmentStatus());
        List<ShipmentTimelineStepResponse> steps = new ArrayList<>();
        for (TimelineDefinition definition : ACTIVE_TIMELINE) {
            boolean completed = currentIndex > definition.index();
            boolean active = currentIndex == definition.index();
            steps.add(new ShipmentTimelineStepResponse(
                definition.key(),
                definition.label(),
                completed,
                active,
                resolveOccurredAt(shipment, definition)
            ));
        }

        return new ShipmentTimelineResponse(
            order.getId(),
            shipment.getId(),
            true,
            shipment.getShipmentStatus().name(),
            labelForStatus(shipment.getShipmentStatus()),
            shipment.getTrackingNumber(),
            resolveLastUpdatedAt(shipment),
            steps
        );
    }

    private ShipmentTimelineResponse cancelledTimeline(Order order, Shipment shipment) {
        List<ShipmentTimelineStepResponse> steps = List.of(
            new ShipmentTimelineStepResponse("CANCELLED", "Đã hủy", true, true, order.getUpdatedAt())
        );
        return new ShipmentTimelineResponse(
            order.getId(),
            shipment == null ? null : shipment.getId(),
            shipment != null,
            "CANCELLED",
            "Đã hủy",
            shipment == null ? null : shipment.getTrackingNumber(),
            order.getUpdatedAt(),
            steps
        );
    }

    private int resolveTimelineIndex(ShipmentStatus status) {
        return switch (status) {
            case PENDING -> 0;
            case PREPARING -> 1;
            case SHIPPED, IN_TRANSIT -> 2;
            case DELIVERED -> 3;
            case RETURNED -> 2;
        };
    }

    private LocalDateTime resolveOccurredAt(Shipment shipment, TimelineDefinition definition) {
        if (definition.index() >= 3) {
            return shipment.getDeliveredAt();
        }
        if (definition.index() >= 2) {
            return shipment.getShippedAt();
        }
        return null;
    }

    private LocalDateTime resolveLastUpdatedAt(Shipment shipment) {
        if (shipment.getDeliveredAt() != null) {
            return shipment.getDeliveredAt();
        }
        if (shipment.getShippedAt() != null) {
            return shipment.getShippedAt();
        }
        return null;
    }

    private String labelForStatus(ShipmentStatus status) {
        return switch (status) {
            case PENDING -> "Chờ xử lý";
            case PREPARING -> "Đang chuẩn bị";
            case SHIPPED, IN_TRANSIT -> "Đang giao";
            case DELIVERED -> "Đã giao";
            case RETURNED -> "Hoàn trả";
        };
    }

    private void assertCanAccessOrder(Order order, Authentication authentication) {
        if (isBackOffice(authentication)) {
            return;
        }
        User currentUser = getAuthenticatedUser(authentication);
        if (order.getUser() == null || !order.getUser().getId().equals(currentUser.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only access your own orders");
        }
    }

    private User getAuthenticatedUser(Authentication authentication) {
        if (authentication == null || authentication.getName() == null || authentication.getName().isBlank()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Authentication is required");
        }
        return userRepository.findByUsername(authentication.getName())
            .or(() -> userRepository.findByEmail(authentication.getName()))
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Authenticated user not found"));
    }

    private boolean isBackOffice(Authentication authentication) {
        return authentication != null && authentication.getAuthorities().stream()
            .anyMatch(authority -> PermissionConstants.OrderManagement.ORDER_VIEW_ALL.equals(authority.getAuthority()));
    }

    private record TimelineDefinition(
        ShipmentStatus primaryStatus,
        String label,
        int index,
        ShipmentStatus... alternateStatuses
    ) {
        TimelineDefinition(ShipmentStatus primaryStatus, String label, int index) {
            this(primaryStatus, label, index, new ShipmentStatus[0]);
        }

        String key() {
            if (primaryStatus != null) {
                return primaryStatus.name();
            }
            return "SHIPPING";
        }
    }
}
