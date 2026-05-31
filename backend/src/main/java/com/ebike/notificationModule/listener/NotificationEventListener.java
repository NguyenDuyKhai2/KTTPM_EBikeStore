package com.ebike.notificationModule.listener;

import com.ebike.authModule.entity.User;
import com.ebike.authModule.repository.UserRepository;
import com.ebike.notificationModule.entity.Notification;
import com.ebike.notificationModule.entity.NotificationType;
import com.ebike.notificationModule.event.OrderCreatedEvent;
import com.ebike.notificationModule.event.OrderStatusChangedEvent;
import com.ebike.notificationModule.event.PaymentStatusChangedEvent;
import com.ebike.notificationModule.repository.NotificationRepository;
import com.ebike.orderModule.entity.Order;
import com.ebike.orderModule.entity.Payment;
import com.ebike.orderModule.repository.OrderRepository;
import com.ebike.orderModule.repository.PaymentRepository;
import java.util.LinkedHashSet;
import java.util.Set;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
public class NotificationEventListener {

    private static final Logger log = LoggerFactory.getLogger(NotificationEventListener.class);

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;

    public NotificationEventListener(
        NotificationRepository notificationRepository,
        UserRepository userRepository,
        OrderRepository orderRepository,
        PaymentRepository paymentRepository
    ) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
        this.paymentRepository = paymentRepository;
    }

    @Async
    @Transactional
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onOrderCreated(OrderCreatedEvent event) {
        try {
            Order order = orderRepository.findById(event.orderId()).orElse(null);
            Set<User> recipients = new LinkedHashSet<>();
            recipients.addAll(userRepository.findByRolesName("MANAGER"));
            recipients.addAll(userRepository.findByRolesName("ADMIN"));

            for (User user : recipients) {
                createNotification(
                    user,
                    NotificationType.ORDER_CREATED,
                    "Có đơn hàng mới",
                    "Đơn " + event.orderNumber() + " vừa được tạo bởi " + safeEmail(event.customerEmail()) + ".",
                    "/manager/orders/" + event.orderId(),
                    order,
                    null
                );
            }
        } catch (RuntimeException exception) {
            log.warn("Could not create order-created notifications for order {}", event.orderId(), exception);
        }
    }

    @Async
    @Transactional
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onOrderStatusChanged(OrderStatusChangedEvent event) {
        try {
            if (event.previousStatus() != null && event.previousStatus().equals(event.currentStatus())) {
                return;
            }

            Order order = orderRepository.findById(event.orderId()).orElse(null);
            if (event.userId() != null) {
                userRepository.findById(event.userId()).ifPresent(user -> createNotification(
                    user,
                    NotificationType.ORDER_STATUS_CHANGED,
                    "Trạng thái đơn hàng đã thay đổi",
                    "Đơn " + event.orderNumber() + " chuyển từ " + event.previousStatus() + " sang " + event.currentStatus() + ".",
                    "/customer/orders",
                    order,
                    null
                ));
            }
        } catch (RuntimeException exception) {
            log.warn("Could not create order-status notification for order {}", event.orderId(), exception);
        }
    }

    @Async
    @Transactional
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onPaymentStatusChanged(PaymentStatusChangedEvent event) {
        try {
            if (event.previousStatus() != null && event.previousStatus().equals(event.currentStatus())) {
                return;
            }

            Order order = orderRepository.findById(event.orderId()).orElse(null);
            Payment payment = paymentRepository.findById(event.paymentId()).orElse(null);

            if (event.userId() != null) {
                userRepository.findById(event.userId()).ifPresent(user -> createNotification(
                    user,
                    NotificationType.PAYMENT_STATUS_CHANGED,
                    "Thanh toán đã cập nhật",
                    "Thanh toán " + event.paymentMethod() + " cho đơn " + event.orderNumber() + " hiện là " + event.currentStatus() + ".",
                    "/customer/orders",
                    order,
                    payment
                ));
            }

            Set<User> staffRecipients = new LinkedHashSet<>();
            staffRecipients.addAll(userRepository.findByRolesName("MANAGER"));
            staffRecipients.addAll(userRepository.findByRolesName("ADMIN"));
            for (User user : staffRecipients) {
                createNotification(
                    user,
                    NotificationType.PAYMENT_STATUS_CHANGED,
                    "Thanh toán đơn hàng đã cập nhật",
                    "Thanh toán của đơn " + event.orderNumber() + " chuyển từ " + event.previousStatus() + " sang " + event.currentStatus() + ".",
                    "/manager/payments",
                    order,
                    payment
                );
            }
        } catch (RuntimeException exception) {
            log.warn("Could not create payment-status notifications for payment {}", event.paymentId(), exception);
        }
    }

    private void createNotification(
        User user,
        NotificationType type,
        String title,
        String message,
        String targetUrl,
        Order order,
        Payment payment
    ) {
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setType(type);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setTargetUrl(targetUrl);
        notification.setOrder(order);
        notification.setPayment(payment);
        notificationRepository.save(notification);
    }

    private String safeEmail(String email) {
        return email == null || email.isBlank() ? "khách hàng" : email;
    }
}
