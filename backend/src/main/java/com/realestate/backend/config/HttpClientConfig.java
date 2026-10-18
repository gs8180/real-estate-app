package com.realestate.backend.config;

import com.realestate.backend.apilog.service.ApiLogService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.client.ClientHttpRequestInterceptor;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.client.RestClient;

import java.io.IOException;
import java.net.URI;
import java.time.Duration;

@Configuration
@EnableConfigurationProperties(ExternalApiProperties.class)
public class HttpClientConfig {

    private static final Logger log =
            LoggerFactory.getLogger(HttpClientConfig.class);

    @Bean
    public ClientHttpRequestInterceptor outboundLoggingInterceptor(
            ApiLogService apiLogService) {

        return (request, body, execution) -> {

            String method = request.getMethod() != null
                    ? request.getMethod().name()
                    : "UNKNOWN";

            URI uri = request.getURI();

            String host = uri.getHost() != null
                    ? uri.getHost()
                    : "unknown-host";

            String path = uri.getPath() != null
                    ? uri.getPath()
                    : "/";

            String target = host + path;

            long startTime = System.currentTimeMillis();

            try {

                ClientHttpResponse response =
                        execution.execute(request, body);

                long latency =
                        System.currentTimeMillis() - startTime;

                int statusCode =
                        response.getStatusCode().value();

                boolean success =
                        statusCode >= 200 && statusCode < 300;

                log.info(
                        "Outbound HTTP [{}] {} -> Status: {} ({} ms)",
                        method,
                        target,
                        statusCode,
                        latency
                );

                apiLogService.createLog(
                        "EXTERNAL_API",
                        target,
                        method,
                        statusCode,
                        latency,
                        success,
                        null
                );

                return response;

            } catch (IOException | RuntimeException ex) {

                long latency =
                        System.currentTimeMillis() - startTime;

                log.error(
                        "Outbound HTTP [{}] {} -> FAILED after {} ms: {}",
                        method,
                        target,
                        latency,
                        ex.getMessage()
                );

                apiLogService.createLog(
                        "EXTERNAL_API",
                        target,
                        method,
                        null,
                        latency,
                        false,
                        ex.getMessage()
                );

                throw ex;
            }
        };
    }

    @Bean
    public RestClient restClient(
            ExternalApiProperties properties,
            ClientHttpRequestInterceptor outboundLoggingInterceptor) {

        SimpleClientHttpRequestFactory requestFactory =
                new SimpleClientHttpRequestFactory();

        Duration connectTimeout =
                properties.getConnectTimeout() != null
                        ? properties.getConnectTimeout()
                        : Duration.ofSeconds(5);

        Duration readTimeout =
                properties.getReadTimeout() != null
                        ? properties.getReadTimeout()
                        : Duration.ofSeconds(10);

        requestFactory.setConnectTimeout(connectTimeout);
        requestFactory.setReadTimeout(readTimeout);

        return RestClient.builder()
                .requestFactory(requestFactory)
                .defaultHeader(
                        HttpHeaders.ACCEPT,
                        MediaType.APPLICATION_JSON_VALUE
                )
                .defaultHeader(
                        HttpHeaders.CONTENT_TYPE,
                        MediaType.APPLICATION_JSON_VALUE
                )
                .defaultHeader(
                        HttpHeaders.USER_AGENT,
                        "RealEstateDueDiligenceAgent/1.0"
                )
                .requestInterceptor(
                        outboundLoggingInterceptor
                )
                .build();
    }
}