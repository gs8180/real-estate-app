package com.realestate.backend.integration.external;

import com.realestate.backend.property.entity.Property;
import org.springframework.stereotype.Service;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Retryable;

@Service
public class MockExternalPropertyService implements ExternalPropertyService {

    @Override
    @Retryable(
            retryFor = RuntimeException.class,
            maxAttempts = 3,
            backoff = @Backoff(delay = 1000)
    )
    public Property fetchPropertyData(String address) {

        System.out.println(
                "Calling external property service for: " + address
        );

        return new Property(
                address,
                "Sample City",
                "Sample State",
                "00000",
                "Residential",
                250000.0
        );
    }
}