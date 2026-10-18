package com.realestate.backend.property.controller;

import com.realestate.backend.integration.ownership.OwnershipRecordService;
import com.realestate.backend.property.entity.OwnershipRecord;
import com.realestate.backend.property.entity.Property;
import com.realestate.backend.property.service.PropertyService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/properties")
public class OwnershipRecordController {

        private final OwnershipRecordService ownershipRecordService;
        private final PropertyService propertyService;

        public OwnershipRecordController(
                        OwnershipRecordService ownershipRecordService,
                        PropertyService propertyService) {

                this.ownershipRecordService = ownershipRecordService;
                this.propertyService = propertyService;
        }

        @PostMapping("/{propertyId}/ownership")
        public ResponseEntity<OwnershipRecord> saveOwnershipRecord(
                        @PathVariable Long propertyId,
                        @RequestParam String ownerName,
                        @RequestParam String ownershipType) {

                Property property = propertyService.getPropertyById(propertyId);

                OwnershipRecord record = ownershipRecordService.saveOwnershipRecord(
                                property,
                                ownerName,
                                ownershipType);

                return ResponseEntity.ok(record);
        }

        @GetMapping("/{propertyId}/ownership")
        public ResponseEntity<List<OwnershipRecord>> getOwnershipRecords(
                        @PathVariable Long propertyId) {

                return ResponseEntity.ok(
                                ownershipRecordService.getOwnershipRecords(propertyId));
        }
}