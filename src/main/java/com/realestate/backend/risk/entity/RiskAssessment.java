package com.realestate.backend.risk.entity;

import com.realestate.backend.property.entity.Property;
import jakarta.persistence.*;

@Entity
@Table(name = "risk_assessments")
public class RiskAssessment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "property_id", nullable = false, unique = true)
    private Property property;

    private Double ownershipRisk;
    private Double taxRisk;
    private Double zoningRisk;
    private Double floodRisk;
    private Double permitRisk;
    private Double environmentalRisk;
    private Double utilityRisk;

    private Double overallRiskScore;

    private String riskLevel;

    public RiskAssessment() {
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

    public Double getOwnershipRisk() {
        return ownershipRisk;
    }

    public void setOwnershipRisk(Double ownershipRisk) {
        this.ownershipRisk = ownershipRisk;
    }

    public Double getTaxRisk() {
        return taxRisk;
    }

    public void setTaxRisk(Double taxRisk) {
        this.taxRisk = taxRisk;
    }

    public Double getZoningRisk() {
        return zoningRisk;
    }

    public void setZoningRisk(Double zoningRisk) {
        this.zoningRisk = zoningRisk;
    }

    public Double getFloodRisk() {
        return floodRisk;
    }

    public void setFloodRisk(Double floodRisk) {
        this.floodRisk = floodRisk;
    }

    public Double getPermitRisk() {
        return permitRisk;
    }

    public void setPermitRisk(Double permitRisk) {
        this.permitRisk = permitRisk;
    }

    public Double getEnvironmentalRisk() {
        return environmentalRisk;
    }

    public void setEnvironmentalRisk(Double environmentalRisk) {
        this.environmentalRisk = environmentalRisk;
    }

    public Double getUtilityRisk() {
        return utilityRisk;
    }

    public void setUtilityRisk(Double utilityRisk) {
        this.utilityRisk = utilityRisk;
    }

    public Double getOverallRiskScore() {
        return overallRiskScore;
    }

    public void setOverallRiskScore(Double overallRiskScore) {
        this.overallRiskScore = overallRiskScore;
    }

    public String getRiskLevel() {
        return riskLevel;
    }

    public void setRiskLevel(String riskLevel) {
        this.riskLevel = riskLevel;
    }
}