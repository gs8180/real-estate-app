package com.realestate.backend.utility.repository;

import com.realestate.backend.utility.entity.UtilityInformation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UtilityInformationRepository
        extends JpaRepository<UtilityInformation, Long> {

    Optional<UtilityInformation> findByPropertyId(Long propertyId);
}