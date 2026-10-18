package com.realestate.backend.utility.service;

import com.realestate.backend.property.entity.Property;
import com.realestate.backend.property.repository.PropertyRepository;
import com.realestate.backend.utility.entity.UtilityInformation;
import com.realestate.backend.utility.repository.UtilityInformationRepository;
import org.springframework.stereotype.Service;

@Service
public class UtilityInformationService {

    private final UtilityInformationRepository utilityRepository;
    private final PropertyRepository propertyRepository;

    public UtilityInformationService(
            UtilityInformationRepository utilityRepository,
            PropertyRepository propertyRepository) {

        this.utilityRepository = utilityRepository;
        this.propertyRepository = propertyRepository;
    }

    public UtilityInformation saveUtilityInformation(
            Long propertyId,
            UtilityInformation utilityInformation) {

        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Property not found: " + propertyId));

        utilityInformation.setProperty(property);

        return utilityRepository.save(utilityInformation);
    }

    public UtilityInformation getUtilityInformation(Long propertyId) {

        return utilityRepository.findByPropertyId(propertyId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Utility information not found for property: "
                                        + propertyId));
    }
}