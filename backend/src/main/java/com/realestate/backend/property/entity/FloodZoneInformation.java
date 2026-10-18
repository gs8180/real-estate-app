package com.realestate.backend.property.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "flood_zone_information")
public class FloodZoneInformation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "property_id", nullable = false)
    private Property property;

    private String floodZone;

    private String riskLevel;

    private String source;

    public FloodZoneInformation() {
    }

    public FloodZoneInformation(
            Property property,
            String floodZone,
            String riskLevel,
            String source) {

        this.property = property;
        this.floodZone = floodZone;
        this.riskLevel = riskLevel;
        this.source = source;
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

    public String getFloodZone() {
        return floodZone;
    }

    public void setFloodZone(String floodZone) {
        this.floodZone = floodZone;
    }

    public String getRiskLevel() {
        return riskLevel;
    }

    public void setRiskLevel(String riskLevel) {
        this.riskLevel = riskLevel;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }
}