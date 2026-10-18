package com.realestate.backend.risk.controller;

import com.realestate.backend.risk.entity.RiskAssessment;
import com.realestate.backend.risk.service.RiskAssessmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/risk")
public class RiskAssessmentController {

    private final RiskAssessmentService riskAssessmentService;

    public RiskAssessmentController(
            RiskAssessmentService riskAssessmentService) {
        this.riskAssessmentService = riskAssessmentService;
    }

    @PostMapping("/property/{propertyId}/calculate")
    public ResponseEntity<RiskAssessment> calculateRisk(
            @PathVariable Long propertyId) {

        return ResponseEntity.ok(
                riskAssessmentService.calculateRisk(propertyId)
        );
    }

    @GetMapping("/property/{propertyId}")
    public ResponseEntity<RiskAssessment> getRisk(
            @PathVariable Long propertyId) {

        return ResponseEntity.ok(
                riskAssessmentService.getRiskByPropertyId(propertyId)
        );
    }
}