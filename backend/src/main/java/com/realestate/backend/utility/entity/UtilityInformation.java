package com.realestate.backend.utility.entity;

import com.realestate.backend.property.entity.Property;
import jakarta.persistence.*;

@Entity
@Table(name = "utility_information")
public class UtilityInformation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "property_id", nullable = false)
    private Property property;

    private String waterSupply;
    private String electricity;
    private String gasSupply;
    private String sewage;
    private String internetAvailability;

    public UtilityInformation() {
    }

    public UtilityInformation(
            Property property,
            String waterSupply,
            String electricity,
            String gasSupply,
            String sewage,
            String internetAvailability) {

        this.property = property;
        this.waterSupply = waterSupply;
        this.electricity = electricity;
        this.gasSupply = gasSupply;
        this.sewage = sewage;
        this.internetAvailability = internetAvailability;
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

    public String getWaterSupply() {
        return waterSupply;
    }

    public void setWaterSupply(String waterSupply) {
        this.waterSupply = waterSupply;
    }

    public String getElectricity() {
        return electricity;
    }

    public void setElectricity(String electricity) {
        this.electricity = electricity;
    }

    public String getGasSupply() {
        return gasSupply;
    }

    public void setGasSupply(String gasSupply) {
        this.gasSupply = gasSupply;
    }

    public String getSewage() {
        return sewage;
    }

    public void setSewage(String sewage) {
        this.sewage = sewage;
    }

    public String getInternetAvailability() {
        return internetAvailability;
    }

    public void setInternetAvailability(String internetAvailability) {
        this.internetAvailability = internetAvailability;
    }
}