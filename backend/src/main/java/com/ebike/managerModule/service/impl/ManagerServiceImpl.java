package com.ebike.managerModule.service.impl;

import com.ebike.authModule.entity.Role;
import com.ebike.authModule.entity.User;
import com.ebike.authModule.repository.UserRepository;
import com.ebike.managerModule.dto.request.ManagerPaymentConfirmationRequest;
import com.ebike.managerModule.dto.response.ManagerCustomerResponse;
import com.ebike.managerModule.dto.response.ManagerDashboardResponse;
import com.ebike.managerModule.dto.response.ManagerPaymentResponse;
import com.ebike.managerModule.service.ManagerService;
import com.ebike.notificationModule.event.OrderStatusChangedEvent;
import com.ebike.notificationModule.event.PaymentStatusChangedEvent;
import com.ebike.orderModule.dto.request.OrderCancellationRequest;
import com.ebike.orderModule.dto.response.OrderResponse;
import com.ebike.orderModule.entity.Order;
import com.ebike.orderModule.entity.OrderItem;
import com.ebike.orderModule.entity.OrderStatus;
import com.ebike.orderModule.entity.Payment;
import com.ebike.orderModule.entity.PaymentMethod;
import com.ebike.orderModule.entity.PaymentStatus;
import com.ebike.orderModule.entity.Shipment;
import com.ebike.orderModule.entity.Showroom;
import com.ebike.orderModule.repository.OrderRepository;
import com.ebike.orderModule.repository.PaymentRepository;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ManagerServiceImpl implements ManagerService {

    private static final BigDecimal ZERO = BigDecimal.ZERO;
    private static final String ROLE_CUSTOMER = "CUSTOMER";

    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;
    private final ApplicationEventPublisher eventPublisher;

    public ManagerServiceImpl(
        OrderRepository orderRepository,
        PaymentRepository paymentRepository,
        UserRepository userRepository,
        ApplicationEventPublisher eventPublisher
    ) {
        this.orderRepository = orderRepository;
        this.paymentRepository = paymentRepository;
        this.userRepository = userRepository;
        this.eventPublisher = eventPublisher;
    }

    @Override
    @Transactional(readOnly = true)
    public ManagerDashboardResponse getDashboard() {
        List<Order> orders = orderRepository.findAll();
        LocalDate today = LocalDate.now();
        LocalDate weekStart = today.minusDays(6);
        LocalDate monthStart = today.withDayOfMonth(1);

        long totalOrders = orders.size();
        long pendingOrders = orders.stream()
            .filter(order -> order.getStatus() == OrderStatus.PENDING)
            .count();
        long unpaidPayLaterOrders = orders.stream()
            .map(Order::getPayment)
            .filter(payment -> payment != null)
            .filter(payment -> payment.getPaymentMethod() == PaymentMethod.PAY_LATER)
            .filter(payment -> payment.getPaymentStatus() == PaymentStatus.PENDING)
            .count();

        BigDecimal todayRevenue = sumPaidOrdersWithin(orders, today, today);
        BigDecimal weekRevenue = sumPaidOrdersWithin(orders, weekStart, today);
        BigDecimal monthRevenue = sumPaidOrdersWithin(orders, monthStart, today);
        List<OrderResponse> recentOrders = orders.stream()
            .sorted(Comparator.comparing(Order::getCreatedAt).reversed())
            .limit(5)
            .map(this::toOrderResponse)
            .toList();

        return new ManagerDashboardResponse(
            totalOrders,
            pendingOrders,
            unpaidPayLaterOrders,
            todayRevenue,
            weekRevenue,
            monthRevenue,
            recentOrders
        );
    }

    @Override
    @Transactional(readOnly = true)
    public List<ManagerPaymentResponse> getPayments(String paymentStatus, String paymentMethod, String search) {
        return paymentRepository.findAll().stream()
            .filter(payment -> matchesPaymentStatus(payment, paymentStatus))
            .filter(payment -> matchesPaymentMethod(payment, paymentMethod))
            .filter(payment -> matchesPaymentSearch(payment, search))
            .sorted(Comparator.comparing((Payment payment) -> payment.getOrder().getCreatedAt()).reversed())
            .map(this::toPaymentResponse)
            .toList();
    }

    @Override
    @Transactional
    public ManagerPaymentResponse confirmPayLaterPayment(Long paymentId, ManagerPaymentConfirmationRequest request) {
        Payment payment = paymentRepository.findById(paymentId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Payment not found"));

        if (payment.getPaymentMethod() != PaymentMethod.PAY_LATER) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Only PAY_LATER payments can be confirmed manually");
        }
        if (payment.getPaymentStatus() == PaymentStatus.PAID) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Payment is already marked as paid");
        }
        if (payment.getPaymentStatus() == PaymentStatus.REFUNDED) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Refunded payments cannot be confirmed again");
        }

        PaymentStatus previousPaymentStatus = payment.getPaymentStatus();
        payment.setPaymentStatus(PaymentStatus.PAID);
        payment.setPaidAt(LocalDateTime.now());
        if (request != null && request.providerTxnId() != null && !request.providerTxnId().isBlank()) {
            payment.setProviderTxnId(request.providerTxnId().trim());
        }
        if (request != null && request.note() != null && !request.note().isBlank()) {
            payment.setProviderResponse(request.note().trim());
        }

        Order order = payment.getOrder();
        OrderStatus previousOrderStatus = order.getStatus();
        if (order.getStatus() == OrderStatus.CANCELLATION_REQUESTED) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Resolve the cancellation request before confirming this payment");
        }
        if (order.getStatus() == OrderStatus.PENDING) {
            order.setStatus(OrderStatus.CONFIRMED);
        }

        Payment savedPayment = paymentRepository.save(payment);
        publishPaymentStatusChanged(savedPayment, previousPaymentStatus);
        publishOrderStatusChanged(order, previousOrderStatus);
        return toPaymentResponse(savedPayment);
    }

    @Override
    @Transactional
    public OrderResponse approveOrderCancellation(Long orderId, OrderCancellationRequest request) {
        Order order = getPendingCancellationOrder(orderId);
        Payment payment = order.getPayment();
        if (payment == null || payment.getPaymentMethod() != PaymentMethod.PAY_LATER || payment.getPaymentStatus() != PaymentStatus.PENDING) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Order is no longer eligible for cancellation approval");
        }

        OrderStatus previousOrderStatus = order.getStatus();
        PaymentStatus previousPaymentStatus = payment.getPaymentStatus();
        order.setStatus(OrderStatus.CANCELLED);
        order.setCancellationReviewNote(normalizeOptional(request == null ? null : request.reviewNote()));
        order.setCancellationReviewedAt(LocalDateTime.now());
        payment.setPaymentStatus(PaymentStatus.CANCELLED);
        payment.setProviderResponse("Cancelled after manager approval");

        Order savedOrder = orderRepository.save(order);
        publishOrderStatusChanged(savedOrder, previousOrderStatus);
        publishPaymentStatusChanged(payment, previousPaymentStatus);
        return toOrderResponse(savedOrder);
    }

    @Override
    @Transactional
    public OrderResponse rejectOrderCancellation(Long orderId, OrderCancellationRequest request) {
        Order order = getPendingCancellationOrder(orderId);
        OrderStatus previousStatus = order.getCancellationRequestedFromStatus() == null
            ? OrderStatus.PENDING
            : order.getCancellationRequestedFromStatus();

        OrderStatus currentStatus = order.getStatus();
        order.setStatus(previousStatus);
        order.setCancellationReviewNote(normalizeOptional(request == null ? null : request.reviewNote()));
        order.setCancellationReviewedAt(LocalDateTime.now());

        Order savedOrder = orderRepository.save(order);
        publishOrderStatusChanged(savedOrder, currentStatus);
        return toOrderResponse(savedOrder);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ManagerCustomerResponse> getCustomers(String search) {
        List<Order> orders = orderRepository.findAll();

        return userRepository.findAll().stream()
            .filter(this::isCustomer)
            .filter(user -> matchesCustomerSearch(user, search))
            .sorted(Comparator.comparing(User::getCreatedAt).reversed())
            .map(user -> toCustomerResponse(user, orders))
            .toList();
    }

    private boolean isCustomer(User user) {
        return user.getRoles().stream().map(Role::getName).anyMatch(ROLE_CUSTOMER::equals);
    }

    private Order getPendingCancellationOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found"));

        if (order.getStatus() != OrderStatus.CANCELLATION_REQUESTED) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Order does not have a pending cancellation request");
        }

        return order;
    }

    private boolean matchesCustomerSearch(User user, String rawSearch) {
        if (isBlank(rawSearch)) {
            return true;
        }
        String search = rawSearch.trim().toLowerCase(Locale.ROOT);
        return containsIgnoreCase(user.getUsername(), search)
            || containsIgnoreCase(user.getEmail(), search)
            || containsIgnoreCase(user.getFirstName(), search)
            || containsIgnoreCase(user.getLastName(), search);
    }

    private boolean matchesPaymentStatus(Payment payment, String rawStatus) {
        if (isBlank(rawStatus)) {
            return true;
        }
        try {
            return payment.getPaymentStatus() == PaymentStatus.valueOf(rawStatus.trim().toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException exception) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid payment status filter");
        }
    }

    private boolean matchesPaymentMethod(Payment payment, String rawMethod) {
        if (isBlank(rawMethod)) {
            return true;
        }
        try {
            return payment.getPaymentMethod() == PaymentMethod.valueOf(rawMethod.trim().toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException exception) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid payment method filter");
        }
    }

    private boolean matchesPaymentSearch(Payment payment, String rawSearch) {
        if (isBlank(rawSearch)) {
            return true;
        }
        String search = rawSearch.trim().toLowerCase(Locale.ROOT);
        Order order = payment.getOrder();
        Shipment shipment = order.getShipment();

        return containsIgnoreCase(order.getOrderNumber(), search)
            || containsIgnoreCase(order.getCustomerEmail(), search)
            || containsIgnoreCase(payment.getTransactionReference(), search)
            || containsIgnoreCase(payment.getProviderTxnId(), search)
            || containsIgnoreCase(shipment == null ? null : shipment.getRecipientName(), search)
            || containsIgnoreCase(shipment == null ? null : shipment.getPhoneNumber(), search);
    }

    private BigDecimal sumPaidOrdersWithin(List<Order> orders, LocalDate fromDate, LocalDate toDate) {
        return orders.stream()
            .map(Order::getPayment)
            .filter(payment -> payment != null && payment.getPaymentStatus() == PaymentStatus.PAID)
            .filter(payment -> isWithinRange(payment.getPaidAt(), fromDate, toDate))
            .map(Payment::getAmount)
            .reduce(ZERO, BigDecimal::add);
    }

    private boolean isWithinRange(LocalDateTime timestamp, LocalDate fromDate, LocalDate toDate) {
        if (timestamp == null) {
            return false;
        }
        LocalDate date = timestamp.toLocalDate();
        return !date.isBefore(fromDate) && !date.isAfter(toDate);
    }

    private ManagerCustomerResponse toCustomerResponse(User user, List<Order> orders) {
        List<Order> customerOrders = orders.stream()
            .filter(order -> order.getUser() != null)
            .filter(order -> user.getId().equals(order.getUser().getId()))
            .toList();

        BigDecimal totalSpent = customerOrders.stream()
            .map(Order::getPayment)
            .filter(payment -> payment != null && payment.getPaymentStatus() == PaymentStatus.PAID)
            .map(Payment::getAmount)
            .reduce(ZERO, BigDecimal::add);

        return new ManagerCustomerResponse(
            user.getId(),
            user.getUsername(),
            user.getEmail(),
            user.getFirstName(),
            user.getLastName(),
            user.getActive(),
            user.getVerified(),
            customerOrders.size(),
            totalSpent,
            user.getCreatedAt()
        );
    }

    private ManagerPaymentResponse toPaymentResponse(Payment payment) {
        Order order = payment.getOrder();
        Shipment shipment = order.getShipment();

        return new ManagerPaymentResponse(
            payment.getId(),
            order.getId(),
            order.getOrderNumber(),
            shipment == null ? null : shipment.getRecipientName(),
            order.getCustomerEmail(),
            payment.getAmount(),
            payment.getCurrency(),
            payment.getPaymentMethod().name(),
            payment.getPaymentStatus().name(),
            payment.getTransactionReference(),
            payment.getProviderTxnId(),
            payment.getProviderResponse(),
            payment.getPaidAt(),
            order.getCreatedAt()
        );
    }

    private OrderResponse toOrderResponse(Order order) {
        Shipment shipment = order.getShipment();
        Payment payment = order.getPayment();
        return new OrderResponse(
            order.getId(),
            order.getUser() == null ? null : order.getUser().getId(),
            order.getOrderNumber(),
            order.getStatus().name(),
            order.getSubtotal(),
            order.getShippingFee(),
            order.getDiscountAmount(),
            order.getRegistrationFee(),
            Boolean.TRUE.equals(order.getIncludeRegistrationService()),
            order.getTotalAmount(),
            payment == null ? null : payment.getPaymentMethod().name(),
            payment == null ? null : payment.getPaymentStatus().name(),
            order.getNotes(),
            order.getCustomerEmail(),
            order.getCancellationReason(),
            order.getCancellationReviewNote(),
            order.getCancellationRequestedFromStatus() == null ? null : order.getCancellationRequestedFromStatus().name(),
            order.getCancellationRequestedBy() == null ? null : order.getCancellationRequestedBy().getId(),
            order.getCancellationRequestedAt(),
            order.getCancellationReviewedAt(),
            order.getCreatedAt(),
            order.getUpdatedAt(),
            order.getItems().stream()
                .sorted(Comparator.comparing(OrderItem::getId))
                .map(item -> new com.ebike.orderModule.dto.response.OrderItemResponse(
                    item.getId(),
                    item.getProduct().getId(),
                    item.getProductName(),
                    item.getUnitPrice(),
                    item.getQuantity(),
                    item.getLineTotal()
                ))
                .toList(),
            shipment == null ? null : new com.ebike.orderModule.dto.response.ShipmentResponse(
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
                shipment.getPickupShowroom() == null ? null : new com.ebike.orderModule.dto.response.ShowroomResponse(
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

    private boolean containsIgnoreCase(String value, String search) {
        return value != null && value.toLowerCase(Locale.ROOT).contains(search);
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }

    private String normalizeOptional(String value) {
        return isBlank(value) ? null : value.trim();
    }

    private void publishOrderStatusChanged(Order order, OrderStatus previousStatus) {
        eventPublisher.publishEvent(new OrderStatusChangedEvent(
            order.getId(),
            order.getUser() == null ? null : order.getUser().getId(),
            order.getOrderNumber(),
            previousStatus == null ? null : previousStatus.name(),
            order.getStatus().name()
        ));
    }

    private void publishPaymentStatusChanged(Payment payment, PaymentStatus previousStatus) {
        Order order = payment.getOrder();
        eventPublisher.publishEvent(new PaymentStatusChangedEvent(
            payment.getId(),
            order.getId(),
            order.getUser() == null ? null : order.getUser().getId(),
            order.getOrderNumber(),
            payment.getPaymentMethod().name(),
            previousStatus == null ? null : previousStatus.name(),
            payment.getPaymentStatus().name(),
            payment.getAmount()
        ));
    }
}
