package com.realestate.backend.property.service;

import com.realestate.backend.property.dto.AddressValidationResponse;
import org.springframework.stereotype.Service;

@Service
public class AddressValidationService {

    public AddressValidationResponse validateAddress(String address) {

        if (address == null || address.isBlank()) {
            return new AddressValidationResponse(
                    address,
                    false,
                    "Address cannot be empty"
            );
        }

        if (address.trim().length() < 5) {
            return new AddressValidationResponse(
                    address,
                    false,
                    "Address is too short"
            );
        }

        return new AddressValidationResponse(
                address,
                true,
                "Address format is valid"
        );
    }
}