package com.realestate.backend.document.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "supporting_documents")
public class SupportingDocument {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long propertyId;

    @Column(nullable = false)
    private String documentType;

    @Column(nullable = false)
    private String documentName;

    private String source;

    private String documentUrl;

    @Column(length = 2000)
    private String description;

    @Column(nullable = false)
    private LocalDateTime uploadedAt;

    public SupportingDocument() {
    }

    public SupportingDocument(
            Long propertyId,
            String documentType,
            String documentName,
            String source,
            String documentUrl,
            String description) {

        this.propertyId = propertyId;
        this.documentType = documentType;
        this.documentName = documentName;
        this.source = source;
        this.documentUrl = documentUrl;
        this.description = description;
        this.uploadedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public Long getPropertyId() {
        return propertyId;
    }

    public String getDocumentType() {
        return documentType;
    }

    public String getDocumentName() {
        return documentName;
    }

    public String getSource() {
        return source;
    }

    public String getDocumentUrl() {
        return documentUrl;
    }

    public String getDescription() {
        return description;
    }

    public LocalDateTime getUploadedAt() {
        return uploadedAt;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setPropertyId(Long propertyId) {
        this.propertyId = propertyId;
    }

    public void setDocumentType(String documentType) {
        this.documentType = documentType;
    }

    public void setDocumentName(String documentName) {
        this.documentName = documentName;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public void setDocumentUrl(String documentUrl) {
        this.documentUrl = documentUrl;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setUploadedAt(LocalDateTime uploadedAt) {
        this.uploadedAt = uploadedAt;
    }
}