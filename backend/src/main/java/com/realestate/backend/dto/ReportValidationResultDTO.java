package com.realestate.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReportValidationResultDTO {
    private Long propertyId;
    private String propertyTitle;
    private String city;
    private BigDecimal listedPrice;
    private boolean underwritingEligible;
    private Integer overallRiskScore;
    private String riskGrade;
    private String dossierId;
    private LocalDateTime validationTimestamp;
    private String certifyingAuthority;

    // CMA validation breakdown
    private BigDecimal fairMarketValueMin;
    private BigDecimal fairMarketValueMax;
    private BigDecimal fairMarketValueAvg;
    private Double priceVariancePercent;
    private String cmaStatus;
    private Integer compsCount;

    // Statutory Checkpoints
    private String floodClearanceStatus;
    private String municipalTaxStatus;
    private String occupancyCertificateStatus;
    private String encumbranceStatus;
    private String titleDeedStatus;

    // Findings / Check notes
    private List<String> passedChecks;
    private List<String> warnings;
    private String recommendationVerdict;
    private String downloadPdfUrl;
    private String downloadExcelUrl;
}
