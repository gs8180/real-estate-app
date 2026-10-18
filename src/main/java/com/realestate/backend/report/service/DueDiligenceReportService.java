package com.realestate.backend.report.service;

import com.realestate.backend.ai.dto.AIAnalysisRequest;
import com.realestate.backend.ai.dto.AIAnalysisResponse;
import com.realestate.backend.ai.service.AIAnalysisService;
import com.realestate.backend.audit.service.AuditLogService;
import com.realestate.backend.cma.dto.ComparablePropertyResponse;
import com.realestate.backend.cma.dto.MarketAnalysisResponse;
import com.realestate.backend.cma.service.ComparablePropertyService;
import com.realestate.backend.cma.service.MarketAnalysisService;
import com.realestate.backend.notification.service.NotificationService;
import com.realestate.backend.property.entity.Property;
import com.realestate.backend.property.repository.PropertyRepository;
import com.realestate.backend.report.dto.DueDiligenceReportResponse;
import com.realestate.backend.reporthistory.service.ReportHistoryService;
import com.realestate.backend.risk.entity.RiskAssessment;
import com.realestate.backend.risk.service.RiskAssessmentService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DueDiligenceReportService {

    private final PropertyRepository propertyRepository;
    private final RiskAssessmentService riskAssessmentService;
    private final ComparablePropertyService comparablePropertyService;
    private final MarketAnalysisService marketAnalysisService;
    private final AIAnalysisService aiAnalysisService;
    private final AuditLogService auditLogService;
    private final NotificationService notificationService;
    private final ReportHistoryService reportHistoryService;

    public DueDiligenceReportService(
            PropertyRepository propertyRepository,
            RiskAssessmentService riskAssessmentService,
            ComparablePropertyService comparablePropertyService,
            MarketAnalysisService marketAnalysisService,
            AIAnalysisService aiAnalysisService,
            AuditLogService auditLogService,
            NotificationService notificationService,
            ReportHistoryService reportHistoryService) {

        this.propertyRepository = propertyRepository;
        this.riskAssessmentService = riskAssessmentService;
        this.comparablePropertyService = comparablePropertyService;
        this.marketAnalysisService = marketAnalysisService;
        this.aiAnalysisService = aiAnalysisService;
        this.auditLogService = auditLogService;
        this.notificationService = notificationService;
        this.reportHistoryService = reportHistoryService;
    }

    public DueDiligenceReportResponse generateReport(Long propertyId) {

        // 1. Get property
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Property not found: " + propertyId));

        // 2. Calculate risk
        RiskAssessment riskAssessment =
                riskAssessmentService.calculateRisk(propertyId);

        // 3. Get comparable properties
        List<ComparablePropertyResponse> comparables =
                comparablePropertyService.findComparables(propertyId);

        // 4. Get market analysis
        MarketAnalysisResponse marketAnalysis =
                marketAnalysisService.analyzeMarket(propertyId);

        // 5. Prepare AI analysis request
        AIAnalysisRequest aiRequest = new AIAnalysisRequest(
                propertyId,
                riskAssessment.getOverallRiskScore(),
                riskAssessment.getRiskLevel(),
                marketAnalysis.getAverageComparablePrice(),
                marketAnalysis.getPriceDifferencePercentage(),
                marketAnalysis.getComparableCount()
        );

        // 6. Generate AI analysis
        AIAnalysisResponse aiAnalysis =
                aiAnalysisService.analyze(aiRequest);

        // 7. Create audit log
        auditLogService.createLog(
                "REPORT_GENERATED",
                "system",
                propertyId,
                "Due diligence report generated successfully"
        );

        // 8. Create report-ready notification
        notificationService.createNotification(
                "REPORT_READY",
                "Due diligence report is ready for property "
                        + propertyId,
                "system",
                propertyId
        );

        // 9. Save report history
        reportHistoryService.createHistory(
                propertyId,
                "DUE_DILIGENCE_REPORT",
                "system",
                "GENERATED"
        );

        // 10. Return complete report
        return new DueDiligenceReportResponse(
                property,
                riskAssessment,
                comparables,
                marketAnalysis,
                aiAnalysis
        );
    }
}