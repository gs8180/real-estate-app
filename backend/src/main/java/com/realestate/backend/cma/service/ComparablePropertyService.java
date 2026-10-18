
package com.realestate.backend.cma.service;

import com.realestate.backend.cma.dto.ComparablePropertyResponse;
import com.realestate.backend.property.entity.Property;
import com.realestate.backend.property.repository.PropertyRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Service
public class ComparablePropertyService {

        private final PropertyRepository propertyRepository;

        public ComparablePropertyService(
                        PropertyRepository propertyRepository) {
                this.propertyRepository = propertyRepository;
        }

        public List<ComparablePropertyResponse> findComparables(
                        Long propertyId) {

                Property targetProperty = propertyRepository.findById(propertyId)
                                .orElseThrow(() -> new RuntimeException(
                                                "Property not found: " + propertyId));

                List<Property> allProperties = propertyRepository.findAll();

                // First, find matching properties in the same city.
                List<Property> sameCity = allProperties.stream()
                                .filter(p -> !Objects.equals(p.getId(), propertyId))
                                .filter(p -> sameType(targetProperty, p))
                                .filter(p -> targetProperty.getCity() != null
                                                && p.getCity() != null
                                                && targetProperty.getCity()
                                                                .equalsIgnoreCase(p.getCity()))
                                .toList();

                // If none are found, search other cities.
                List<Property> candidates = sameCity.isEmpty()
                                ? allProperties.stream()
                                                .filter(p -> !Objects.equals(p.getId(), propertyId))
                                                .filter(p -> sameType(targetProperty, p))
                                                .toList()
                                : sameCity;

                return candidates.stream()
                                .map(p -> createComparableResponse(
                                                targetProperty, p))
                                .toList();
        }

        private boolean sameType(Property target, Property candidate) {
                return target.getPropertyType() == null
                                || candidate.getPropertyType() == null
                                || target.getPropertyType()
                                                .equalsIgnoreCase(candidate.getPropertyType());
        }

        private ComparablePropertyResponse createComparableResponse(
                        Property target,
                        Property comparable) {

                double targetPrice = target.getPrice() != null
                                ? target.getPrice()
                                : 0.0;

                double comparablePrice = comparable.getPrice() != null
                                ? comparable.getPrice()
                                : 0.0;

                double difference = comparablePrice - targetPrice;

                double percentage = targetPrice > 0
                                ? (difference / targetPrice) * 100
                                : 0.0;

                return new ComparablePropertyResponse(
                                comparable.getId(),
                                comparable.getAddress(),
                                comparable.getCity(),
                                comparable.getState(),
                                comparable.getZipCode(),
                                comparable.getPropertyType(),
                                comparablePrice,
                                round(difference),
                                round(percentage));
        }

        private double round(double value) {
                return Math.round(value * 100.0) / 100.0;
        }
}
