package com.realestate.backend.cma.dto;

public class ComparablePropertyResponse {

    private Long propertyId;
    private String address;
    private String city;
    private String state;
    private String zipCode;
    private String propertyType;
    private Double price;
    private Double priceDifference;
    private Double priceDifferencePercentage;

    public ComparablePropertyResponse() {
    }

    public ComparablePropertyResponse(
            Long propertyId,
            String address,
            String city,
            String state,
            String zipCode,
            String propertyType,
            Double price,
            Double priceDifference,
            Double priceDifferencePercentage) {

        this.propertyId = propertyId;
        this.address = address;
        this.city = city;
        this.state = state;
        this.zipCode = zipCode;
        this.propertyType = propertyType;
        this.price = price;
        this.priceDifference = priceDifference;
        this.priceDifferencePercentage = priceDifferencePercentage;
    }

    public Long getPropertyId() {
        return propertyId;
    }

    public String getAddress() {
        return address;
    }

    public String getCity() {
        return city;
    }

    public String getState() {
        return state;
    }

    public String getZipCode() {
        return zipCode;
    }

    public String getPropertyType() {
        return propertyType;
    }

    public Double getPrice() {
        return price;
    }

    public Double getPriceDifference() {
        return priceDifference;
    }

    public Double getPriceDifferencePercentage() {
        return priceDifferencePercentage;
    }
}