package com.realestate.backend.notification.controller;

import com.realestate.backend.notification.entity.Notification;
import com.realestate.backend.notification.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(
            NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @PostMapping
    public ResponseEntity<Notification> createNotification(
            @RequestParam String type,
            @RequestParam String message,
            @RequestParam(required = false) String username,
            @RequestParam(required = false) Long propertyId) {

        Notification notification =
                notificationService.createNotification(
                        type,
                        message,
                        username,
                        propertyId
                );

        return ResponseEntity.ok(notification);
    }

    @GetMapping
    public ResponseEntity<List<Notification>> getAllNotifications() {
        return ResponseEntity.ok(
                notificationService.getAllNotifications()
        );
    }

    @GetMapping("/user/{username}")
    public ResponseEntity<List<Notification>> getByUsername(
            @PathVariable String username) {

        return ResponseEntity.ok(
                notificationService.getByUsername(username)
        );
    }

    @GetMapping("/property/{propertyId}")
    public ResponseEntity<List<Notification>> getByPropertyId(
            @PathVariable Long propertyId) {

        return ResponseEntity.ok(
                notificationService.getByPropertyId(propertyId)
        );
    }

    @GetMapping("/user/{username}/unread")
    public ResponseEntity<List<Notification>> getUnreadByUsername(
            @PathVariable String username) {

        return ResponseEntity.ok(
                notificationService.getUnreadByUsername(username)
        );
    }

    @PutMapping("/{notificationId}/read")
    public ResponseEntity<Notification> markAsRead(
            @PathVariable Long notificationId) {

        return ResponseEntity.ok(
                notificationService.markAsRead(notificationId)
        );
    }
}