package com.realestate.backend.property.repository;

import com.realestate.backend.property.entity.FloodZoneInformation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FloodZoneInformationRepository
        extends JpaRepository<FloodZoneInformation, Long> {

    List<FloodZoneInformation> findByPropertyId(Long propertyId);
}