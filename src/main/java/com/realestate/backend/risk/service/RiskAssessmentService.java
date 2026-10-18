package com.realestate.backend.risk.service;

import com.realestate.backend.property.entity.*;
import com.realestate.backend.property.repository.*;
import com.realestate.backend.risk.entity.RiskAssessment;
import com.realestate.backend.risk.repository.RiskAssessmentRepository;
import com.realestate.backend.utility.entity.UtilityInformation;
import com.realestate.backend.utility.repository.UtilityInformationRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RiskAssessmentService {

    private final RiskAssessmentRepository riskAssessmentRepository;
    private final PropertyRepository propertyRepository;
    private final OwnershipRecordRepository ownershipRepository;
    private final PropertyTaxHistoryRepository taxRepository;
    private final ZoningInformationRepository zoningRepository;
    private final FloodZoneInformationRepository floodRepository;
    private final BuildingPermitRepository permitRepository;
    private final EnvironmentalRecordRepository environmentalRepository;
    private final UtilityInformationRepository utilityRepository;

    public RiskAssessmentService(
            RiskAssessmentRepository riskAssessmentRepository,
            PropertyRepository propertyRepository,
            OwnershipRecordRepository ownershipRepository,
            PropertyTaxHistoryRepository taxRepository,
            ZoningInformationRepository zoningRepository,
            FloodZoneInformationRepository floodRepository,
            BuildingPermitRepository permitRepository,
            EnvironmentalRecordRepository environmentalRepository,
            UtilityInformationRepository utilityRepository) {

        this.riskAssessmentRepository = riskAssessmentRepository;
        this.propertyRepository = propertyRepository;
        this.ownershipRepository = ownershipRepository;
        this.taxRepository = taxRepository;
        this.zoningRepository = zoningRepository;
        this.floodRepository = floodRepository;
        this.permitRepository = permitRepository;
        this.environmentalRepository = environmentalRepository;
        this.utilityRepository = utilityRepository;
    }

    public RiskAssessment calculateRisk(Long propertyId) {

        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() ->
                        new RuntimeException("Property not found: " + propertyId));

        double ownershipRisk = calculateOwnershipRisk(propertyId);
        double taxRisk = calculateTaxRisk(propertyId);
        double zoningRisk = calculateZoningRisk(propertyId);
        double floodRisk = calculateFloodRisk(propertyId);
        double permitRisk = calculatePermitRisk(propertyId);
        double environmentalRisk = calculateEnvironmentalRisk(propertyId);
        double utilityRisk = calculateUtilityRisk(propertyId);

        double overallRiskScore = (
                ownershipRisk +
                taxRisk +
                zoningRisk +
                floodRisk +
                permitRisk +
                environmentalRisk +
                utilityRisk
        ) / 7.0;

        String riskLevel = determineRiskLevel(overallRiskScore);

        RiskAssessment riskAssessment =
                riskAssessmentRepository.findByPropertyId(propertyId)
                        .orElse(new RiskAssessment());

        riskAssessment.setProperty(property);
        riskAssessment.setOwnershipRisk(ownershipRisk);
        riskAssessment.setTaxRisk(taxRisk);
        riskAssessment.setZoningRisk(zoningRisk);
        riskAssessment.setFloodRisk(floodRisk);
        riskAssessment.setPermitRisk(permitRisk);
        riskAssessment.setEnvironmentalRisk(environmentalRisk);
        riskAssessment.setUtilityRisk(utilityRisk);
        riskAssessment.setOverallRiskScore(
                Math.round(overallRiskScore * 100.0) / 100.0
        );
        riskAssessment.setRiskLevel(riskLevel);

        return riskAssessmentRepository.save(riskAssessment);
    }

    private double calculateOwnershipRisk(Long propertyId) {

        List<OwnershipRecord> records =
                ownershipRepository.findByPropertyId(propertyId);

        if (records.isEmpty()) {
            return 80.0;
        }

        return 10.0;
    }

    private double calculateTaxRisk(Long propertyId) {

        List<PropertyTaxHistory> records =
                taxRepository.findByPropertyId(propertyId);

        if (records.isEmpty()) {
            return 70.0;
        }

        boolean hasUnpaidTax = records.stream()
                .anyMatch(record ->
                        record.getPaymentStatus() == null ||
                        !"PAID".equalsIgnoreCase(
                                record.getPaymentStatus()
                        ));

        return hasUnpaidTax ? 70.0 : 10.0;
    }

    private double calculateZoningRisk(Long propertyId) {

        List<ZoningInformation> records =
                zoningRepository.findByPropertyId(propertyId);

        if (records.isEmpty()) {
            return 70.0;
        }

        return 10.0;
    }

    private double calculateFloodRisk(Long propertyId) {

        List<FloodZoneInformation> records =
                floodRepository.findByPropertyId(propertyId);

        if (records.isEmpty()) {
            return 70.0;
        }

        String riskLevel = records.get(0).getRiskLevel();

        if (riskLevel == null) {
            return 50.0;
        }

        return switch (riskLevel.toUpperCase()) {
            case "LOW" -> 10.0;
            case "MEDIUM", "MODERATE" -> 50.0;
            case "HIGH" -> 90.0;
            default -> 50.0;
        };
    }

    private double calculatePermitRisk(Long propertyId) {

        List<BuildingPermit> records =
                permitRepository.findByPropertyId(propertyId);

        if (records.isEmpty()) {
            return 60.0;
        }

        boolean hasRejectedPermit = records.stream()
                .anyMatch(permit ->
                        permit.getStatus() != null &&
                        "REJECTED".equalsIgnoreCase(
                                permit.getStatus()
                        ));

        return hasRejectedPermit ? 80.0 : 10.0;
    }

    private double calculateEnvironmentalRisk(Long propertyId) {

        List<EnvironmentalRecord> records =
                environmentalRepository.findByPropertyId(propertyId);

        if (records.isEmpty()) {
            return 50.0;
        }

        String riskLevel = records.get(0).getRiskLevel();

        if (riskLevel == null) {
            return 50.0;
        }

        return switch (riskLevel.toUpperCase()) {
            case "LOW" -> 10.0;
            case "MEDIUM", "MODERATE" -> 50.0;
            case "HIGH" -> 90.0;
            default -> 50.0;
        };
    }

    private double calculateUtilityRisk(Long propertyId) {

        Optional<UtilityInformation> utility =
                utilityRepository.findByPropertyId(propertyId);

        if (utility.isEmpty()) {
            return 70.0;
        }

        UtilityInformation data = utility.get();

        int unavailableServices = 0;

        if (isUnavailable(data.getWaterSupply())) {
            unavailableServices++;
        }

        if (isUnavailable(data.getElectricity())) {
            unavailableServices++;
        }

        if (isUnavailable(data.getGasSupply())) {
            unavailableServices++;
        }

        if (isUnavailable(data.getSewage())) {
            unavailableServices++;
        }

        if (isUnavailable(data.getInternetAvailability())) {
            unavailableServices++;
        }

        return unavailableServices * 20.0;
    }

    private boolean isUnavailable(String value) {

        return value == null ||
                value.isBlank() ||
                "NO".equalsIgnoreCase(value) ||
                "UNAVAILABLE".equalsIgnoreCase(value);
    }

    private String determineRiskLevel(double score) {

        if (score < 30) {
            return "LOW";
        }

        if (score < 60) {
            return "MEDIUM";
        }

        return "HIGH";
    }

    public RiskAssessment getRiskByPropertyId(Long propertyId) {

        return riskAssessmentRepository.findByPropertyId(propertyId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Risk assessment not found for property: "
                                        + propertyId
                        ));
    }
}