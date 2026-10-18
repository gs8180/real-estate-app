package com.realestate.backend.cma.controller;

import com.realestate.backend.cma.dto.ComparablePropertyResponse;
import com.realestate.backend.cma.service.ComparablePropertyService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cma")
public class ComparablePropertyController {

    private final ComparablePropertyService comparablePropertyService;

    public ComparablePropertyController(
            ComparablePropertyService comparablePropertyService) {
        this.comparablePropertyService = comparablePropertyService;
    }

    @GetMapping("/property/{propertyId}/comparables")
    public ResponseEntity<List<ComparablePropertyResponse>> getComparables(
            @PathVariable Long propertyId) {

        return ResponseEntity.ok(
                comparablePropertyService.findComparables(propertyId)
        );
    }
}