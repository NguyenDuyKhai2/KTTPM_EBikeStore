package com.ebike.orderModule.service;

import com.ebike.authModule.entity.User;
import com.ebike.orderModule.entity.Order;
import com.ebike.orderModule.repository.OrderRepository;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class GuestOrderLinkService {

    private final OrderRepository orderRepository;

    public GuestOrderLinkService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @Transactional
    public int linkGuestOrdersToUser(User user) {
        if (user == null || user.getEmail() == null || user.getEmail().isBlank()) {
            return 0;
        }

        String normalizedEmail = user.getEmail().trim().toLowerCase(Locale.ROOT);
        List<Order> guestOrders = new ArrayList<>(orderRepository.findByUserIsNullAndCustomerEmail(normalizedEmail));
        if (guestOrders.isEmpty()) {
            return 0;
        }

        for (Order order : guestOrders) {
            order.setUser(user);
        }
        orderRepository.saveAll(guestOrders);
        return guestOrders.size();
    }
}
