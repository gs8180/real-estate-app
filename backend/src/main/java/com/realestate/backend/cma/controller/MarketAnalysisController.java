package com.realestate.backend.cma.controller;

import com.realestate.backend.cma.dto.MarketAnalysisResponse;
import com.realestate.backend.cma.service.MarketAnalysisService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cma")
public class MarketAnalysisController {

    private final MarketAnalysisService marketAnalysisService;

    public MarketAnalysisController(
            MarketAnalysisService marketAnalysisService) {
        this.marketAnalysisService = marketAnalysisService;
    }

    @GetMapping("/property/{propertyId}/market-analysis")
    public ResponseEntity<MarketAnalysisResponse> analyzeMarket(
            @PathVariable Long propertyId) {

        return ResponseEntity.ok(
                marketAnalysisService.analyzeMarket(propertyId)
        );
    }
}