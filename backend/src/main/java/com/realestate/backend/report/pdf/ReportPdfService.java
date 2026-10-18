
package com.realestate.backend.report.pdf;

import com.lowagie.text.*;
import com.lowagie.text.pdf.*;
import com.realestate.backend.report.dto.DueDiligenceReportResponse;
import com.realestate.backend.report.service.DueDiligenceReportService;
import com.realestate.backend.cma.dto.ComparablePropertyResponse;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.util.List;

@Service
public class ReportPdfService {

        private final DueDiligenceReportService reportService;

        private static final Color NAVY = new Color(25, 45, 80);
        private static final Color BLUE = new Color(45, 100, 170);
        private static final Color LIGHT_BLUE = new Color(235, 242, 250);
        private static final Color LIGHT_GREY = new Color(245, 247, 250);
        private static final Color GREY = new Color(95, 105, 120);

        public ReportPdfService(DueDiligenceReportService reportService) {
                this.reportService = reportService;
        }

        public byte[] generatePdf(Long propertyId) {
                DueDiligenceReportResponse report = reportService.generateReport(propertyId);

                try (ByteArrayOutputStream output = new ByteArrayOutputStream()) {

                        Document document = new Document(
                                        PageSize.A4, 42, 42, 42, 48);

                        PdfWriter writer = PdfWriter.getInstance(document, output);

                        writer.setPageEvent(new PdfPageEventHelper() {
                                @Override
                                public void onEndPage(
                                                PdfWriter writer, Document document) {

                                        PdfContentByte canvas = writer.getDirectContent();

                                        canvas.setColorStroke(LIGHT_BLUE);
                                        canvas.moveTo(42, 32);
                                        canvas.lineTo(PageSize.A4.getWidth() - 42, 32);
                                        canvas.stroke();

                                        ColumnText.showTextAligned(
                                                        canvas,
                                                        Element.ALIGN_LEFT,
                                                        new Phrase("CONFIDENTIAL - DUE DILIGENCE REPORT",
                                                                        new Font(Font.HELVETICA, 8,
                                                                                        Font.NORMAL, GREY)),
                                                        42, 20, 0);

                                        ColumnText.showTextAligned(
                                                        canvas,
                                                        Element.ALIGN_RIGHT,
                                                        new Phrase("Page " + writer.getPageNumber(),
                                                                        new Font(Font.HELVETICA, 8,
                                                                                        Font.NORMAL, GREY)),
                                                        PageSize.A4.getWidth() - 42, 20, 0);
                                }
                        });

                        document.open();

                        Font titleFont = new Font(
                                        Font.HELVETICA, 22, Font.BOLD, NAVY);
                        Font subtitleFont = new Font(
                                        Font.HELVETICA, 10, Font.NORMAL, GREY);
                        Font sectionFont = new Font(
                                        Font.HELVETICA, 12, Font.BOLD, Color.WHITE);
                        Font labelFont = new Font(
                                        Font.HELVETICA, 9, Font.BOLD, NAVY);
                        Font valueFont = new Font(
                                        Font.HELVETICA, 9, Font.NORMAL, Color.DARK_GRAY);
                        Font bodyFont = new Font(
                                        Font.HELVETICA, 10, Font.NORMAL, Color.DARK_GRAY);

                        // REPORT HEADER
                        Paragraph title = new Paragraph(
                                        "REAL ESTATE", titleFont);
                        title.setAlignment(Element.ALIGN_CENTER);
                        title.setSpacingBefore(12);
                        document.add(title);

                        Paragraph subtitle = new Paragraph(
                                        "DUE DILIGENCE REPORT", subtitleFont);
                        subtitle.setAlignment(Element.ALIGN_CENTER);
                        subtitle.setSpacingAfter(5);
                        document.add(subtitle);

                        Paragraph date = new Paragraph(
                                        "Generated on: " + LocalDate.now(),
                                        new Font(Font.HELVETICA, 9, Font.NORMAL, GREY));
                        date.setAlignment(Element.ALIGN_CENTER);
                        date.setSpacingAfter(18);
                        document.add(date);

                        // PROPERTY DETAILS
                        addSection(document, "PROPERTY DETAILS", sectionFont);

                        PdfPTable propertyTable = new PdfPTable(2);
                        propertyTable.setWidthPercentage(100);
                        propertyTable.setWidths(new float[] { 1.1f, 2f });

                        addRow(propertyTable, "Property ID",
                                        String.valueOf(report.getProperty().getId()),
                                        labelFont, valueFont);
                        addRow(propertyTable, "Address",
                                        report.getProperty().getAddress(),
                                        labelFont, valueFont);
                        addRow(propertyTable, "City",
                                        report.getProperty().getCity(),
                                        labelFont, valueFont);
                        addRow(propertyTable, "State",
                                        report.getProperty().getState(),
                                        labelFont, valueFont);
                        addRow(propertyTable, "ZIP Code",
                                        report.getProperty().getZipCode(),
                                        labelFont, valueFont);
                        addRow(propertyTable, "Property Type",
                                        report.getProperty().getPropertyType(),
                                        labelFont, valueFont);
                        addRow(propertyTable, "Price",
                                        String.valueOf(report.getProperty().getPrice()),
                                        labelFont, valueFont);

                        document.add(propertyTable);
                        document.add(Chunk.NEWLINE);

                        // RISK ASSESSMENT
                        addSection(document, "RISK ASSESSMENT", sectionFont);

                        PdfPTable riskTable = new PdfPTable(2);
                        riskTable.setWidthPercentage(100);

                        addRow(riskTable, "Overall Risk Score",
                                        String.valueOf(
                                                        report.getRiskAssessment().getOverallRiskScore()),
                                        labelFont, valueFont);
                        addRow(riskTable, "Risk Level",
                                        String.valueOf(
                                                        report.getRiskAssessment().getRiskLevel()),
                                        labelFont, valueFont);

                        document.add(riskTable);
                        document.add(Chunk.NEWLINE);

                        // MARKET ANALYSIS
                        addSection(document, "MARKET ANALYSIS", sectionFont);

                        PdfPTable marketTable = new PdfPTable(2);
                        marketTable.setWidthPercentage(100);

                        addRow(marketTable, "Target Price",
                                        String.valueOf(
                                                        report.getMarketAnalysis().getTargetPrice()),
                                        labelFont, valueFont);
                        addRow(marketTable, "Average Comparable Price",
                                        String.valueOf(
                                                        report.getMarketAnalysis()
                                                                        .getAverageComparablePrice()),
                                        labelFont, valueFont);
                        addRow(marketTable, "Price Difference",
                                        String.valueOf(
                                                        report.getMarketAnalysis().getPriceDifference()),
                                        labelFont, valueFont);
                        addRow(marketTable, "Price Difference Percentage",
                                        report.getMarketAnalysis()
                                                        .getPriceDifferencePercentage() + "%",
                                        labelFont, valueFont);
                        addRow(marketTable, "Comparable Count",
                                        String.valueOf(
                                                        report.getMarketAnalysis().getComparableCount()),
                                        labelFont, valueFont);

                        document.add(marketTable);
                        document.add(Chunk.NEWLINE);

                        // COMPARABLE PROPERTIES
                        addSection(document, "COMPARABLE PROPERTIES", sectionFont);

                        List<ComparablePropertyResponse> comparables = report.getComparableProperties();

                        if (comparables == null || comparables.isEmpty()) {
                                document.add(new Paragraph(
                                                "No comparable properties available.", bodyFont));
                        } else {
                                PdfPTable comparableTable = new PdfPTable(
                                                new float[] { 0.7f, 2.2f, 1.2f, 1.3f, 1.2f });

                                comparableTable.setWidthPercentage(100);
                                comparableTable.setHeaderRows(1);

                                Font headerFont = new Font(
                                                Font.HELVETICA, 8, Font.BOLD, Color.WHITE);
                                Font cellFont = new Font(
                                                Font.HELVETICA, 8, Font.NORMAL, Color.DARK_GRAY);

                                String[] headers = {
                                                "ID", "Address", "City", "Price", "Difference %"
                                };

                                for (String header : headers) {
                                        PdfPCell cell = new PdfPCell(
                                                        new Phrase(header, headerFont));
                                        cell.setBackgroundColor(BLUE);
                                        cell.setPadding(6);
                                        cell.setBorderColor(Color.WHITE);
                                        comparableTable.addCell(cell);
                                }

                                for (ComparablePropertyResponse comparable : comparables) {
                                        addComparableCell(comparableTable,
                                                        comparable.getPropertyId(), cellFont);
                                        addComparableCell(comparableTable,
                                                        comparable.getAddress(), cellFont);
                                        addComparableCell(comparableTable,
                                                        comparable.getCity(), cellFont);
                                        addComparableCell(comparableTable,
                                                        comparable.getPrice(), cellFont);
                                        addComparableCell(comparableTable,
                                                        comparable.getPriceDifferencePercentage() == null
                                                                        ? null
                                                                        : comparable.getPriceDifferencePercentage()
                                                                                        + "%",
                                                        cellFont);
                                }

                                document.add(comparableTable);
                        }

                        document.add(Chunk.NEWLINE);

                        // AI ANALYSIS
                        addSection(document, "AI ANALYSIS", sectionFont);

                        addTextCard(document, "Risk Summary",
                                        report.getAiAnalysis().getRiskSummary(), bodyFont);
                        addTextCard(document, "Market Summary",
                                        report.getAiAnalysis().getMarketSummary(), bodyFont);
                        addTextCard(document, "Due Diligence Summary",
                                        report.getAiAnalysis().getDueDiligenceSummary(), bodyFont);
                        addTextCard(document, "Key Finding",
                                        report.getAiAnalysis().getKeyFinding(), bodyFont);

                        Paragraph disclaimer = new Paragraph(
                                        "\nThis report supports property review. Verify legal, "
                                                        + "ownership, tax and other records with the appropriate "
                                                        + "authorities before making a decision.",
                                        new Font(Font.HELVETICA, 8, Font.ITALIC, GREY));

                        disclaimer.setSpacingBefore(10);
                        document.add(disclaimer);

                        document.close();
                        return output.toByteArray();

                } catch (Exception e) {
                        throw new RuntimeException(
                                        "Failed to generate PDF report for property "
                                                        + propertyId,
                                        e);
                }
        }

