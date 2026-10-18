package com.realestate.backend.apilog.repository;

import com.realestate.backend.apilog.entity.ApiLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ApiLogRepository
        extends JpaRepository<ApiLog, Long> {

    List<ApiLog> findByServiceName(String serviceName);

    List<ApiLog> findBySuccess(boolean success);

    List<ApiLog> findByHttpMethod(String httpMethod);
}