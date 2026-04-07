package com.ebike.orderModule.controller;

import com.ebike.authModule.entity.User;
import com.ebike.authModule.repository.UserRepository;
import com.ebike.orderModule.entity.Order;
import com.ebike.orderModule.entity.OrderItem;
import com.ebike.orderModule.entity.OrderStatus;
import com.ebike.orderModule.entity.Shipment;
import com.ebike.orderModule.entity.Showroom;
import com.ebike.orderModule.repository.OrderRepository;
import com.ebike.orderModule.repository.ShowroomRepository;
import com.ebike.productModule.entity.Product;
import com.ebike.productModule.repository.ProductRepository;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/orders")
public class OrderController {

    private static final BigDecimal ZERO = BigDecimal.ZERO;

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final ShowroomRepository showroomRepository;

    public OrderController(
        OrderRepository orderRepository,
        UserRepository userRepository,
        ProductRepository productRepository,
        ShowroomRepository showroomRepository
    ) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.showroomRepository = showroomRepository;
    }

    @GetMapping
    @Transactional(readOnly = true)
    public List<OrderResponse> getOrders(@RequestParam(required = false) Long userId) {
        List<Order> orders = userId == null
            ? orderRepository.findAll()
            : orderRepository.findByUserId(userId);

        return orders.stream()
            .sorted(Comparator.comparing(Order::getCreatedAt).reversed())
            .map(this::toResponse)
            .toList();
    }

    @GetMapping("/{id}")
    @Transactional(readOnly = true)
    public OrderResponse getOrderById(@PathVariable Long id) {
        Order order = orderRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found"));

        return toResponse(order);
    }

    @PostMapping
    @Transactional
    @ResponseStatus(HttpStatus.CREATED)
    public OrderResponse createOrder(@RequestBody OrderCreateRequest request) {
        if (request == null || request.userId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "userId is required");
        }
        if (request.items() == null || request.items().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "At least one order item is required");
        }

        User user = userRepository.findById(request.userId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        Order order = new Order();
        order.setUser(user);
        order.setOrderNumber(generateOrderNumber());
        order.setStatus(OrderStatus.PENDING);
        order.setShippingFee(defaultValue(request.shippingFee()));
        order.setDiscountAmount(defaultValue(request.discountAmount()));
        order.setNotes(request.notes());
        order.setCustomerEmail(normalize(request.customerEmail()));
        order.setCustomerIdentityNumber(normalize(request.customerIdentityNumber()));

        if (isBlank(request.customerName())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "customerName is required");
        }
        if (isBlank(request.phoneNumber())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "phoneNumber is required");
        }
        if (isBlank(request.customerEmail())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "customerEmail is required");
        }
        if (isBlank(request.detailedAddress())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "detailedAddress is required");
        }
        if (request.pickupShowroomId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "pickupShowroomId is required");
        }

        Showroom showroom = showroomRepository.findById(request.pickupShowroomId())
            .filter(candidate -> Boolean.TRUE.equals(candidate.getActive()))
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Pickup showroom not found"));

        BigDecimal subtotal = ZERO;

        for (OrderCreateItemRequest itemRequest : request.items()) {
            if (itemRequest.productId() == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "productId is required");
            }
            if (itemRequest.quantity() == null || itemRequest.quantity() <= 0) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "quantity must be greater than 0");
            }

            Product product = productRepository.findById(itemRequest.productId())
                .filter(p -> Boolean.TRUE.equals(p.getActive()))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found: " + itemRequest.productId()));

            BigDecimal unitPrice = product.getDiscountPrice() != null ? product.getDiscountPrice() : product.getPrice();
            BigDecimal lineTotal = unitPrice.multiply(BigDecimal.valueOf(itemRequest.quantity()));

            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setProduct(product);
            item.setProductName(product.getName());
            item.setUnitPrice(unitPrice);
            item.setQuantity(itemRequest.quantity());
            item.setLineTotal(lineTotal);

            order.getItems().add(item);
            subtotal = subtotal.add(lineTotal);
        }

        order.setSubtotal(subtotal);

        BigDecimal totalAmount = subtotal
            .add(order.getShippingFee())
            .subtract(order.getDiscountAmount());

        if (totalAmount.signum() < 0) {
            totalAmount = ZERO;
        }

        order.setTotalAmount(totalAmount);

        Shipment shipment = new Shipment();
        shipment.setOrder(order);
        shipment.setRecipientName(request.customerName().trim());
        shipment.setPhoneNumber(request.phoneNumber().trim());
        shipment.setRecipientEmail(request.customerEmail().trim());
        shipment.setPickupDistrict(showroom.getDistrict());
        shipment.setDetailedAddress(request.detailedAddress().trim());
        shipment.setPickupShowroom(showroom);
        shipment.setShippingAddress(buildShippingAddress(showroom, request.detailedAddress()));
        order.setShipment(shipment);

        Order savedOrder = orderRepository.save(order);
        return toResponse(savedOrder);
    }

    @PatchMapping("/{id}/status")
    @Transactional
    public OrderResponse updateOrderStatus(@PathVariable Long id, @RequestBody OrderStatusUpdateRequest request) {
        if (request == null || request.status() == null || request.status().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "status is required");
        }

        Order order = orderRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found"));

        OrderStatus status;
        try {
            status = OrderStatus.valueOf(request.status().trim().toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException exception) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid order status");
        }

        order.setStatus(status);
        Order updatedOrder = orderRepository.save(order);
        return toResponse(updatedOrder);
    }

    private String generateOrderNumber() {
        String datePart = LocalDate.now().format(DateTimeFormatter.BASIC_ISO_DATE);
        String suffix = UUID.randomUUID().toString().replace("-", "").substring(0, 8).toUpperCase(Locale.ROOT);
        return "ORD-" + datePart + "-" + suffix;
    }

    private BigDecimal defaultValue(BigDecimal value) {
        return value == null ? ZERO : value;
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }

    private String normalize(String value) {
        return isBlank(value) ? null : value.trim();
    }

    private String buildShippingAddress(Showroom showroom, String detailedAddress) {
        return showroom.getName() + " - " + showroom.getAddress() + " | Dia chi cu the: " + detailedAddress.trim();
    }

    private OrderResponse toResponse(Order order) {
        Shipment shipment = order.getShipment();
        return new OrderResponse(
            order.getId(),
            order.getUser().getId(),
            order.getOrderNumber(),
            order.getStatus().name(),
            order.getSubtotal(),
            order.getShippingFee(),
            order.getDiscountAmount(),
            order.getTotalAmount(),
            order.getNotes(),
            order.getCustomerEmail(),
            order.getCustomerIdentityNumber(),
            order.getCreatedAt(),
            order.getUpdatedAt(),
            order.getItems().stream()
                .sorted(Comparator.comparing(OrderItem::getId))
                .map(item -> new OrderItemResponse(
                    item.getId(),
                    item.getProduct().getId(),
                    item.getProductName(),
                    item.getUnitPrice(),
                    item.getQuantity(),
                    item.getLineTotal()
                ))
                .toList(),
            shipment == null ? null : new ShipmentResponse(
                shipment.getId(),
                shipment.getShipmentStatus().name(),
                shipment.getRecipientName(),
                shipment.getPhoneNumber(),
                shipment.getRecipientEmail(),
                shipment.getPickupDistrict(),
                shipment.getDetailedAddress(),
                shipment.getShippingAddress(),
                shipment.getTrackingNumber(),
                shipment.getShippedAt(),
                shipment.getDeliveredAt(),
                shipment.getPickupShowroom() == null ? null : new ShowroomResponse(
                    shipment.getPickupShowroom().getId(),
                    shipment.getPickupShowroom().getName(),
                    shipment.getPickupShowroom().getCity(),
                    shipment.getPickupShowroom().getDistrict(),
                    shipment.getPickupShowroom().getAddress(),
                    shipment.getPickupShowroom().getPhone(),
                    shipment.getPickupShowroom().getOpeningHours(),
                    shipment.getPickupShowroom().getActive()
                )
            )
        );
    }

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

    public record OrderCreateItemRequest(Long productId, Integer quantity) {
    }

    public record OrderStatusUpdateRequest(String status) {
    }

    public record OrderItemResponse(
        Long id,
        Long productId,
        String productName,
        BigDecimal unitPrice,
        Integer quantity,
        BigDecimal lineTotal
    ) {
    }

    public record OrderResponse(
        Long id,
        Long userId,
        String orderNumber,
        String status,
        BigDecimal subtotal,
        BigDecimal shippingFee,
        BigDecimal discountAmount,
        BigDecimal totalAmount,
        String notes,
        String customerEmail,
        String customerIdentityNumber,
        java.time.LocalDateTime createdAt,
        java.time.LocalDateTime updatedAt,
        List<OrderItemResponse> items,
        ShipmentResponse shipment
    ) {
    }

    public record ShipmentResponse(
        Long id,
        String shipmentStatus,
        String recipientName,
        String phoneNumber,
        String recipientEmail,
        String pickupDistrict,
        String detailedAddress,
        String shippingAddress,
        String trackingNumber,
        java.time.LocalDateTime shippedAt,
        java.time.LocalDateTime deliveredAt,
        ShowroomResponse pickupShowroom
    ) {
    }

    public record ShowroomResponse(
        Long id,
        String name,
        String city,
        String district,
        String address,
        String phone,
        String openingHours,
        Boolean active
    ) {
    }
}
