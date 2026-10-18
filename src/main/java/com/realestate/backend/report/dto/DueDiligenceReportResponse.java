package com.realestate.backend.report.dto;

import com.realestate.backend.ai.dto.AIAnalysisResponse;
import com.realestate.backend.cma.dto.ComparablePropertyResponse;
import com.realestate.backend.cma.dto.MarketAnalysisResponse;
import com.realestate.backend.risk.entity.RiskAssessment;
import com.realestate.backend.property.entity.Property;

import java.util.List;

public class DueDiligenceReportResponse {

    private Property property;

    private RiskAssessment riskAssessment;

    private List<ComparablePropertyResponse> comparableProperties;

    private MarketAnalysisResponse marketAnalysis;

    private AIAnalysisResponse aiAnalysis;

    public DueDiligenceReportResponse(
            Property property,
            RiskAssessment riskAssessment,
            List<ComparablePropertyResponse> comparableProperties,
            MarketAnalysisResponse marketAnalysis,
            AIAnalysisResponse aiAnalysis) {

        this.property = property;
        this.riskAssessment = riskAssessment;
        this.comparableProperties = comparableProperties;
        this.marketAnalysis = marketAnalysis;
        this.aiAnalysis = aiAnalysis;
    }

    public Property getProperty() {
        return property;
    }

    public RiskAssessment getRiskAssessment() {
        return riskAssessment;
    }

    public List<ComparablePropertyResponse> getComparableProperties() {
        return comparableProperties;
    }

    public MarketAnalysisResponse getMarketAnalysis() {
        return marketAnalysis;
    }

    public AIAnalysisResponse getAiAnalysis() {
        return aiAnalysis;
    }
}