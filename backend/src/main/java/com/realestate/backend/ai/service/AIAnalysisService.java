package com.realestate.backend.ai.service;

import com.realestate.backend.ai.dto.AIAnalysisRequest;
import com.realestate.backend.ai.dto.AIAnalysisResponse;
import org.springframework.stereotype.Service;

@Service
public class AIAnalysisService {

    public AIAnalysisResponse analyze(AIAnalysisRequest request) {

        String riskSummary = buildRiskSummary(
                request.getOverallRiskScore(),
                request.getRiskLevel()
        );

        String marketSummary = buildMarketSummary(
                request.getAverageComparablePrice(),
                request.getPriceDifferencePercentage(),
                request.getComparableCount()
        );

        String dueDiligenceSummary =
                "The analysis combines the available property risk "
                        + "assessment and comparable-property market data.";

        String keyFinding = buildKeyFinding(
                request.getPriceDifferencePercentage(),
                request.getComparableCount()
        );

        return new AIAnalysisResponse(
                request.getPropertyId(),
                riskSummary,
                marketSummary,
                dueDiligenceSummary,
                keyFinding
        );
    }

    private String buildRiskSummary(
            Double score,
            String riskLevel) {

        if (score == null) {
            return "Risk score is not available.";
        }

        return String.format(
                "The property has a %s overall risk level with a risk score of %.2f.",
                riskLevel != null ? riskLevel : "UNKNOWN",
                score
        );
    }

    private String buildMarketSummary(
            Double averagePrice,
            Double priceDifferencePercentage,
            Integer comparableCount) {

        if (comparableCount == null || comparableCount == 0) {
            return "No comparable-property data is available for market analysis.";
        }

        return String.format(
                "The analysis uses %d comparable properties. "
                        + "The target property's price differs from the "
                        + "comparable average by %.2f%%.",
                comparableCount,
                priceDifferencePercentage != null
                        ? priceDifferencePercentage
                        : 0.0
        );
    }

    private String buildKeyFinding(
            Double priceDifferencePercentage,
            Integer comparableCount) {

        if (comparableCount == null || comparableCount == 0) {
            return "Additional comparable-property data is required.";
        }

        if (priceDifferencePercentage == null) {
            return "Market price comparison is unavailable.";
        }

        /*
         * Current CMA formula:
         *
         * priceDifferencePercentage =
         * (comparableAverage - targetPrice) / targetPrice * 100
         *
         * Therefore:
         * Positive value  -> target price is below average
         * Negative value  -> target price is above average
         */

        if (priceDifferencePercentage > 0) {
            return String.format(
                    "The target property price is %.2f%% below the "
                            + "comparable-property average.",
                    priceDifferencePercentage
            );
        }

        if (priceDifferencePercentage < 0) {
            return String.format(
                    "The target property price is %.2f%% above the "
                            + "comparable-property average.",
                    Math.abs(priceDifferencePercentage)
            );
        }

        return "The target property price matches the comparable-property average.";
    }
}