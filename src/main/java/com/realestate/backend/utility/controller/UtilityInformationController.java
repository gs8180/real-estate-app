package com.realestate.backend.utility.controller;

import com.realestate.backend.utility.entity.UtilityInformation;
import com.realestate.backend.utility.service.UtilityInformationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/properties")
public class UtilityInformationController {

    private final UtilityInformationService utilityService;

    public UtilityInformationController(
            UtilityInformationService utilityService) {

        this.utilityService = utilityService;
    }

    @PostMapping("/{propertyId}/utility")
    public ResponseEntity<UtilityInformation> saveUtilityInformation(
            @PathVariable Long propertyId,
            @RequestBody UtilityInformation utilityInformation) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        utilityService.saveUtilityInformation(
                                propertyId,
                                utilityInformation
                        )
                );
    }

    @GetMapping("/{propertyId}/utility")
    public ResponseEntity<UtilityInformation> getUtilityInformation(
            @PathVariable Long propertyId) {

        return ResponseEntity.ok(
                utilityService.getUtilityInformation(propertyId)
        );
    }
}