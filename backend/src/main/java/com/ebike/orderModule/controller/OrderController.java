package com.ebike.orderModule.controller;

import com.ebike.authModule.entity.User;
import com.ebike.authModule.repository.UserRepository;
import com.ebike.orderModule.entity.Order;
import com.ebike.orderModule.entity.OrderItem;
import com.ebike.orderModule.entity.OrderStatus;
import com.ebike.orderModule.entity.Shipment;
import com.ebike.orderModule.entity.Showroom;
import com.ebike.orderModule.dto.request.OrderCreateItemRequest;
import com.ebike.orderModule.dto.request.OrderCreateRequest;
import com.ebike.orderModule.dto.request.OrderQuoteRequest;
import com.ebike.orderModule.dto.request.OrderStatusUpdateRequest;
import com.ebike.orderModule.dto.response.OrderItemResponse;
import com.ebike.orderModule.dto.response.OrderQuoteResponse;
import com.ebike.orderModule.dto.response.OrderResponse;
import com.ebike.orderModule.dto.response.ShipmentResponse;
import com.ebike.orderModule.dto.response.ShowroomResponse;
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
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
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
    private static final BigDecimal SHOWROOM_INCENTIVE_AMOUNT = new BigDecimal("1200000");
    private static final BigDecimal REGISTRATION_FEE_AMOUNT = new BigDecimal("2500000");

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
    public List<OrderResponse> getOrders(Authentication authentication, @RequestParam(required = false) Long userId) {
        User currentUser = getAuthenticatedUser(authentication);
        Long effectiveUserId = isBackOffice(authentication) ? userId : currentUser.getId();

        List<Order> orders = effectiveUserId == null
            ? orderRepository.findAll()
            : orderRepository.findByUserId(effectiveUserId);

        return orders.stream()
            .sorted(Comparator.comparing(Order::getCreatedAt).reversed())
            .map(this::toResponse)
            .toList();
    }

    @GetMapping("/{id}")
    @Transactional(readOnly = true)
    public OrderResponse getOrderById(@PathVariable Long id, Authentication authentication) {
        Order order = orderRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found"));
        assertCanAccessOrder(order, authentication);

        return toResponse(order);
    }

    @PostMapping("/quote")
    @Transactional(readOnly = true)
    public OrderQuoteResponse quoteOrder(@RequestBody OrderQuoteRequest request) {
        return buildQuote(validateQuoteItems(request == null ? null : request.items()));
    }

    @PostMapping
    @Transactional
    @ResponseStatus(HttpStatus.CREATED)
    public OrderResponse createOrder(@RequestBody OrderCreateRequest request, Authentication authentication) {
        if (request == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Request body is required");
        }
        if (request.items() == null || request.items().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "At least one order item is required");
        }

        User user = getAuthenticatedUser(authentication);

        Order order = new Order();
        order.setUser(user);
        order.setOrderNumber(generateOrderNumber());
        order.setStatus(OrderStatus.PENDING);
        order.setShippingFee(ZERO);
        order.setDiscountAmount(SHOWROOM_INCENTIVE_AMOUNT);
        order.setRegistrationFee(REGISTRATION_FEE_AMOUNT);
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

        List<OrderCreateItemRequest> quoteItems = validateQuoteItems(request.items());
        BigDecimal subtotal = ZERO;

        for (OrderCreateItemRequest itemRequest : quoteItems) {
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
        order.setTotalAmount(calculateTotalAmount(subtotal, order.getShippingFee(), order.getDiscountAmount(), order.getRegistrationFee()));

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
    @PreAuthorize("hasAnyRole('STAFF', 'MANAGER', 'ADMIN')")
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

    private List<OrderCreateItemRequest> validateQuoteItems(List<OrderCreateItemRequest> items) {
        if (items == null || items.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "At least one order item is required");
        }

        for (OrderCreateItemRequest itemRequest : items) {
            if (itemRequest.productId() == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "productId is required");
            }
            if (itemRequest.quantity() == null || itemRequest.quantity() <= 0) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "quantity must be greater than 0");
            }
        }

        return items;
    }

    private OrderQuoteResponse buildQuote(List<OrderCreateItemRequest> items) {
        BigDecimal subtotal = ZERO;

        for (OrderCreateItemRequest itemRequest : items) {
            Product product = productRepository.findById(itemRequest.productId())
                .filter(p -> Boolean.TRUE.equals(p.getActive()))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found: " + itemRequest.productId()));

            BigDecimal unitPrice = product.getDiscountPrice() != null ? product.getDiscountPrice() : product.getPrice();
            subtotal = subtotal.add(unitPrice.multiply(BigDecimal.valueOf(itemRequest.quantity())));
        }

        return new OrderQuoteResponse(
            subtotal,
            ZERO,
            SHOWROOM_INCENTIVE_AMOUNT,
            REGISTRATION_FEE_AMOUNT,
            calculateTotalAmount(subtotal, ZERO, SHOWROOM_INCENTIVE_AMOUNT, REGISTRATION_FEE_AMOUNT)
        );
    }

    private BigDecimal calculateTotalAmount(
        BigDecimal subtotal,
        BigDecimal shippingFee,
        BigDecimal discountAmount,
        BigDecimal registrationFee
    ) {
        BigDecimal totalAmount = defaultValue(subtotal)
            .add(defaultValue(shippingFee))
            .add(defaultValue(registrationFee))
            .subtract(defaultValue(discountAmount));

        return totalAmount.signum() < 0 ? ZERO : totalAmount;
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }

    private String normalize(String value) {
        return isBlank(value) ? null : value.trim();
    }

    private User getAuthenticatedUser(Authentication authentication) {
        if (authentication == null || authentication.getName() == null || authentication.getName().isBlank()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Authentication is required");
        }
        return userRepository.findByUsername(authentication.getName())
            .or(() -> userRepository.findByEmail(authentication.getName()))
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Authenticated user not found"));
    }

    private void assertCanAccessOrder(Order order, Authentication authentication) {
        if (isBackOffice(authentication)) {
            return;
        }
        User currentUser = getAuthenticatedUser(authentication);
        if (!order.getUser().getId().equals(currentUser.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only access your own orders");
        }
    }

    private boolean isBackOffice(Authentication authentication) {
        return authentication != null && authentication.getAuthorities().stream()
            .anyMatch(authority -> {
                String role = authority.getAuthority();
                return "ROLE_STAFF".equals(role) || "ROLE_MANAGER".equals(role) || "ROLE_ADMIN".equals(role);
            });
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
            order.getRegistrationFee(),
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

}
