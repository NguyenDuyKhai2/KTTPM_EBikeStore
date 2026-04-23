package com.ebike.managerModule.service;

import com.ebike.managerModule.dto.request.ManagerPaymentConfirmationRequest;
import com.ebike.managerModule.dto.response.ManagerCustomerResponse;
import com.ebike.managerModule.dto.response.ManagerDashboardResponse;
import com.ebike.managerModule.dto.response.ManagerPaymentResponse;
import java.util.List;

public interface ManagerService {

    ManagerDashboardResponse getDashboard();

    List<ManagerPaymentResponse> getPayments(String paymentStatus, String paymentMethod, String search);

    ManagerPaymentResponse confirmPayLaterPayment(Long paymentId, ManagerPaymentConfirmationRequest request);

    List<ManagerCustomerResponse> getCustomers(String search);
}
