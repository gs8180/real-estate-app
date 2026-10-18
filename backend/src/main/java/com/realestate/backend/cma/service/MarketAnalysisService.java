package com.realestate.backend.cma.service;

import com.realestate.backend.cma.dto.ComparablePropertyResponse;
import com.realestate.backend.cma.dto.MarketAnalysisResponse;

import com.realestate.backend.property.entity.Property;
import com.realestate.backend.property.repository.PropertyRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MarketAnalysisService {

    private final PropertyRepository propertyRepository;
    private final ComparablePropertyService comparablePropertyService;

    public MarketAnalysisService(
            PropertyRepository propertyRepository,
            ComparablePropertyService comparablePropertyService) {

        this.propertyRepository = propertyRepository;
        this.comparablePropertyService = comparablePropertyService;
    }

    public MarketAnalysisResponse analyzeMarket(Long propertyId) {

        Property targetProperty = propertyRepository.findById(propertyId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Property not found: " + propertyId));

        List<ComparablePropertyResponse> comparables =
                comparablePropertyService.findComparables(propertyId);

        double targetPrice = targetProperty.getPrice() != null
                ? targetProperty.getPrice()
                : 0.0;

        if (comparables.isEmpty()) {
            return new MarketAnalysisResponse(
                    propertyId,
                    targetPrice,
                    0.0,
                    0.0,
                    0.0,
                    0
            );
        }

        double averageComparablePrice =
                comparables.stream()
                        .mapToDouble(ComparablePropertyResponse::getPrice)
                        .average()
                        .orElse(0.0);

        double priceDifference =
                averageComparablePrice - targetPrice;

        double priceDifferencePercentage =
                targetPrice > 0
                        ? (priceDifference / targetPrice) * 100
                        : 0.0;

        return new MarketAnalysisResponse(
                propertyId,
                round(targetPrice),
                round(averageComparablePrice),
                round(priceDifference),
                round(priceDifferencePercentage),
                comparables.size()
        );
    }

    private double round(double value) {
        return Math.round(value * 100.0) / 100.0;
    }
}