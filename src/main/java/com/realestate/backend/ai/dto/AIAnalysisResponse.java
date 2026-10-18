package com.realestate.backend.ai.dto;

public class AIAnalysisResponse {

    private Long propertyId;
    private String riskSummary;
    private String marketSummary;
    private String dueDiligenceSummary;
    private String keyFinding;

    public AIAnalysisResponse() {
    }

    public AIAnalysisResponse(
            Long propertyId,
            String riskSummary,
            String marketSummary,
            String dueDiligenceSummary,
            String keyFinding) {

        this.propertyId = propertyId;
        this.riskSummary = riskSummary;
        this.marketSummary = marketSummary;
        this.dueDiligenceSummary = dueDiligenceSummary;
        this.keyFinding = keyFinding;
    }

    public Long getPropertyId() {
        return propertyId;
    }

    public String getRiskSummary() {
        return riskSummary;
    }

    public String getMarketSummary() {
        return marketSummary;
    }

    public String getDueDiligenceSummary() {
        return dueDiligenceSummary;
    }

    public String getKeyFinding() {
        return keyFinding;
    }
}