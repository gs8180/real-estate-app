package com.realestate.backend.property.repository;

import com.realestate.backend.property.entity.Property;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PropertyRepository extends JpaRepository<Property, Long> {

    List<Property> findByAddressContainingIgnoreCase(String address);

    List<Property> findByCityContainingIgnoreCase(String city);

    List<Property> findByZipCode(String zipCode);
}