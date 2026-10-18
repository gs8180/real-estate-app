package com.realestate.backend.property.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "ownership_records")
public class OwnershipRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "property_id", nullable = false)
    private Property property;

    @Column(nullable = false)
    private String ownerName;

    private String ownershipType;

    public OwnershipRecord() {
    }

    public OwnershipRecord(
            Property property,
            String ownerName,
            String ownershipType) {

        this.property = property;
        this.ownerName = ownerName;
        this.ownershipType = ownershipType;
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

    public String getOwnerName() {
        return ownerName;
    }

    public void setOwnerName(String ownerName) {
        this.ownerName = ownerName;
    }

    public String getOwnershipType() {
        return ownershipType;
    }

    public void setOwnershipType(String ownershipType) {
        this.ownershipType = ownershipType;
    }
}