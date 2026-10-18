
package com.realestate.backend.property.service;

import com.realestate.backend.property.entity.Property;
import com.realestate.backend.property.repository.PropertyRepository;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class PropertyService {

    private final PropertyRepository propertyRepository;

    public PropertyService(PropertyRepository propertyRepository) {
        this.propertyRepository = propertyRepository;
    }

    // Get all properties
    @Transactional(readOnly = true)
    public List<Property> getAllProperties() {
        return propertyRepository.findAll();
    }

    // Search by address
    @Transactional(readOnly = true)
    public List<Property> searchByAddress(String address) {
        return propertyRepository
                .findByAddressContainingIgnoreCase(address);
    }

    // Search by city
    @Transactional(readOnly = true)
    public List<Property> searchByCity(String city) {
        return propertyRepository
                .findByCityContainingIgnoreCase(city);
    }

    // Search by ZIP code
    @Transactional(readOnly = true)
    public List<Property> searchByZipCode(String zipCode) {
        return propertyRepository.findByZipCode(zipCode);
    }

    // Get property by ID and cache it in Redis

    @Transactional(readOnly = true)
    public Property getPropertyById(Long id) {
        return propertyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(
                        "Property not found: " + id));
    }

    // Create property and clear property cache
    @CacheEvict(value = "properties", allEntries = true)
    public Property createProperty(Property property) {
        return propertyRepository.save(property);
    }

    // Update an existing property and refresh its Redis cache
    @CachePut(value = "properties", key = "#id")
    public Property updateProperty(
            Long id,
            Property updatedProperty) {

        Property existingProperty = propertyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(
                        "Property not found: " + id));

        existingProperty.setAddress(updatedProperty.getAddress());
        existingProperty.setCity(updatedProperty.getCity());
        existingProperty.setState(updatedProperty.getState());
        existingProperty.setZipCode(updatedProperty.getZipCode());
        existingProperty.setPropertyType(
                updatedProperty.getPropertyType());
        existingProperty.setPrice(updatedProperty.getPrice());

        return propertyRepository.save(existingProperty);
    }

    // Delete property and remove its Redis cache entry
    @CacheEvict(value = "properties", key = "#id")
    public void deleteProperty(Long id) {
        if (!propertyRepository.existsById(id)) {
            throw new RuntimeException(
                    "Property not found: " + id);
        }

        propertyRepository.deleteById(id);
    }
}
