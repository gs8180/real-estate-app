package com.realestate.backend.notification.service;

import com.realestate.backend.notification.entity.Notification;
import com.realestate.backend.notification.repository.NotificationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationService(
            NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public Notification createNotification(
            String type,
            String message,
            String username,
            Long propertyId) {

        Notification notification = new Notification(
                type,
                message,
                username,
                propertyId
        );

        return notificationRepository.save(notification);
    }

    public List<Notification> getAllNotifications() {
        return notificationRepository.findAll();
    }

    public List<Notification> getByUsername(
            String username) {

        return notificationRepository.findByUsername(username);
    }

    public List<Notification> getByPropertyId(
            Long propertyId) {

        return notificationRepository.findByPropertyId(propertyId);
    }

    public List<Notification> getUnreadByUsername(
            String username) {

        return notificationRepository
                .findByUsernameAndReadStatus(username, false);
    }

    public Notification markAsRead(Long notificationId) {

        Notification notification =
                notificationRepository.findById(notificationId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Notification not found: "
                                                + notificationId));

        notification.setReadStatus(true);

        return notificationRepository.save(notification);
    }
}