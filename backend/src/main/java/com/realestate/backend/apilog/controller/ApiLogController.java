package com.realestate.backend.apilog.controller;

import com.realestate.backend.apilog.entity.ApiLog;
import com.realestate.backend.apilog.service.ApiLogService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/api-logs")
public class ApiLogController {

    private final ApiLogService apiLogService;

    public ApiLogController(ApiLogService apiLogService) {
        this.apiLogService = apiLogService;
    }

    @PostMapping
    public ResponseEntity<ApiLog> createLog(
            @RequestParam String serviceName,
            @RequestParam String endpoint,
            @RequestParam String httpMethod,
            @RequestParam(required = false) Integer statusCode,
            @RequestParam(required = false) Long responseTimeMs,
            @RequestParam boolean success,
            @RequestParam(required = false) String errorMessage) {

        ApiLog apiLog = apiLogService.createLog(
                serviceName,
                endpoint,
                httpMethod,
                statusCode,
                responseTimeMs,
                success,
                errorMessage
        );

        return ResponseEntity.ok(apiLog);
    }

    @GetMapping
    public ResponseEntity<List<ApiLog>> getAllLogs() {
        return ResponseEntity.ok(
                apiLogService.getAllLogs()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiLog> getById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                apiLogService.getById(id)
        );
    }

    @GetMapping("/service/{serviceName}")
    public ResponseEntity<List<ApiLog>> getByServiceName(
            @PathVariable String serviceName) {

        return ResponseEntity.ok(
                apiLogService.getByServiceName(serviceName)
        );
    }

    @GetMapping("/success/{success}")
    public ResponseEntity<List<ApiLog>> getBySuccess(
            @PathVariable boolean success) {

        return ResponseEntity.ok(
                apiLogService.getBySuccess(success)
        );
    }

    @GetMapping("/method/{httpMethod}")
    public ResponseEntity<List<ApiLog>> getByHttpMethod(
            @PathVariable String httpMethod) {

        return ResponseEntity.ok(
                apiLogService.getByHttpMethod(httpMethod)
        );
    }
}