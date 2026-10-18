package com.realestate.backend.ai.controller;

import com.realestate.backend.ai.dto.AIAnalysisRequest;
import com.realestate.backend.ai.dto.AIAnalysisResponse;
import com.realestate.backend.ai.service.AIAnalysisService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
public class AIAnalysisController {

    private final AIAnalysisService aiAnalysisService;

    public AIAnalysisController(
            AIAnalysisService aiAnalysisService) {
        this.aiAnalysisService = aiAnalysisService;
    }

    @PostMapping("/analyze")
    public ResponseEntity<AIAnalysisResponse> analyze(
            @RequestBody AIAnalysisRequest request) {

        return ResponseEntity.ok(
                aiAnalysisService.analyze(request)
        );
    }
}