
package com.realestate.backend.property.controller;

import com.realestate.backend.property.dto.AddressValidationRequest;
import com.realestate.backend.property.dto.AddressValidationResponse;
import com.realestate.backend.property.entity.Property;
import com.realestate.backend.property.service.AddressValidationService;
import com.realestate.backend.property.service.PropertyService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/properties")
public class PropertyController {

        private final PropertyService propertyService;
        private final AddressValidationService addressValidationService;

        public PropertyController(
                        PropertyService propertyService,
                        AddressValidationService addressValidationService) {

                this.propertyService = propertyService;
                this.addressValidationService = addressValidationService;
        }

        // Get all properties
        @GetMapping
        public ResponseEntity<List<Property>> getAllProperties() {
                return ResponseEntity.ok(
                                propertyService.getAllProperties());
        }

        // Search by address, city, or ZIP code
        @GetMapping("/search")
        public ResponseEntity<List<Property>> searchProperties(
                        @RequestParam(required = false) String address,
                        @RequestParam(required = false) String city,
                        @RequestParam(required = false) String zipCode) {

                if (address != null && !address.isBlank()) {
                        return ResponseEntity.ok(
                                        propertyService.searchByAddress(address));
                }

                if (city != null && !city.isBlank()) {
                        return ResponseEntity.ok(
                                        propertyService.searchByCity(city));
                }

                if (zipCode != null && !zipCode.isBlank()) {
                        return ResponseEntity.ok(
                                        propertyService.searchByZipCode(zipCode));
                }

                return ResponseEntity.ok(
                                propertyService.getAllProperties());
        }

        // Get property by ID
        @GetMapping("/{id}")
        public ResponseEntity<Property> getProperty(
                        @PathVariable Long id) {

                return ResponseEntity.ok(
                                propertyService.getPropertyById(id));
        }

        // Create property
        @PostMapping
        public ResponseEntity<Property> createProperty(
                        @RequestBody Property property) {

                Property savedProperty = propertyService.createProperty(property);

                return ResponseEntity
                                .status(HttpStatus.CREATED)
                                .body(savedProperty);
        }

        // Update property
        @PutMapping("/{id}")
        public ResponseEntity<Property> updateProperty(
                        @PathVariable Long id,
                        @RequestBody Property property) {

                return ResponseEntity.ok(
                                propertyService.updateProperty(id, property));
        }

        // Delete property
        @DeleteMapping("/{id}")
        public ResponseEntity<Void> deleteProperty(
                        @PathVariable Long id) {

                propertyService.deleteProperty(id);

                return ResponseEntity.noContent().build();
        }

        // Validate address using the existing validation service
        @PostMapping("/validate-address")
        public ResponseEntity<AddressValidationResponse> validateAddress(
                        @RequestBody AddressValidationRequest request) {

                return ResponseEntity.ok(
                                addressValidationService.validateAddress(
                                                request.getAddress()));
        }
}
