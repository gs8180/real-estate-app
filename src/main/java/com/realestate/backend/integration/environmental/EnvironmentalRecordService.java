package com.realestate.backend.integration.environmental;

import com.realestate.backend.property.entity.EnvironmentalRecord;
import com.realestate.backend.property.entity.Property;
import com.realestate.backend.property.repository.EnvironmentalRecordRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EnvironmentalRecordService {

    private final EnvironmentalRecordRepository environmentalRecordRepository;

    public EnvironmentalRecordService(
            EnvironmentalRecordRepository environmentalRecordRepository) {

        this.environmentalRecordRepository =
                environmentalRecordRepository;
    }

    public EnvironmentalRecord saveEnvironmentalRecord(
            Property property,
            String recordType,
            String riskLevel,
            String description,
            String source) {

        EnvironmentalRecord record =
                new EnvironmentalRecord(
                        property,
                        recordType,
                        riskLevel,
                        description,
                        source
                );

        return environmentalRecordRepository.save(record);
    }

    public List<EnvironmentalRecord> getEnvironmentalRecords(
            Long propertyId) {

        return environmentalRecordRepository
                .findByPropertyId(propertyId);
    }
}