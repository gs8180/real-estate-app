package com.realestate.backend.audit.repository;

import com.realestate.backend.audit.entity.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AuditLogRepository
        extends JpaRepository<AuditLog, Long> {

    List<AuditLog> findByPropertyId(Long propertyId);

    List<AuditLog> findByUsername(String username);
}