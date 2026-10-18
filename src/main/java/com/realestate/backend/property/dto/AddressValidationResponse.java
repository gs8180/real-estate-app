package com.realestate.backend.property.dto;

public class AddressValidationResponse {

    private String address;
    private boolean valid;
    private String message;

    public AddressValidationResponse() {
    }

    public AddressValidationResponse(
            String address,
            boolean valid,
            String message) {

        this.address = address;
        this.valid = valid;
        this.message = message;
    }

    public String getAddress() {
        return address;
    }

    public boolean isValid() {
        return valid;
    }

    public String getMessage() {
        return message;
    }
}