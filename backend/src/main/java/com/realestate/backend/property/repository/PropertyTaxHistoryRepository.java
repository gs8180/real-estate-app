package com.realestate.backend.property.repository;

import com.realestate.backend.property.entity.PropertyTaxHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PropertyTaxHistoryRepository
        extends JpaRepository<PropertyTaxHistory, Long> {

    List<PropertyTaxHistory> findByPropertyId(Long propertyId);
}