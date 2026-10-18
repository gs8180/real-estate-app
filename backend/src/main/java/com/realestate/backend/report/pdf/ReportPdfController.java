package com.realestate.backend.report.pdf;

import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reports")
public class ReportPdfController {

    private final ReportPdfService reportPdfService;

    public ReportPdfController(ReportPdfService reportPdfService) {
        this.reportPdfService = reportPdfService;
    }

    @GetMapping("/property/{propertyId}/pdf")
    public ResponseEntity<byte[]> generatePdf(
            @PathVariable Long propertyId) {

        byte[] pdf = reportPdfService.generatePdf(propertyId);

        HttpHeaders headers = new HttpHeaders();

        headers.setContentType(MediaType.APPLICATION_PDF);

        headers.setContentDisposition(
                ContentDisposition.attachment()
                        .filename("due-diligence-report-" + propertyId + ".pdf")
                        .build()
        );

        return ResponseEntity.ok()
                .headers(headers)
                .body(pdf);
    }
}