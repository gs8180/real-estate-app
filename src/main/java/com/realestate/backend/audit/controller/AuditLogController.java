package com.realestate.backend.audit.controller;

import com.realestate.backend.audit.entity.AuditLog;
import com.realestate.backend.audit.service.AuditLogService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/audit")
public class AuditLogController {

    private final AuditLogService auditLogService;

    public AuditLogController(AuditLogService auditLogService) {
        this.auditLogService = auditLogService;
    }

    @PostMapping
    public ResponseEntity<AuditLog> createLog(
            @RequestParam String action,
            @RequestParam(required = false) String username,
            @RequestParam(required = false) Long propertyId,
            @RequestParam(required = false) String details) {

        AuditLog log = auditLogService.createLog(
                action,
                username,
                propertyId,
                details
        );

        return ResponseEntity.ok(log);
    }

    @GetMapping
    public ResponseEntity<List<AuditLog>> getAllLogs() {
        return ResponseEntity.ok(
                auditLogService.getAllLogs()
        );
    }

    @GetMapping("/property/{propertyId}")
    public ResponseEntity<List<AuditLog>> getLogsByProperty(
            @PathVariable Long propertyId) {

        return ResponseEntity.ok(
                auditLogService.getLogsByProperty(propertyId)
        );
    }

    @GetMapping("/user/{username}")
    public ResponseEntity<List<AuditLog>> getLogsByUsername(
            @PathVariable String username) {

        return ResponseEntity.ok(
                auditLogService.getLogsByUsername(username)
        );
    }
}