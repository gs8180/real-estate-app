package com.realestate.backend.integration.flood;

import com.realestate.backend.property.entity.FloodZoneInformation;
import com.realestate.backend.property.entity.Property;
import com.realestate.backend.property.repository.FloodZoneInformationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FloodZoneInformationService {

    private final FloodZoneInformationRepository floodZoneRepository;

    public FloodZoneInformationService(
            FloodZoneInformationRepository floodZoneRepository) {

        this.floodZoneRepository = floodZoneRepository;
    }

    public FloodZoneInformation saveFloodZoneInformation(
            Property property,
            String floodZone,
            String riskLevel,
            String source) {

        FloodZoneInformation floodZoneInformation =
                new FloodZoneInformation(
                        property,
                        floodZone,
                        riskLevel,
                        source
                );

        return floodZoneRepository.save(floodZoneInformation);
    }

    public List<FloodZoneInformation> getFloodZoneInformation(
            Long propertyId) {

        return floodZoneRepository.findByPropertyId(propertyId);
    }
}