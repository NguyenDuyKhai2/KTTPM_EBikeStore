package com.ebike.managerModule.controller;

import com.ebike.managerModule.dto.request.ManagerPaymentConfirmationRequest;
import com.ebike.managerModule.dto.response.ManagerCustomerResponse;
import com.ebike.managerModule.dto.response.ManagerDashboardResponse;
import com.ebike.managerModule.dto.response.ManagerPaymentResponse;
import com.ebike.managerModule.service.ManagerService;
import com.ebike.shared.constants.PermissionConstants;
import java.util.List;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/manager")
public class ManagerController {

    private final ManagerService managerService;

    public ManagerController(ManagerService managerService) {
        this.managerService = managerService;
    }

    @GetMapping("/dashboard")
    @PreAuthorize("hasAuthority('" + PermissionConstants.Reporting.DASHBOARD_VIEW + "')")
    public ManagerDashboardResponse getDashboard() {
        return managerService.getDashboard();
    }

    @GetMapping("/payments")
    @PreAuthorize("hasAuthority('" + PermissionConstants.OrderManagement.PAYMENT_VERIFY + "')")
    public List<ManagerPaymentResponse> getPayments(
        @RequestParam(required = false) String paymentStatus,
        @RequestParam(required = false) String paymentMethod,
        @RequestParam(required = false) String search
    ) {
        return managerService.getPayments(paymentStatus, paymentMethod, search);
    }

    @PatchMapping("/payments/{paymentId}/confirm")
    @PreAuthorize("hasAuthority('" + PermissionConstants.OrderManagement.PAYMENT_VERIFY + "')")
    public ManagerPaymentResponse confirmPayLaterPayment(
        @PathVariable Long paymentId,
        @RequestBody(required = false) ManagerPaymentConfirmationRequest request
    ) {
        return managerService.confirmPayLaterPayment(paymentId, request);
    }

    @GetMapping("/customers")
    @PreAuthorize("hasAuthority('" + PermissionConstants.UserManagement.USER_VIEW + "')")
    public List<ManagerCustomerResponse> getCustomers(@RequestParam(required = false) String search) {
        return managerService.getCustomers(search);
    }
}
