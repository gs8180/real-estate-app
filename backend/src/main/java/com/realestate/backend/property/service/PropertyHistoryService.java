package com.realestate.backend.property.service;

import com.realestate.backend.property.entity.Property;
import com.realestate.backend.property.entity.PropertyHistory;
import com.realestate.backend.property.repository.PropertyHistoryRepository;
import com.realestate.backend.property.repository.PropertyRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PropertyHistoryService {

    private final PropertyHistoryRepository historyRepository;
    private final PropertyRepository propertyRepository;

    public PropertyHistoryService(
            PropertyHistoryRepository historyRepository,
            PropertyRepository propertyRepository) {

        this.historyRepository = historyRepository;
        this.propertyRepository = propertyRepository;
    }

    public List<PropertyHistory> getHistory(Long propertyId) {

        if (!propertyRepository.existsById(propertyId)) {
            throw new RuntimeException("Property not found");
        }

        return historyRepository
                .findByPropertyIdOrderByChangedAtDesc(propertyId);
    }

    public PropertyHistory addHistory(
            Long propertyId,
            String action) {

        Property property = propertyRepository
                .findById(propertyId)
                .orElseThrow(() ->
                        new RuntimeException("Property not found"));

        PropertyHistory history = new PropertyHistory(
                property,
                action,
                LocalDateTime.now()
        );

        return historyRepository.save(history);
    }
}