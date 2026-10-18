package com.realestate.backend.property.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "property_tax_history")
public class PropertyTaxHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "property_id", nullable = false)
    private Property property;

    @Column(nullable = false)
    private Integer taxYear;

    private Double taxAmount;

    private Double amountPaid;

    private String paymentStatus;

    public PropertyTaxHistory() {
    }

    public PropertyTaxHistory(
            Property property,
            Integer taxYear,
            Double taxAmount,
            Double amountPaid,
            String paymentStatus) {

        this.property = property;
        this.taxYear = taxYear;
        this.taxAmount = taxAmount;
        this.amountPaid = amountPaid;
        this.paymentStatus = paymentStatus;
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

    public Integer getTaxYear() {
        return taxYear;
    }

    public void setTaxYear(Integer taxYear) {
        this.taxYear = taxYear;
    }

    public Double getTaxAmount() {
        return taxAmount;
    }

    public void setTaxAmount(Double taxAmount) {
        this.taxAmount = taxAmount;
    }

    public Double getAmountPaid() {
        return amountPaid;
    }

    public void setAmountPaid(Double amountPaid) {
        this.amountPaid = amountPaid;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }
}