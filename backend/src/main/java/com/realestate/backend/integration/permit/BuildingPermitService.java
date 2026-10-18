package com.realestate.backend.integration.permit;

import com.realestate.backend.property.entity.BuildingPermit;
import com.realestate.backend.property.entity.Property;
import com.realestate.backend.property.repository.BuildingPermitRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BuildingPermitService {

    private final BuildingPermitRepository buildingPermitRepository;

    public BuildingPermitService(
            BuildingPermitRepository buildingPermitRepository) {

        this.buildingPermitRepository = buildingPermitRepository;
    }

    public BuildingPermit saveBuildingPermit(
            Property property,
            String permitNumber,
            String permitType,
            String issueDate,
            String status) {

        BuildingPermit permit = new BuildingPermit(
                property,
                permitNumber,
                permitType,
                issueDate,
                status
        );

        return buildingPermitRepository.save(permit);
    }

    public List<BuildingPermit> getBuildingPermits(Long propertyId) {

        return buildingPermitRepository.findByPropertyId(propertyId);
    }
}