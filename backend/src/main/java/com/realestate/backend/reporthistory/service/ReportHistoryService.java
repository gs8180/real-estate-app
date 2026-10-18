package com.realestate.backend.reporthistory.service;

import com.realestate.backend.reporthistory.entity.ReportHistory;
import com.realestate.backend.reporthistory.repository.ReportHistoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReportHistoryService {

    private final ReportHistoryRepository reportHistoryRepository;

    public ReportHistoryService(
            ReportHistoryRepository reportHistoryRepository) {

        this.reportHistoryRepository = reportHistoryRepository;
    }

    public ReportHistory createHistory(
            Long propertyId,
            String reportType,
            String generatedBy,
            String status) {

        ReportHistory history = new ReportHistory(
                propertyId,
                reportType,
                generatedBy,
                status
        );

        return reportHistoryRepository.save(history);
    }

    public List<ReportHistory> getAllHistory() {
        return reportHistoryRepository.findAll();
    }

    public List<ReportHistory> getByPropertyId(Long propertyId) {
        return reportHistoryRepository.findByPropertyId(propertyId);
    }

    public List<ReportHistory> getByGeneratedBy(String generatedBy) {
        return reportHistoryRepository.findByGeneratedBy(generatedBy);
    }

    public List<ReportHistory> getByReportType(String reportType) {
        return reportHistoryRepository.findByReportType(reportType);
    }

    public ReportHistory getById(Long id) {
        return reportHistoryRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Report history not found: " + id));
    }
}