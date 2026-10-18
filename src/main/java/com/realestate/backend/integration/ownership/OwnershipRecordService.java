
package com.realestate.backend.integration.ownership;

import com.realestate.backend.property.entity.OwnershipRecord;
import com.realestate.backend.property.entity.Property;
import com.realestate.backend.property.repository.OwnershipRecordRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OwnershipRecordService {

    private final OwnershipRecordRepository ownershipRecordRepository;

    public OwnershipRecordService(
            OwnershipRecordRepository ownershipRecordRepository) {
        this.ownershipRecordRepository = ownershipRecordRepository;
    }

    public OwnershipRecord saveOwnershipRecord(
            Property property,
            String ownerName,
            String ownershipType) {

        OwnershipRecord record = new OwnershipRecord(
                property,
                ownerName,
                ownershipType);

        return ownershipRecordRepository.save(record);
    }

    public List<OwnershipRecord> getOwnershipRecords(Long propertyId) {
        return ownershipRecordRepository.findByPropertyId(propertyId);
    }
}
