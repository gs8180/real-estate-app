package com.realestate.backend.property.controller;

import com.realestate.backend.integration.zoning.ZoningInformationService;
import com.realestate.backend.property.entity.Property;
import com.realestate.backend.property.entity.ZoningInformation;
import com.realestate.backend.property.service.PropertyService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/properties")
public class ZoningInformationController {

    private final ZoningInformationService zoningInformationService;
    private final PropertyService propertyService;

    public ZoningInformationController(
            ZoningInformationService zoningInformationService,
            PropertyService propertyService) {

        this.zoningInformationService = zoningInformationService;
        this.propertyService = propertyService;
    }

    @PostMapping("/{propertyId}/zoning")
    public ResponseEntity<ZoningInformation> saveZoningInformation(
            @PathVariable Long propertyId,
            @RequestParam String zoningType,
            @RequestParam String zoningCode,
            @RequestParam String permittedUse) {

        Property property =
                propertyService.getPropertyById(propertyId);

        ZoningInformation zoningInformation =
                zoningInformationService.saveZoningInformation(
                        property,
                        zoningType,
                        zoningCode,
                        permittedUse
                );

        return ResponseEntity.ok(zoningInformation);
    }

    @GetMapping("/{propertyId}/zoning")
    public ResponseEntity<List<ZoningInformation>> getZoningInformation(
            @PathVariable Long propertyId) {

        return ResponseEntity.ok(
                zoningInformationService.getZoningInformation(propertyId)
        );
    }
}
