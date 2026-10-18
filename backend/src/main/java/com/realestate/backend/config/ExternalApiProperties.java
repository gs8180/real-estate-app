package com.realestate.backend.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

import java.time.Duration;

@ConfigurationProperties(prefix = "external.api")
public class ExternalApiProperties {

    private Duration connectTimeout = Duration.ofSeconds(5);
    private Duration readTimeout = Duration.ofSeconds(10);

    private ApiEndpoint property = new ApiEndpoint();
    private ApiEndpoint geocoding = new ApiEndpoint();
    private ApiEndpoint ownership = new ApiEndpoint();
    private ApiEndpoint tax = new ApiEndpoint();
    private ApiEndpoint zoning = new ApiEndpoint();
    private ApiEndpoint flood = new ApiEndpoint();
    private ApiEndpoint permit = new ApiEndpoint();
    private ApiEndpoint environmental = new ApiEndpoint();
    private ApiEndpoint utility = new ApiEndpoint();

    public Duration getConnectTimeout() {
        return connectTimeout;
    }

    public void setConnectTimeout(Duration connectTimeout) {
        this.connectTimeout = connectTimeout;
    }

    public Duration getReadTimeout() {
        return readTimeout;
    }

    public void setReadTimeout(Duration readTimeout) {
        this.readTimeout = readTimeout;
    }

    public ApiEndpoint getProperty() {
        return property;
    }

    public void setProperty(ApiEndpoint property) {
        this.property = property;
    }

    public ApiEndpoint getGeocoding() {
        return geocoding;
    }

    public void setGeocoding(ApiEndpoint geocoding) {
        this.geocoding = geocoding;
    }

    public ApiEndpoint getOwnership() {
        return ownership;
    }

    public void setOwnership(ApiEndpoint ownership) {
        this.ownership = ownership;
    }

    public ApiEndpoint getTax() {
        return tax;
    }

    public void setTax(ApiEndpoint tax) {
        this.tax = tax;
    }

    public ApiEndpoint getZoning() {
        return zoning;
    }

    public void setZoning(ApiEndpoint zoning) {
        this.zoning = zoning;
    }

    public ApiEndpoint getFlood() {
        return flood;
    }

    public void setFlood(ApiEndpoint flood) {
        this.flood = flood;
    }

    public ApiEndpoint getPermit() {
        return permit;
    }

    public void setPermit(ApiEndpoint permit) {
        this.permit = permit;
    }

    public ApiEndpoint getEnvironmental() {
        return environmental;
    }

    public void setEnvironmental(ApiEndpoint environmental) {
        this.environmental = environmental;
    }

    public ApiEndpoint getUtility() {
        return utility;
    }

    public void setUtility(ApiEndpoint utility) {
        this.utility = utility;
    }

    public static class ApiEndpoint {

        private String baseUrl = "";
        private String apiKey = "";

        public ApiEndpoint() {
        }

        public ApiEndpoint(String baseUrl, String apiKey) {
            this.baseUrl = baseUrl;
            this.apiKey = apiKey;
        }

        public String getBaseUrl() {
            return baseUrl;
        }

        public void setBaseUrl(String baseUrl) {
            this.baseUrl = baseUrl;
        }

        public String getApiKey() {
            return apiKey;
        }

        public void setApiKey(String apiKey) {
            this.apiKey = apiKey;
        }
    }
}