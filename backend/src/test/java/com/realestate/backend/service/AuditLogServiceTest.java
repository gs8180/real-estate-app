package com.realestate.backend.service;

import com.realestate.backend.dto.AuditLogDTO;
import com.realestate.backend.entity.AuditLog;
import com.realestate.backend.repository.AuditLogRepository;
import com.realestate.backend.service.impl.AuditLogServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class AuditLogServiceTest {

    private AuditLogRepository auditLogRepository;
    private AuditLogService auditLogService;

    @BeforeEach
    void setUp() {
        auditLogRepository = Mockito.mock(AuditLogRepository.class);
        auditLogService = new AuditLogServiceImpl(auditLogRepository);
    }

    @Test
    void testRecordLog_Success() {
        AuditLog savedEntity = AuditLog.builder()
                .id(101L)
                .propertyId(6L)
                .action("PDF_EXPORT")
                .category("REPORT_GENERATION")
                .operator("auditor@maharashtra-rera.gov.in")
                .details("Generated Due Diligence PDF Dossier")
                .status("SUCCESS")
                .ipAddress("127.0.0.1")
                .createdAt(LocalDateTime.now())
                .build();

        when(auditLogRepository.save(any(AuditLog.class))).thenReturn(savedEntity);

        AuditLogDTO result = auditLogService.recordLog(
                6L, "PDF_EXPORT", "REPORT_GENERATION",
                "auditor@maharashtra-rera.gov.in",
                "Generated Due Diligence PDF Dossier",
                "SUCCESS", "127.0.0.1"
        );

        assertNotNull(result);
        assertEquals(101L, result.getId());
        assertEquals("PDF_EXPORT", result.getAction());
        assertEquals("SUCCESS", result.getStatus());
        verify(auditLogRepository, times(1)).save(any(AuditLog.class));
    }

    @Test
    void testGetRecentLogs_ReturnsMappedList() {
        AuditLog log1 = AuditLog.builder()
                .id(1L)
                .propertyId(6L)
                .action("CMA_VALUATION")
                .category("VALUATION")
                .operator("system")
                .details("CMA computed")
                .status("SUCCESS")
                .createdAt(LocalDateTime.now())
                .build();

        when(auditLogRepository.findAllByOrderByCreatedAtDesc()).thenReturn(List.of(log1));

        List<AuditLogDTO> results = auditLogService.getRecentLogs(10);
        assertNotNull(results);
        assertEquals(1, results.size());
        assertEquals("CMA_VALUATION", results.get(0).getAction());
    }

    @Test
    void testGetLogsByProperty_ReturnsPropertyLogs() {
        AuditLog log1 = AuditLog.builder()
                .id(2L)
                .propertyId(8L)
                .action("STATUTORY_CLEARANCE")
                .category("DUE_DILIGENCE")
                .operator("admin")
                .details("WRD Flood clearance confirmed")
                .status("SUCCESS")
                .createdAt(LocalDateTime.now())
                .build();

        when(auditLogRepository.findByPropertyIdOrderByCreatedAtDesc(8L)).thenReturn(List.of(log1));

        List<AuditLogDTO> results = auditLogService.getLogsByProperty(8L);
        assertNotNull(results);
        assertEquals(1, results.size());
        assertEquals(8L, results.get(0).getPropertyId());
    }
}
