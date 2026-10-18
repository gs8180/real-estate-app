package com.realestate.backend.analytics.controller;

import com.realestate.backend.analytics.dto.AdminAnalyticsResponse;
import com.realestate.backend.analytics.service.AdminAnalyticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/analytics")
public class AdminAnalyticsController {

    private final AdminAnalyticsService adminAnalyticsService;

    public AdminAnalyticsController(
            AdminAnalyticsService adminAnalyticsService) {

        this.adminAnalyticsService = adminAnalyticsService;
    }

    @GetMapping
    public ResponseEntity<AdminAnalyticsResponse> getAnalytics() {

        return ResponseEntity.ok(
                adminAnalyticsService.getAnalytics()
        );
    }
}