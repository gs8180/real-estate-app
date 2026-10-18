package com.realestate.backend.notification.repository;

import com.realestate.backend.notification.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository
        extends JpaRepository<Notification, Long> {

    List<Notification> findByUsername(String username);

    List<Notification> findByPropertyId(Long propertyId);

    List<Notification> findByUsernameAndReadStatus(
            String username,
            boolean readStatus
    );
}