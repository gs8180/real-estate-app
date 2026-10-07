package com.realestate.backend.controller;

import com.realestate.backend.dto.ApiResponse;
import com.realestate.backend.dto.CmaAnalysisResponseDTO;
import com.realestate.backend.dto.ReportValidationResultDTO;
import com.realestate.backend.service.AuditLogService;
import com.realestate.backend.service.CmaService;
import com.realestate.backend.service.ExcelReportService;
import com.realestate.backend.service.PdfReportService;
import com.realestate.backend.service.ReportValidationService;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "*")
public class ReportController {

    private final CmaService cmaService;
    private final PdfReportService pdfReportService;
    private final ExcelReportService excelReportService;
    private final ReportValidationService reportValidationService;
    private final AuditLogService auditLogService;

    public ReportController(CmaService cmaService,
                            PdfReportService pdfReportService,
                            ExcelReportService excelReportService,
                            ReportValidationService reportValidationService,
                            AuditLogService auditLogService) {
        this.cmaService = cmaService;
        this.pdfReportService = pdfReportService;
        this.excelReportService = excelReportService;
        this.reportValidationService = reportValidationService;
        this.auditLogService = auditLogService;
    }

    @GetMapping("/{propertyId}")
    public ResponseEntity<ApiResponse<CmaAnalysisResponseDTO>> getReportSummary(@PathVariable Long propertyId) {
        CmaAnalysisResponseDTO analysis = cmaService.analyzeProperty(propertyId);
        return ResponseEntity.ok(ApiResponse.success("Due Diligence Report fetched successfully", analysis));
    }

    @GetMapping("/{propertyId}/validate")
    public ResponseEntity<ApiResponse<ReportValidationResultDTO>> validatePropertyReport(@PathVariable Long propertyId) {
        ReportValidationResultDTO validation = reportValidationService.validatePropertyReport(propertyId);
        return ResponseEntity.ok(ApiResponse.success("Property Underwriting and Due Diligence Validation completed", validation));
    }

    @GetMapping("/{propertyId}/pdf")
    public ResponseEntity<InputStreamResource> downloadPdfReport(@PathVariable Long propertyId) {
        ByteArrayInputStream pdfStream = pdfReportService.generatePropertyPdf(propertyId);
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=Due_Diligence_Report_" + propertyId + ".pdf");

        // Record audit event
        try {
            auditLogService.recordLog(
                    propertyId,
                    "PDF_EXPORT",
                    "REPORT_GENERATION",
                    "legal.auditor@mh-rera.gov.in",
                    "Certified Due Diligence PDF dossier exported for Property #" + propertyId,
                    "SUCCESS",
                    "127.0.0.1"
            );
        } catch (Exception ignored) {}

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_PDF)
                .body(new InputStreamResource(pdfStream));
    }

    @GetMapping("/{propertyId}/excel")
    public ResponseEntity<InputStreamResource> downloadExcelReport(@PathVariable Long propertyId) {
        ByteArrayInputStream excelStream = excelReportService.generatePropertyExcel(propertyId);
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=Due_Diligence_Report_" + propertyId + ".xlsx");

        // Record audit event
        try {
            auditLogService.recordLog(
                    propertyId,
                    "EXCEL_EXPORT",
                    "REPORT_GENERATION",
                    "valuation.officer@sbi-capital.in",
                    "Underwriting Financial Model Excel workbook exported for Property #" + propertyId,
                    "SUCCESS",
                    "127.0.0.1"
            );
        } catch (Exception ignored) {}

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(new InputStreamResource(excelStream));
    }
}
