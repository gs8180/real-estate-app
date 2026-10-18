package com.realestate.backend.integration.zoning;

import com.realestate.backend.property.entity.Property;
import com.realestate.backend.property.entity.ZoningInformation;
import com.realestate.backend.property.repository.ZoningInformationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ZoningInformationService {

    private final ZoningInformationRepository zoningInformationRepository;

    public ZoningInformationService(
            ZoningInformationRepository zoningInformationRepository) {

        this.zoningInformationRepository = zoningInformationRepository;
    }

    public ZoningInformation saveZoningInformation(
            Property property,
            String zoningType,
            String zoningCode,
            String permittedUse) {

        ZoningInformation zoningInformation =
                new ZoningInformation(
                        property,
                        zoningType,
                        zoningCode,
                        permittedUse
                );

        return zoningInformationRepository.save(zoningInformation);
    }

    public List<ZoningInformation> getZoningInformation(
            Long propertyId) {

        return zoningInformationRepository.findByPropertyId(propertyId);
    }
}