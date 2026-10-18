package com.realestate.backend.analytics.service;

import com.realestate.backend.analytics.dto.AdminAnalyticsResponse;
import com.realestate.backend.audit.repository.AuditLogRepository;
import com.realestate.backend.notification.repository.NotificationRepository;
import com.realestate.backend.property.repository.PropertyRepository;
import com.realestate.backend.reporthistory.repository.ReportHistoryRepository;
import com.realestate.backend.risk.entity.RiskAssessment;
import com.realestate.backend.risk.repository.RiskAssessmentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminAnalyticsService {

    private final PropertyRepository propertyRepository;
    private final ReportHistoryRepository reportHistoryRepository;
    private final NotificationRepository notificationRepository;
    private final AuditLogRepository auditLogRepository;
    private final RiskAssessmentRepository riskAssessmentRepository;

    public AdminAnalyticsService(
            PropertyRepository propertyRepository,
            ReportHistoryRepository reportHistoryRepository,
            NotificationRepository notificationRepository,
            AuditLogRepository auditLogRepository,
            RiskAssessmentRepository riskAssessmentRepository) {

        this.propertyRepository = propertyRepository;
        this.reportHistoryRepository = reportHistoryRepository;
        this.notificationRepository = notificationRepository;
        this.auditLogRepository = auditLogRepository;
        this.riskAssessmentRepository = riskAssessmentRepository;
    }

    public AdminAnalyticsResponse getAnalytics() {

        long totalProperties =
                propertyRepository.count();

        long totalReports =
                reportHistoryRepository.count();

        long totalNotifications =
                notificationRepository.count();

        long totalAuditLogs =
                auditLogRepository.count();

        List<RiskAssessment> riskAssessments =
                riskAssessmentRepository.findAll();

        long lowRiskProperties = riskAssessments.stream()
                .filter(risk -> "LOW".equalsIgnoreCase(
                        risk.getRiskLevel()))
                .count();

        long mediumRiskProperties = riskAssessments.stream()
                .filter(risk -> "MEDIUM".equalsIgnoreCase(
                        risk.getRiskLevel()))
                .count();

        long highRiskProperties = riskAssessments.stream()
                .filter(risk -> "HIGH".equalsIgnoreCase(
                        risk.getRiskLevel()))
                .count();

        return new AdminAnalyticsResponse(
                totalProperties,
                totalReports,
                totalNotifications,
                totalAuditLogs,
                lowRiskProperties,
                mediumRiskProperties,
                highRiskProperties
        );
    }
}