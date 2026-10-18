package com.realestate.backend.report.controller;

import com.realestate.backend.report.dto.DueDiligenceReportResponse;
import com.realestate.backend.report.service.DueDiligenceReportService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reports")
public class DueDiligenceReportController {

    private final DueDiligenceReportService dueDiligenceReportService;

    public DueDiligenceReportController(
            DueDiligenceReportService dueDiligenceReportService) {
        this.dueDiligenceReportService = dueDiligenceReportService;
    }

    @GetMapping("/property/{propertyId}")
    public ResponseEntity<DueDiligenceReportResponse> generateReport(
            @PathVariable Long propertyId) {

        DueDiligenceReportResponse report =
                dueDiligenceReportService.generateReport(propertyId);

        return ResponseEntity.ok(report);
    }
}