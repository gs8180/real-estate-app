package com.realestate.backend.service;

import com.realestate.backend.dto.AuditLogDTO;

import java.util.List;

public interface AuditLogService {
    AuditLogDTO recordLog(AuditLogDTO dto);
    AuditLogDTO recordLog(Long propertyId, String action, String category, String operator, String details, String status, String ipAddress);
    List<AuditLogDTO> getRecentLogs(int limit);
    List<AuditLogDTO> getLogsByProperty(Long propertyId);
    List<AuditLogDTO> getLogsByCategory(String category);
}
