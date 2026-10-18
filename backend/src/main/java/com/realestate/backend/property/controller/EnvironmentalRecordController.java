package com.realestate.backend.property.controller;

import com.realestate.backend.integration.environmental.EnvironmentalRecordService;
import com.realestate.backend.property.entity.EnvironmentalRecord;
import com.realestate.backend.property.entity.Property;
import com.realestate.backend.property.service.PropertyService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/properties")
public class EnvironmentalRecordController {

    private final EnvironmentalRecordService environmentalRecordService;
    private final PropertyService propertyService;

    public EnvironmentalRecordController(
            EnvironmentalRecordService environmentalRecordService,
            PropertyService propertyService) {

        this.environmentalRecordService = environmentalRecordService;
        this.propertyService = propertyService;
    }

    @PostMapping("/{propertyId}/environmental")
    public ResponseEntity<EnvironmentalRecord> saveEnvironmentalRecord(
            @PathVariable Long propertyId,
            @RequestParam String recordType,
            @RequestParam String riskLevel,
            @RequestParam String description,
            @RequestParam String source) {

        Property property =
                propertyService.getPropertyById(propertyId);

        EnvironmentalRecord record =
                environmentalRecordService.saveEnvironmentalRecord(
                        property,
                        recordType,
                        riskLevel,
                        description,
                        source
                );

        return ResponseEntity.ok(record);
    }

    @GetMapping("/{propertyId}/environmental")
    public ResponseEntity<List<EnvironmentalRecord>> getEnvironmentalRecords(
            @PathVariable Long propertyId) {

        return ResponseEntity.ok(
                environmentalRecordService
                        .getEnvironmentalRecords(propertyId)
        );
    }
}