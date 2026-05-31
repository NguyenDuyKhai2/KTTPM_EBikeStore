package com.ebike.notificationModule.service;

import com.ebike.notificationModule.dto.response.NotificationResponse;
import com.ebike.notificationModule.dto.response.UnreadNotificationCountResponse;
import java.util.List;
import org.springframework.security.core.Authentication;

public interface NotificationService {
    List<NotificationResponse> getMyNotifications(Authentication authentication);

    UnreadNotificationCountResponse getUnreadCount(Authentication authentication);

    NotificationResponse markRead(Long id, Authentication authentication);

    void markAllRead(Authentication authentication);
}
