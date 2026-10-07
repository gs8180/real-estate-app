package com.realestate.backend.repository;

import com.realestate.backend.entity.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    List<AuditLog> findByPropertyIdOrderByCreatedAtDesc(Long propertyId);
    List<AuditLog> findAllByOrderByCreatedAtDesc();
    List<AuditLog> findByCategoryOrderByCreatedAtDesc(String category);
}
