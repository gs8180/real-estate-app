package com.realestate.backend.report.excel;

import com.realestate.backend.report.dto.DueDiligenceReportResponse;
import com.realestate.backend.report.service.DueDiligenceReportService;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

@Service
public class ReportExcelService {

    private final DueDiligenceReportService reportService;

    public ReportExcelService(DueDiligenceReportService reportService) {
        this.reportService = reportService;
    }

    public byte[] generateExcel(Long propertyId) {

        DueDiligenceReportResponse report =
                reportService.generateReport(propertyId);

        try (Workbook workbook = new XSSFWorkbook();
             ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {

            Sheet sheet = workbook.createSheet("Due Diligence Report");

            int rowNumber = 0;

            // Title
            Row titleRow = sheet.createRow(rowNumber++);
            titleRow.createCell(0)
                    .setCellValue("REAL ESTATE DUE DILIGENCE REPORT");

            rowNumber++;

            // Property Details
            rowNumber = addSectionHeader(
                    sheet,
                    rowNumber,
                    "PROPERTY DETAILS"
            );

            rowNumber = addRow(
                    sheet,
                    rowNumber,
                    "Address",
                    report.getProperty().getAddress()
            );

            rowNumber = addRow(
                    sheet,
                    rowNumber,
                    "City",
                    report.getProperty().getCity()
            );

            rowNumber = addRow(
                    sheet,
                    rowNumber,
                    "State",
                    report.getProperty().getState()
            );

            rowNumber = addRow(
                    sheet,
                    rowNumber,
                    "ZIP Code",
                    report.getProperty().getZipCode()
            );

            rowNumber = addRow(
                    sheet,
                    rowNumber,
                    "Property Type",
                    report.getProperty().getPropertyType()
            );

            rowNumber = addRow(
                    sheet,
                    rowNumber,
                    "Price",
                    report.getProperty().getPrice()
            );

            rowNumber++;

            // Risk Assessment
            rowNumber = addSectionHeader(
                    sheet,
                    rowNumber,
                    "RISK ASSESSMENT"
            );

            rowNumber = addRow(
                    sheet,
                    rowNumber,
                    "Overall Risk Score",
                    report.getRiskAssessment().getOverallRiskScore()
            );

            rowNumber = addRow(
                    sheet,
                    rowNumber,
                    "Risk Level",
                    report.getRiskAssessment().getRiskLevel()
            );

            rowNumber = addRow(
                    sheet,
                    rowNumber,
                    "Ownership Risk",
                    report.getRiskAssessment().getOwnershipRisk()
            );

            rowNumber = addRow(
                    sheet,
                    rowNumber,
                    "Tax Risk",
                    report.getRiskAssessment().getTaxRisk()
            );

            rowNumber = addRow(
                    sheet,
                    rowNumber,
                    "Zoning Risk",
                    report.getRiskAssessment().getZoningRisk()
            );

            rowNumber = addRow(
                    sheet,
                    rowNumber,
                    "Flood Risk",
                    report.getRiskAssessment().getFloodRisk()
            );

            rowNumber = addRow(
                    sheet,
                    rowNumber,
                    "Permit Risk",
                    report.getRiskAssessment().getPermitRisk()
            );

            rowNumber = addRow(
                    sheet,
                    rowNumber,
                    "Environmental Risk",
                    report.getRiskAssessment().getEnvironmentalRisk()
            );

            rowNumber = addRow(
                    sheet,
                    rowNumber,
                    "Utility Risk",
                    report.getRiskAssessment().getUtilityRisk()
            );

            rowNumber++;

            // Market Analysis
            rowNumber = addSectionHeader(
                    sheet,
                    rowNumber,
                    "MARKET ANALYSIS"
            );

            rowNumber = addRow(
                    sheet,
                    rowNumber,
                    "Target Price",
                    report.getMarketAnalysis().getTargetPrice()
            );

            rowNumber = addRow(
                    sheet,
                    rowNumber,
                    "Average Comparable Price",
                    report.getMarketAnalysis()
                            .getAverageComparablePrice()
            );

            rowNumber = addRow(
                    sheet,
                    rowNumber,
                    "Price Difference",
                    report.getMarketAnalysis().getPriceDifference()
            );

            rowNumber = addRow(
                    sheet,
                    rowNumber,
                    "Price Difference Percentage",
                    report.getMarketAnalysis()
                            .getPriceDifferencePercentage() + "%"
            );

            rowNumber = addRow(
                    sheet,
                    rowNumber,
                    "Comparable Count",
                    report.getMarketAnalysis().getComparableCount()
            );

            rowNumber++;

            // Comparable Properties
            rowNumber = addSectionHeader(
                    sheet,
                    rowNumber,
                    "COMPARABLE PROPERTIES"
            );

            Row headerRow = sheet.createRow(rowNumber++);

            headerRow.createCell(0).setCellValue("Property ID");
            headerRow.createCell(1).setCellValue("Address");
            headerRow.createCell(2).setCellValue("City");
            headerRow.createCell(3).setCellValue("Price");
            headerRow.createCell(4).setCellValue("Price Difference");
            headerRow.createCell(5)
                    .setCellValue("Difference Percentage");

            for (var comparable :
                    report.getComparableProperties()) {

                Row row = sheet.createRow(rowNumber++);

                row.createCell(0)
                        .setCellValue(comparable.getPropertyId());

                row.createCell(1)
                        .setCellValue(comparable.getAddress());

                row.createCell(2)
                        .setCellValue(comparable.getCity());

                row.createCell(3)
                        .setCellValue(comparable.getPrice());

                row.createCell(4)
                        .setCellValue(comparable.getPriceDifference());

                row.createCell(5)
                        .setCellValue(
                                comparable.getPriceDifferencePercentage()
                                        + "%"
                        );
            }

            rowNumber++;

            // AI Analysis
            rowNumber = addSectionHeader(
                    sheet,
                    rowNumber,
                    "AI ANALYSIS"
            );

            rowNumber = addRow(
                    sheet,
                    rowNumber,
                    "Risk Summary",
                    report.getAiAnalysis().getRiskSummary()
            );

            rowNumber = addRow(
                    sheet,
                    rowNumber,
                    "Market Summary",
                    report.getAiAnalysis().getMarketSummary()
            );

            rowNumber = addRow(
                    sheet,
                    rowNumber,
                    "Due Diligence Summary",
                    report.getAiAnalysis()
                            .getDueDiligenceSummary()
            );

            addRow(
                    sheet,
                    rowNumber,
                    "Key Finding",
                    report.getAiAnalysis().getKeyFinding()
            );

            // Auto-size columns
            for (int i = 0; i < 6; i++) {
                sheet.autoSizeColumn(i);
            }

            workbook.write(outputStream);

            return outputStream.toByteArray();

        } catch (IOException e) {
            throw new RuntimeException(
                    "Failed to generate Excel report", e);
        }
    }

    private int addSectionHeader(
            Sheet sheet,
            int rowNumber,
            String title) {

        Row row = sheet.createRow(rowNumber++);

        Cell cell = row.createCell(0);
        cell.setCellValue(title);

        CellStyle style = sheet.getWorkbook()
                .createCellStyle();

        Font font = sheet.getWorkbook()
                .createFont();

        font.setBold(true);
        style.setFont(font);

        cell.setCellStyle(style);

        return rowNumber;
    }

    private int addRow(
            Sheet sheet,
            int rowNumber,
            String label,
            Object value) {

        Row row = sheet.createRow(rowNumber++);

        row.createCell(0).setCellValue(label);

        Cell valueCell = row.createCell(1);

        if (value instanceof Number) {
            valueCell.setCellValue(
                    ((Number) value).doubleValue()
            );
        } else {
            valueCell.setCellValue(
                    value != null ? value.toString() : ""
            );
        }

        return rowNumber;
    }
}