package com.ebike.orderModule.repository;

import com.ebike.orderModule.entity.Payment;
import com.ebike.orderModule.entity.PaymentStatus;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    Optional<Payment> findByOrderId(Long orderId);

    Optional<Payment> findByOrderIdAndPaymentStatus(Long orderId, PaymentStatus paymentStatus);

    Optional<Payment> findByTransactionReference(String transactionReference);
}
