package com.realestate.backend.controller;

import com.realestate.backend.dto.ApiResponse;
import com.realestate.backend.dto.AuditLogDTO;
import com.realestate.backend.service.AuditLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/audit-logs")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class AuditLogController {

    private final AuditLogService auditLogService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<AuditLogDTO>>> getAuditLogs(
            @RequestParam(defaultValue = "50") int limit,
            @RequestParam(required = false) String category) {
        List<AuditLogDTO> logs = (category != null && !category.isBlank())
                ? auditLogService.getLogsByCategory(category)
                : auditLogService.getRecentLogs(limit);
        return ResponseEntity.ok(ApiResponse.success("Audit logs retrieved successfully", logs));
    }

    @GetMapping("/property/{propertyId}")
    public ResponseEntity<ApiResponse<List<AuditLogDTO>>> getPropertyAuditLogs(@PathVariable Long propertyId) {
        List<AuditLogDTO> logs = auditLogService.getLogsByProperty(propertyId);
        return ResponseEntity.ok(ApiResponse.success("Property audit trail retrieved", logs));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<AuditLogDTO>> createAuditLog(@RequestBody AuditLogDTO request) {
        AuditLogDTO created = auditLogService.recordLog(request);
        return ResponseEntity.ok(ApiResponse.success("Audit event recorded", created));
    }
}
