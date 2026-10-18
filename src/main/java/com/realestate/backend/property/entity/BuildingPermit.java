package com.realestate.backend.property.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "building_permits")
public class BuildingPermit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "property_id", nullable = false)
    private Property property;

    private String permitNumber;

    private String permitType;

    private String issueDate;

    private String status;

    public BuildingPermit() {
    }

    public BuildingPermit(
            Property property,
            String permitNumber,
            String permitType,
            String issueDate,
            String status) {

        this.property = property;
        this.permitNumber = permitNumber;
        this.permitType = permitType;
        this.issueDate = issueDate;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public Property getProperty() {
        return property;
    }

    public void setProperty(Property property) {
        this.property = property;
    }

    public String getPermitNumber() {
        return permitNumber;
    }

    public void setPermitNumber(String permitNumber) {
        this.permitNumber = permitNumber;
    }

    public String getPermitType() {
        return permitType;
    }

    public void setPermitType(String permitType) {
        this.permitType = permitType;
    }

    public String getIssueDate() {
        return issueDate;
    }

    public void setIssueDate(String issueDate) {
        this.issueDate = issueDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}