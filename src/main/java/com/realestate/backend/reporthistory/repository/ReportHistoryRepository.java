package com.realestate.backend.reporthistory.repository;

import com.realestate.backend.reporthistory.entity.ReportHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReportHistoryRepository
        extends JpaRepository<ReportHistory, Long> {

    List<ReportHistory> findByPropertyId(Long propertyId);

    List<ReportHistory> findByGeneratedBy(String generatedBy);

    List<ReportHistory> findByReportType(String reportType);
}