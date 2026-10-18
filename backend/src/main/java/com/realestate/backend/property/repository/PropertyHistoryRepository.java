package com.realestate.backend.property.repository;

import com.realestate.backend.property.entity.PropertyHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PropertyHistoryRepository
        extends JpaRepository<PropertyHistory, Long> {

    List<PropertyHistory> findByPropertyIdOrderByChangedAtDesc(
            Long propertyId
    );
}