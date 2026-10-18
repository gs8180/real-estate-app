package com.realestate.backend.cma.dto;

public class MarketAnalysisResponse {

    private Long propertyId;
    private Double targetPrice;
    private Double averageComparablePrice;
    private Double priceDifference;
    private Double priceDifferencePercentage;
    private Integer comparableCount;

    public MarketAnalysisResponse() {
    }

    public MarketAnalysisResponse(
            Long propertyId,
            Double targetPrice,
            Double averageComparablePrice,
            Double priceDifference,
            Double priceDifferencePercentage,
            Integer comparableCount) {

        this.propertyId = propertyId;
        this.targetPrice = targetPrice;
        this.averageComparablePrice = averageComparablePrice;
        this.priceDifference = priceDifference;
        this.priceDifferencePercentage = priceDifferencePercentage;
        this.comparableCount = comparableCount;
    }

    public Long getPropertyId() {
        return propertyId;
    }

    public Double getTargetPrice() {
        return targetPrice;
    }

    public Double getAverageComparablePrice() {
        return averageComparablePrice;
    }

    public Double getPriceDifference() {
        return priceDifference;
    }

    public Double getPriceDifferencePercentage() {
        return priceDifferencePercentage;
    }

    public Integer getComparableCount() {
        return comparableCount;
    }
}