        private void addSection(
                        Document document, String heading, Font font)
                        throws DocumentException {

                PdfPTable headingTable = new PdfPTable(1);
                headingTable.setWidthPercentage(100);
                headingTable.setSpacingBefore(5);
                headingTable.setSpacingAfter(7);

                PdfPCell cell = new PdfPCell(new Phrase(heading, font));
                cell.setBackgroundColor(NAVY);
                cell.setPadding(9);
                cell.setBorder(Rectangle.NO_BORDER);

                headingTable.addCell(cell);
                document.add(headingTable);
        }

        private void addRow(
                        PdfPTable table,
                        String label,
                        String value,
                        Font labelFont,
                        Font valueFont) {

                PdfPCell labelCell = new PdfPCell(
                                new Phrase(label, labelFont));
                labelCell.setBackgroundColor(LIGHT_BLUE);
                labelCell.setPadding(8);
                labelCell.setBorderColor(Color.WHITE);

                PdfPCell valueCell = new PdfPCell(
                                new Phrase(safe(value), valueFont));
                valueCell.setBackgroundColor(LIGHT_GREY);
                valueCell.setPadding(8);
                valueCell.setBorderColor(Color.WHITE);

                table.addCell(labelCell);
                table.addCell(valueCell);
        }

        private void addComparableCell(
                        PdfPTable table, Object value, Font font) {

                PdfPCell cell = new PdfPCell(
                                new Phrase(safe(value), font));
                cell.setPadding(6);
                cell.setBackgroundColor(LIGHT_GREY);
                cell.setBorderColor(Color.WHITE);
                table.addCell(cell);
        }

        private void addTextCard(
                        Document document,
                        String heading,
                        String text,
                        Font bodyFont) throws DocumentException {

                Font headingFont = new Font(
                                Font.HELVETICA, 10, Font.BOLD, BLUE);

                PdfPTable table = new PdfPTable(1);
                table.setWidthPercentage(100);
                table.setSpacingAfter(8);

                PdfPCell cell = new PdfPCell();
                cell.setBackgroundColor(LIGHT_GREY);
                cell.setBorderColor(LIGHT_BLUE);
                cell.setPadding(10);

                cell.addElement(new Paragraph(heading, headingFont));
                cell.addElement(new Paragraph(
                                safe(text).equals("N/A")
                                                ? "No information available."
                                                : safe(text),
                                bodyFont));

                table.addCell(cell);
                document.add(table);
        }

        private String safe(Object value) {
                return value == null ? "N/A" : value.toString();
        }
}
