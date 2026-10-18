package com.realestate.backend.property.controller;

import com.realestate.backend.integration.tax.PropertyTaxHistoryService;
import com.realestate.backend.property.entity.Property;
import com.realestate.backend.property.entity.PropertyTaxHistory;
import com.realestate.backend.property.service.PropertyService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/properties")
public class PropertyTaxHistoryController {

    private final PropertyTaxHistoryService taxHistoryService;
    private final PropertyService propertyService;

    public PropertyTaxHistoryController(
            PropertyTaxHistoryService taxHistoryService,
            PropertyService propertyService) {

        this.taxHistoryService = taxHistoryService;
        this.propertyService = propertyService;
    }

    @PostMapping("/{propertyId}/tax-history")
    public ResponseEntity<PropertyTaxHistory> saveTaxHistory(
            @PathVariable Long propertyId,
            @RequestParam Integer taxYear,
            @RequestParam Double taxAmount,
            @RequestParam Double amountPaid,
            @RequestParam String paymentStatus) {

        Property property =
                propertyService.getPropertyById(propertyId);

        PropertyTaxHistory taxHistory =
                taxHistoryService.saveTaxHistory(
                        property,
                        taxYear,
                        taxAmount,
                        amountPaid,
                        paymentStatus
                );

        return ResponseEntity.ok(taxHistory);
    }

    @GetMapping("/{propertyId}/tax-history")
    public ResponseEntity<List<PropertyTaxHistory>> getTaxHistory(
            @PathVariable Long propertyId) {

        return ResponseEntity.ok(
                taxHistoryService.getTaxHistory(propertyId)
        );
    }
}