package com.realestate.backend.report.excel;

import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reports")
public class ReportExcelController {

    private final ReportExcelService reportExcelService;

    public ReportExcelController(
            ReportExcelService reportExcelService) {
        this.reportExcelService = reportExcelService;
    }

    @GetMapping("/property/{propertyId}/excel")
    public ResponseEntity<byte[]> generateExcel(
            @PathVariable Long propertyId) {

        byte[] excel =
                reportExcelService.generateExcel(propertyId);

        HttpHeaders headers = new HttpHeaders();

        headers.setContentType(
                MediaType.parseMediaType(
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                )
        );

        headers.setContentDisposition(
                ContentDisposition.attachment()
                        .filename(
                                "due-diligence-report-"
                                        + propertyId
                                        + ".xlsx"
                        )
                        .build()
        );

        return ResponseEntity.ok()
                .headers(headers)
                .body(excel);
    }
}