package com.realestate.backend.service.impl;

import com.realestate.backend.dto.AuditLogDTO;
import com.realestate.backend.entity.AuditLog;
import com.realestate.backend.repository.AuditLogRepository;
import com.realestate.backend.service.AuditLogService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuditLogServiceImpl implements AuditLogService {

    private final AuditLogRepository auditLogRepository;

    @Override
    @Transactional
    public AuditLogDTO recordLog(AuditLogDTO dto) {
        AuditLog entity = AuditLog.builder()
                .propertyId(dto.getPropertyId())
                .action(dto.getAction() != null ? dto.getAction() : "ACTION")
                .category(dto.getCategory() != null ? dto.getCategory() : "GENERAL")
                .operator(dto.getOperator() != null ? dto.getOperator() : "system")
                .details(dto.getDetails())
                .status(dto.getStatus() != null ? dto.getStatus() : "SUCCESS")
                .ipAddress(dto.getIpAddress() != null ? dto.getIpAddress() : "127.0.0.1")
                .createdAt(dto.getCreatedAt() != null ? dto.getCreatedAt() : LocalDateTime.now())
                .build();

        AuditLog saved = auditLogRepository.save(entity);
        log.info("Recorded Audit Log [ID: {}, Action: {}, Operator: {}]", saved.getId(), saved.getAction(), saved.getOperator());
        return mapToDto(saved);
    }

    @Override
    @Transactional
    public AuditLogDTO recordLog(Long propertyId, String action, String category, String operator, String details, String status, String ipAddress) {
        AuditLog entity = AuditLog.builder()
                .propertyId(propertyId)
                .action(action)
                .category(category)
                .operator(operator)
                .details(details)
                .status(status)
                .ipAddress(ipAddress)
                .createdAt(LocalDateTime.now())
                .build();
        AuditLog saved = auditLogRepository.save(entity);
        return mapToDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AuditLogDTO> getRecentLogs(int limit) {
        return auditLogRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .limit(limit > 0 ? limit : 50)
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<AuditLogDTO> getLogsByProperty(Long propertyId) {
        return auditLogRepository.findByPropertyIdOrderByCreatedAtDesc(propertyId)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<AuditLogDTO> getLogsByCategory(String category) {
        return auditLogRepository.findByCategoryOrderByCreatedAtDesc(category)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private AuditLogDTO mapToDto(AuditLog entity) {
        return AuditLogDTO.builder()
                .id(entity.getId())
                .propertyId(entity.getPropertyId())
                .action(entity.getAction())
                .category(entity.getCategory())
                .operator(entity.getOperator())
                .details(entity.getDetails())
                .status(entity.getStatus())
                .ipAddress(entity.getIpAddress())
                .createdAt(entity.getCreatedAt())
                .build();
    }
}
