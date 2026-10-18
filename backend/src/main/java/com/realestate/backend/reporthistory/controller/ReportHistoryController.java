package com.realestate.backend.reporthistory.controller;

import com.realestate.backend.reporthistory.entity.ReportHistory;
import com.realestate.backend.reporthistory.service.ReportHistoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/report-history")
public class ReportHistoryController {

    private final ReportHistoryService reportHistoryService;

    public ReportHistoryController(
            ReportHistoryService reportHistoryService) {

        this.reportHistoryService = reportHistoryService;
    }

    @PostMapping
    public ResponseEntity<ReportHistory> createHistory(
            @RequestParam Long propertyId,
            @RequestParam String reportType,
            @RequestParam String generatedBy,
            @RequestParam String status) {

        ReportHistory history =
                reportHistoryService.createHistory(
                        propertyId,
                        reportType,
                        generatedBy,
                        status
                );

        return ResponseEntity.ok(history);
    }

    @GetMapping
    public ResponseEntity<List<ReportHistory>> getAllHistory() {
        return ResponseEntity.ok(
                reportHistoryService.getAllHistory()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReportHistory> getById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                reportHistoryService.getById(id)
        );
    }

    @GetMapping("/property/{propertyId}")
    public ResponseEntity<List<ReportHistory>> getByPropertyId(
            @PathVariable Long propertyId) {

        return ResponseEntity.ok(
                reportHistoryService.getByPropertyId(propertyId)
        );
    }

    @GetMapping("/user/{generatedBy}")
    public ResponseEntity<List<ReportHistory>> getByGeneratedBy(
            @PathVariable String generatedBy) {

        return ResponseEntity.ok(
                reportHistoryService.getByGeneratedBy(generatedBy)
        );
    }

    @GetMapping("/type/{reportType}")
    public ResponseEntity<List<ReportHistory>> getByReportType(
            @PathVariable String reportType) {

        return ResponseEntity.ok(
                reportHistoryService.getByReportType(reportType)
        );
    }
}