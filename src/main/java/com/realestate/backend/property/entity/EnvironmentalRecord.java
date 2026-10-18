package com.realestate.backend.property.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "environmental_records")
public class EnvironmentalRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "property_id", nullable = false)
    private Property property;

    private String recordType;

    private String riskLevel;

    private String description;

    private String source;

    public EnvironmentalRecord() {
    }

    public EnvironmentalRecord(
            Property property,
            String recordType,
            String riskLevel,
            String description,
            String source) {

        this.property = property;
        this.recordType = recordType;
        this.riskLevel = riskLevel;
        this.description = description;
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

    public String getRecordType() {
        return recordType;
    }

    public void setRecordType(String recordType) {
        this.recordType = recordType;
    }

    public String getRiskLevel() {
        return riskLevel;
    }

    public void setRiskLevel(String riskLevel) {
        this.riskLevel = riskLevel;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }
}