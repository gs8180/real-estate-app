package com.realestate.backend.audit.service;

import com.realestate.backend.audit.entity.AuditLog;
import com.realestate.backend.audit.repository.AuditLogRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    public AuditLogService(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    public AuditLog createLog(
            String action,
            String username,
            Long propertyId,
            String details) {

        AuditLog auditLog = new AuditLog(
                action,
                username,
                propertyId,
                details
        );

        return auditLogRepository.save(auditLog);
    }

    public List<AuditLog> getAllLogs() {
        return auditLogRepository.findAll();
    }

    public List<AuditLog> getLogsByProperty(
            Long propertyId) {

        return auditLogRepository.findByPropertyId(propertyId);
    }

    public List<AuditLog> getLogsByUsername(
            String username) {

        return auditLogRepository.findByUsername(username);
    }
}