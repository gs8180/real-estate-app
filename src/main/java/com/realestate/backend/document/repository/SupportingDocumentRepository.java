package com.realestate.backend.document.repository;

import com.realestate.backend.document.entity.SupportingDocument;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SupportingDocumentRepository
        extends JpaRepository<SupportingDocument, Long> {

    List<SupportingDocument> findByPropertyId(Long propertyId);

    List<SupportingDocument> findByDocumentType(String documentType);

    List<SupportingDocument> findByPropertyIdAndDocumentType(
            Long propertyId,
            String documentType
    );
}