package com.ebike.notificationModule.service.impl;

import com.ebike.authModule.entity.User;
import com.ebike.authModule.repository.UserRepository;
import com.ebike.notificationModule.dto.response.NotificationResponse;
import com.ebike.notificationModule.dto.response.UnreadNotificationCountResponse;
import com.ebike.notificationModule.entity.Notification;
import com.ebike.notificationModule.repository.NotificationRepository;
import com.ebike.notificationModule.service.NotificationService;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public NotificationServiceImpl(NotificationRepository notificationRepository, UserRepository userRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<NotificationResponse> getMyNotifications(Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).stream()
            .map(this::toResponse)
            .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public UnreadNotificationCountResponse getUnreadCount(Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        return new UnreadNotificationCountResponse(notificationRepository.countByUserIdAndReadAtIsNull(user.getId()));
    }

    @Override
    @Transactional
    public NotificationResponse markRead(Long id, Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        Notification notification = notificationRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Notification not found"));
        if (!notification.getUser().getId().equals(user.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only update your own notifications");
        }
        if (notification.getReadAt() == null) {
            notification.setReadAt(LocalDateTime.now());
        }
        return toResponse(notificationRepository.save(notification));
    }

    @Override
    @Transactional
    public void markAllRead(Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        LocalDateTime now = LocalDateTime.now();
        notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).stream()
            .filter(notification -> notification.getReadAt() == null)
            .forEach(notification -> notification.setReadAt(now));
    }

    private User getAuthenticatedUser(Authentication authentication) {
        if (authentication == null || authentication.getName() == null || authentication.getName().isBlank()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Authentication is required");
        }
        return userRepository.findByUsername(authentication.getName())
            .or(() -> userRepository.findByEmail(authentication.getName()))
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Authenticated user not found"));
    }

    private NotificationResponse toResponse(Notification notification) {
        return new NotificationResponse(
            notification.getId(),
            notification.getType().name(),
            notification.getTitle(),
            notification.getMessage(),
            notification.getTargetUrl(),
            notification.getOrder() == null ? null : notification.getOrder().getId(),
            notification.getPayment() == null ? null : notification.getPayment().getId(),
            notification.getReadAt(),
            notification.getCreatedAt()
        );
    }
}
