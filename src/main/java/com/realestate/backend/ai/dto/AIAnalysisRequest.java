package com.realestate.backend.ai.dto;

public class AIAnalysisRequest {

    private Long propertyId;
    private Double overallRiskScore;
    private String riskLevel;

    private Double averageComparablePrice;
    private Double priceDifferencePercentage;
    private Integer comparableCount;

    public AIAnalysisRequest() {
    }

    public AIAnalysisRequest(
            Long propertyId,
            Double overallRiskScore,
            String riskLevel,
            Double averageComparablePrice,
            Double priceDifferencePercentage,
            Integer comparableCount) {

        this.propertyId = propertyId;
        this.overallRiskScore = overallRiskScore;
        this.riskLevel = riskLevel;
        this.averageComparablePrice = averageComparablePrice;
        this.priceDifferencePercentage = priceDifferencePercentage;
        this.comparableCount = comparableCount;
    }

    public Long getPropertyId() {
        return propertyId;
    }

    public Double getOverallRiskScore() {
        return overallRiskScore;
    }

    public String getRiskLevel() {
        return riskLevel;
    }

    public Double getAverageComparablePrice() {
        return averageComparablePrice;
    }

    public Double getPriceDifferencePercentage() {
        return priceDifferencePercentage;
    }

    public Integer getComparableCount() {
        return comparableCount;
    }

    public void setPropertyId(Long propertyId) {
        this.propertyId = propertyId;
    }

    public void setOverallRiskScore(Double overallRiskScore) {
        this.overallRiskScore = overallRiskScore;
    }

    public void setRiskLevel(String riskLevel) {
        this.riskLevel = riskLevel;
    }

    public void setAverageComparablePrice(Double averageComparablePrice) {
        this.averageComparablePrice = averageComparablePrice;
    }

    public void setPriceDifferencePercentage(
            Double priceDifferencePercentage) {
        this.priceDifferencePercentage = priceDifferencePercentage;
    }

    public void setComparableCount(Integer comparableCount) {
        this.comparableCount = comparableCount;
    }
}