package com.realestate.backend.document.service;

import com.realestate.backend.document.entity.SupportingDocument;
import com.realestate.backend.document.repository.SupportingDocumentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SupportingDocumentService {

    private final SupportingDocumentRepository documentRepository;

    public SupportingDocumentService(
            SupportingDocumentRepository documentRepository) {

        this.documentRepository = documentRepository;
    }

    public SupportingDocument createDocument(
            Long propertyId,
            String documentType,
            String documentName,
            String source,
            String documentUrl,
            String description) {

        SupportingDocument document = new SupportingDocument(
                propertyId,
                documentType,
                documentName,
                source,
                documentUrl,
                description
        );

        return documentRepository.save(document);
    }

    public List<SupportingDocument> getAllDocuments() {
        return documentRepository.findAll();
    }

    public List<SupportingDocument> getByPropertyId(Long propertyId) {
        return documentRepository.findByPropertyId(propertyId);
    }

    public List<SupportingDocument> getByDocumentType(
            String documentType) {

        return documentRepository.findByDocumentType(documentType);
    }

    public List<SupportingDocument> getByPropertyAndType(
            Long propertyId,
            String documentType) {

        return documentRepository.findByPropertyIdAndDocumentType(
                propertyId,
                documentType
        );
    }

    public SupportingDocument getById(Long id) {

        return documentRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Supporting document not found: " + id
                        ));
    }

    public void deleteDocument(Long id) {

        if (!documentRepository.existsById(id)) {
            throw new RuntimeException(
                    "Supporting document not found: " + id
            );
        }

        documentRepository.deleteById(id);
    }
}