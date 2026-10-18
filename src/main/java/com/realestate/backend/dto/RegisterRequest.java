package com.realestate.backend.dto;

public class RegisterRequest {

    private String name;
    private String fullName;
    private String email;
    private String password;
    private String role;

    public RegisterRequest() {
    }

    public RegisterRequest(String name, String email, String password, String role) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
    }

    public String getName() {
        if (name != null && !name.isBlank()) {
            return name;
        }
        if (fullName != null && !fullName.isBlank()) {
            return fullName;
        }
        if (email != null && !email.isBlank()) {
            return email.split("@")[0];
        }
        return "User";
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRole() {
        return (role != null && !role.isBlank()) ? role : "BUYER";
    }

    public void setRole(String role) {
        this.role = role;
    }
}