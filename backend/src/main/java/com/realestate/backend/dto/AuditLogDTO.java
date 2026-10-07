package com.realestate.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuditLogDTO {
    private Long id;
    private Long propertyId;
    private String action;
    private String category;
    private String operator;
    private String details;
    private String status;
    private String ipAddress;
    private LocalDateTime createdAt;
}
