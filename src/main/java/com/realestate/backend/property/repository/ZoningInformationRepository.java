package com.realestate.backend.property.repository;

import com.realestate.backend.property.entity.ZoningInformation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ZoningInformationRepository
        extends JpaRepository<ZoningInformation, Long> {

    List<ZoningInformation> findByPropertyId(Long propertyId);
}