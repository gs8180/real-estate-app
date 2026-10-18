package com.realestate.backend.property.repository;

import com.realestate.backend.property.entity.BuildingPermit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BuildingPermitRepository
        extends JpaRepository<BuildingPermit, Long> {

    List<BuildingPermit> findByPropertyId(Long propertyId);
}