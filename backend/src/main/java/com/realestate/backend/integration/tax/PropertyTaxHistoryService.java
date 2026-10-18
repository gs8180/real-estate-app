package com.realestate.backend.integration.tax;

import com.realestate.backend.property.entity.Property;
import com.realestate.backend.property.entity.PropertyTaxHistory;
import com.realestate.backend.property.repository.PropertyTaxHistoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PropertyTaxHistoryService {

    private final PropertyTaxHistoryRepository taxHistoryRepository;

    public PropertyTaxHistoryService(
            PropertyTaxHistoryRepository taxHistoryRepository) {

        this.taxHistoryRepository = taxHistoryRepository;
    }

    public PropertyTaxHistory saveTaxHistory(
            Property property,
            Integer taxYear,
            Double taxAmount,
            Double amountPaid,
            String paymentStatus) {

        PropertyTaxHistory taxHistory = new PropertyTaxHistory(
                property,
                taxYear,
                taxAmount,
                amountPaid,
                paymentStatus
        );

        return taxHistoryRepository.save(taxHistory);
    }

    public List<PropertyTaxHistory> getTaxHistory(Long propertyId) {

        return taxHistoryRepository.findByPropertyId(propertyId);
    }
}