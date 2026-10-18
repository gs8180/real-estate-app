package com.realestate.backend.integration.external;

import com.realestate.backend.property.entity.Property;

public interface ExternalPropertyService {

    Property fetchPropertyData(String address);
}