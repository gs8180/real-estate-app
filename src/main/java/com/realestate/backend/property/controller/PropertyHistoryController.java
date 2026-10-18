package com.realestate.backend.property.controller;

import com.realestate.backend.property.entity.PropertyHistory;
import com.realestate.backend.property.service.PropertyHistoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/properties")
public class PropertyHistoryController {

    private final PropertyHistoryService historyService;

    public PropertyHistoryController(
            PropertyHistoryService historyService) {
        this.historyService = historyService;
    }

    @GetMapping("/{propertyId}/history")
    public ResponseEntity<List<PropertyHistory>> getHistory(
            @PathVariable Long propertyId) {

        return ResponseEntity.ok(
                historyService.getHistory(propertyId)
        );
    }

    @PostMapping("/{propertyId}/history")
    public ResponseEntity<PropertyHistory> addHistory(
            @PathVariable Long propertyId,
            @RequestBody Map<String, String> request) {

        String action = request.get("action");

        if (action == null || action.isBlank()) {
            throw new RuntimeException("Action is required");
        }

        return ResponseEntity.ok(
                historyService.addHistory(propertyId, action)
        );
    }
}