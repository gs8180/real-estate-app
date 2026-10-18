package com.realestate.backend.analytics.dto;

public class AdminAnalyticsResponse {

    private long totalProperties;
    private long totalReports;
    private long totalNotifications;
    private long totalAuditLogs;
    private long lowRiskProperties;
    private long mediumRiskProperties;
    private long highRiskProperties;

    public AdminAnalyticsResponse() {
    }

    public AdminAnalyticsResponse(
            long totalProperties,
            long totalReports,
            long totalNotifications,
            long totalAuditLogs,
            long lowRiskProperties,
            long mediumRiskProperties,
            long highRiskProperties) {

        this.totalProperties = totalProperties;
        this.totalReports = totalReports;
        this.totalNotifications = totalNotifications;
        this.totalAuditLogs = totalAuditLogs;
        this.lowRiskProperties = lowRiskProperties;
        this.mediumRiskProperties = mediumRiskProperties;
        this.highRiskProperties = highRiskProperties;
    }

    public long getTotalProperties() {
        return totalProperties;
    }

    public void setTotalProperties(long totalProperties) {
        this.totalProperties = totalProperties;
    }

    public long getTotalReports() {
        return totalReports;
    }

    public void setTotalReports(long totalReports) {
        this.totalReports = totalReports;
    }

    public long getTotalNotifications() {
        return totalNotifications;
    }

    public void setTotalNotifications(long totalNotifications) {
        this.totalNotifications = totalNotifications;
    }

    public long getTotalAuditLogs() {
        return totalAuditLogs;
    }

    public void setTotalAuditLogs(long totalAuditLogs) {
        this.totalAuditLogs = totalAuditLogs;
    }

    public long getLowRiskProperties() {
        return lowRiskProperties;
    }

    public void setLowRiskProperties(long lowRiskProperties) {
        this.lowRiskProperties = lowRiskProperties;
    }

    public long getMediumRiskProperties() {
        return mediumRiskProperties;
    }

    public void setMediumRiskProperties(long mediumRiskProperties) {
        this.mediumRiskProperties = mediumRiskProperties;
    }

    public long getHighRiskProperties() {
        return highRiskProperties;
    }

    public void setHighRiskProperties(long highRiskProperties) {
        this.highRiskProperties = highRiskProperties;
    }
}