package com.realestate.backend.property.controller;

import com.realestate.backend.integration.flood.FloodZoneInformationService;
import com.realestate.backend.property.entity.FloodZoneInformation;
import com.realestate.backend.property.entity.Property;
import com.realestate.backend.property.service.PropertyService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/properties")
public class FloodZoneInformationController {

    private final FloodZoneInformationService floodZoneInformationService;
    private final PropertyService propertyService;

    public FloodZoneInformationController(
            FloodZoneInformationService floodZoneInformationService,
            PropertyService propertyService) {

        this.floodZoneInformationService = floodZoneInformationService;
        this.propertyService = propertyService;
    }

    @PostMapping("/{propertyId}/flood-zone")
    public ResponseEntity<FloodZoneInformation> saveFloodZoneInformation(
            @PathVariable Long propertyId,
            @RequestParam String floodZone,
            @RequestParam String riskLevel,
            @RequestParam String source) {

        Property property =
                propertyService.getPropertyById(propertyId);

        FloodZoneInformation floodZoneInformation =
                floodZoneInformationService.saveFloodZoneInformation(
                        property,
                        floodZone,
                        riskLevel,
                        source
                );

        return ResponseEntity.ok(floodZoneInformation);
    }

    @GetMapping("/{propertyId}/flood-zone")
    public ResponseEntity<List<FloodZoneInformation>> getFloodZoneInformation(
            @PathVariable Long propertyId) {

        return ResponseEntity.ok(
                floodZoneInformationService
                        .getFloodZoneInformation(propertyId)
        );
    }
}