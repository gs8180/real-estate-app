package com.realestate.backend.property.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "property_history")
public class PropertyHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "property_id", nullable = false)
    private Property property;

    @Column(nullable = false)
    private String action;

    @Column(nullable = false)
    private LocalDateTime changedAt;

    public PropertyHistory() {
    }

    public PropertyHistory(
            Property property,
            String action,
            LocalDateTime changedAt) {

        this.property = property;
        this.action = action;
        this.changedAt = changedAt;
    }

    public Long getId() {
        return id;
    }

    public Property getProperty() {
        return property;
    }

    public void setProperty(Property property) {
        this.property = property;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public LocalDateTime getChangedAt() {
        return changedAt;
    }

    public void setChangedAt(LocalDateTime changedAt) {
        this.changedAt = changedAt;
    }
}