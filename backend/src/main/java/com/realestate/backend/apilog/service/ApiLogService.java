package com.realestate.backend.apilog.service;

import com.realestate.backend.apilog.entity.ApiLog;
import com.realestate.backend.apilog.repository.ApiLogRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ApiLogService {

    private final ApiLogRepository apiLogRepository;

    public ApiLogService(ApiLogRepository apiLogRepository) {
        this.apiLogRepository = apiLogRepository;
    }

    public ApiLog createLog(
            String serviceName,
            String endpoint,
            String httpMethod,
            Integer statusCode,
            Long responseTimeMs,
            boolean success,
            String errorMessage) {

        ApiLog apiLog = new ApiLog(
                serviceName,
                endpoint,
                httpMethod,
                statusCode,
                responseTimeMs,
                success,
                errorMessage
        );

        return apiLogRepository.save(apiLog);
    }

    public List<ApiLog> getAllLogs() {
        return apiLogRepository.findAll();
    }

    public List<ApiLog> getByServiceName(String serviceName) {
        return apiLogRepository.findByServiceName(serviceName);
    }

    public List<ApiLog> getBySuccess(boolean success) {
        return apiLogRepository.findBySuccess(success);
    }

    public List<ApiLog> getByHttpMethod(String httpMethod) {
        return apiLogRepository.findByHttpMethod(httpMethod);
    }

    public ApiLog getById(Long id) {
        return apiLogRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "API log not found: " + id));
    }
}