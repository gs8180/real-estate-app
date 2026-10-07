package com.realestate.backend.service;

import com.realestate.backend.dto.ReportValidationResultDTO;

public interface ReportValidationService {
    /**
     * Validates property report inputs, CMA valuation boundaries, and statutory clearances.
     * Returns an institutional underwriting readiness dossier.
     *
     * @param propertyId the ID of the property
     * @return validation result with underwriting status
     */
    ReportValidationResultDTO validatePropertyReport(Long propertyId);
}
