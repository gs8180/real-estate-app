package com.realestate.backend.service;

import com.realestate.backend.dto.CmaAnalysisResponseDTO;
import com.realestate.backend.dto.ReportValidationResultDTO;
import com.realestate.backend.entity.Property;
import com.realestate.backend.repository.PropertyRepository;
import com.realestate.backend.service.impl.ReportValidationServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

class ReportValidationServiceTest {

    private PropertyRepository propertyRepository;
    private CmaService cmaService;
    private AuditLogService auditLogService;
    private ReportValidationService reportValidationService;

    @BeforeEach
    void setUp() {
        propertyRepository = Mockito.mock(PropertyRepository.class);
        cmaService = Mockito.mock(CmaService.class);
        auditLogService = Mockito.mock(AuditLogService.class);

        reportValidationService = new ReportValidationServiceImpl(
                propertyRepository,
                cmaService,
                auditLogService
        );
    }

    @Test
    void testValidatePropertyReport_Success() {
        Property property = new Property();
        property.setId(6L);
        property.setTitle("Kothrud Heritage Bungalow");
        property.setCity("Pune");
        property.setPrice(new BigDecimal("28500000.00"));
        property.setFloodStorageRecords(Collections.emptyList());
        property.setTaxRecords(Collections.emptyList());

        when(propertyRepository.findById(6L)).thenReturn(Optional.of(property));

        CmaAnalysisResponseDTO cma = new CmaAnalysisResponseDTO();
        cma.setEstimatedFairMarketValue(new BigDecimal("29000000.00"));
        cma.setPriceVariancePercentage(1.72);
        cma.setComparableProperties(Collections.emptyList());

        when(cmaService.analyzeProperty(6L)).thenReturn(cma);

        ReportValidationResultDTO result = reportValidationService.validatePropertyReport(6L);

        assertNotNull(result);
        assertEquals(6L, result.getPropertyId());
        assertEquals("Pune", result.getCity());
        assertTrue(result.isUnderwritingEligible());
        assertNotNull(result.getDossierId());
        assertTrue(result.getDossierId().startsWith("MH-DD-6-"));
        assertEquals("WITHIN_NORMAL_VALUATION_BAND", result.getCmaStatus());
        assertNotNull(result.getDownloadPdfUrl());
        assertNotNull(result.getDownloadExcelUrl());

        // Verify audit event was logged
        verify(auditLogService, times(1)).recordLog(
                eq(6L),
                eq("UNDERWRITING_VALIDATION"),
                eq("DUE_DILIGENCE"),
                any(),
                any(),
                eq("CERTIFIED"),
                any()
        );
    }
}
