package com.realestate.backend.notification.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String type;

    @Column(nullable = false, length = 2000)
    private String message;

    private String username;

    private Long propertyId;

    @Column(nullable = false)
    private boolean readStatus;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    public Notification() {
    }

    public Notification(
            String type,
            String message,
            String username,
            Long propertyId) {

        this.type = type;
        this.message = message;
        this.username = username;
        this.propertyId = propertyId;
        this.readStatus = false;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public String getType() {
        return type;
    }

    public String getMessage() {
        return message;
    }

    public String getUsername() {
        return username;
    }

    public Long getPropertyId() {
        return propertyId;
    }

    public boolean isReadStatus() {
        return readStatus;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setType(String type) {
        this.type = type;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setPropertyId(Long propertyId) {
        this.propertyId = propertyId;
    }

    public void setReadStatus(boolean readStatus) {
        this.readStatus = readStatus;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}