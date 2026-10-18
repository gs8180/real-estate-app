package com.realestate.backend.property.repository;

import com.realestate.backend.property.entity.OwnershipRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OwnershipRecordRepository
        extends JpaRepository<OwnershipRecord, Long> {

    List<OwnershipRecord> findByPropertyId(Long propertyId);
}