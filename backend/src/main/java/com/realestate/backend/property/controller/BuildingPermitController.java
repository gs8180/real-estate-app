package com.realestate.backend.property.controller;

import com.realestate.backend.integration.permit.BuildingPermitService;
import com.realestate.backend.property.entity.BuildingPermit;
import com.realestate.backend.property.entity.Property;
import com.realestate.backend.property.service.PropertyService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/properties")
public class BuildingPermitController {

    private final BuildingPermitService buildingPermitService;
    private final PropertyService propertyService;

    public BuildingPermitController(
            BuildingPermitService buildingPermitService,
            PropertyService propertyService) {

        this.buildingPermitService = buildingPermitService;
        this.propertyService = propertyService;
    }

    @PostMapping("/{propertyId}/permits")
    public ResponseEntity<BuildingPermit> saveBuildingPermit(
            @PathVariable Long propertyId,
            @RequestParam String permitNumber,
            @RequestParam String permitType,
            @RequestParam String issueDate,
            @RequestParam String status) {

        Property property =
                propertyService.getPropertyById(propertyId);

        BuildingPermit permit =
                buildingPermitService.saveBuildingPermit(
                        property,
                        permitNumber,
                        permitType,
                        issueDate,
                        status
                );

        return ResponseEntity.ok(permit);
    }

    @GetMapping("/{propertyId}/permits")
    public ResponseEntity<List<BuildingPermit>> getBuildingPermits(
            @PathVariable Long propertyId) {

        return ResponseEntity.ok(
                buildingPermitService.getBuildingPermits(propertyId)
        );
    }
}