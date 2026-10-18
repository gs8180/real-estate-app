package com.realestate.backend.document.controller;

import com.realestate.backend.document.entity.SupportingDocument;
import com.realestate.backend.document.service.SupportingDocumentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/documents")
public class SupportingDocumentController {

    private final SupportingDocumentService documentService;

    public SupportingDocumentController(
            SupportingDocumentService documentService) {

        this.documentService = documentService;
    }

    @PostMapping
    public ResponseEntity<SupportingDocument> createDocument(
            @RequestParam Long propertyId,
            @RequestParam String documentType,
            @RequestParam String documentName,
            @RequestParam(required = false) String source,
            @RequestParam(required = false) String documentUrl,
            @RequestParam(required = false) String description) {

        SupportingDocument document =
                documentService.createDocument(
                        propertyId,
                        documentType,
                        documentName,
                        source,
                        documentUrl,
                        description
                );

        return ResponseEntity.ok(document);
    }

    @GetMapping
    public ResponseEntity<List<SupportingDocument>> getAllDocuments() {

        return ResponseEntity.ok(
                documentService.getAllDocuments()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<SupportingDocument> getById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                documentService.getById(id)
        );
    }

    @GetMapping("/property/{propertyId}")
    public ResponseEntity<List<SupportingDocument>> getByPropertyId(
            @PathVariable Long propertyId) {

        return ResponseEntity.ok(
                documentService.getByPropertyId(propertyId)
        );
    }

    @GetMapping("/type/{documentType}")
    public ResponseEntity<List<SupportingDocument>> getByDocumentType(
            @PathVariable String documentType) {

        return ResponseEntity.ok(
                documentService.getByDocumentType(documentType)
        );
    }

    @GetMapping("/property/{propertyId}/type/{documentType}")
    public ResponseEntity<List<SupportingDocument>> getByPropertyAndType(
            @PathVariable Long propertyId,
            @PathVariable String documentType) {

        return ResponseEntity.ok(
                documentService.getByPropertyAndType(
                        propertyId,
                        documentType
                )
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDocument(
            @PathVariable Long id) {

        documentService.deleteDocument(id);

        return ResponseEntity.noContent().build();
    }
}