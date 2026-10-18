package com.realestate.backend.property.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "zoning_information")
public class ZoningInformation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "property_id", nullable = false)
    private Property property;

    private String zoningType;

    private String zoningCode;

    private String permittedUse;

    public ZoningInformation() {
    }

    public ZoningInformation(
            Property property,
            String zoningType,
            String zoningCode,
            String permittedUse) {

        this.property = property;
        this.zoningType = zoningType;
        this.zoningCode = zoningCode;
        this.permittedUse = permittedUse;
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

    public String getZoningType() {
        return zoningType;
    }

    public void setZoningType(String zoningType) {
        this.zoningType = zoningType;
    }

    public String getZoningCode() {
        return zoningCode;
    }

    public void setZoningCode(String zoningCode) {
        this.zoningCode = zoningCode;
    }

    public String getPermittedUse() {
        return permittedUse;
    }

    public void setPermittedUse(String permittedUse) {
        this.permittedUse = permittedUse;
    }
}