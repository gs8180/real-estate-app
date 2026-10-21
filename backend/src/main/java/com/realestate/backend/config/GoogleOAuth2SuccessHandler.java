package com.realestate.backend.config;

import com.realestate.backend.entity.User;
import com.realestate.backend.repository.UserRepository;
import com.realestate.backend.service.JwtService;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Optional;

@Component
public class GoogleOAuth2SuccessHandler implements AuthenticationSuccessHandler {

        private final JwtService jwtService;
        private final UserRepository userRepository;

        @org.springframework.beans.factory.annotation.Value("${app.oauth2.redirect-uri:http://localhost:3000/login/success}")
        private String frontendRedirectUri;

        public GoogleOAuth2SuccessHandler(
                        JwtService jwtService,
                        UserRepository userRepository) {
                this.jwtService = jwtService;
                this.userRepository = userRepository;
        }

        @Override
        public void onAuthenticationSuccess(
                        HttpServletRequest request,
                        HttpServletResponse response,
                        Authentication authentication)
                        throws IOException, ServletException {

                if (!(authentication.getPrincipal() instanceof OidcUser googleUser)) {
                        response.sendError(
                                        HttpServletResponse.SC_UNAUTHORIZED,
                                        "Invalid Google user");
                        return;
                }

                String email = googleUser.getEmail();
                String name = googleUser.getFullName();

                if (email == null || email.isBlank()
                                || !Boolean.TRUE.equals(googleUser.getEmailVerified())) {
                        response.sendError(
                                        HttpServletResponse.SC_UNAUTHORIZED,
                                        "A verified Google email is required");
                        return;
                }

                Optional<User> existingUser = userRepository.findByEmail(email);

                String redirectUrl = (frontendRedirectUri != null && !frontendRedirectUri.isBlank())
                                ? frontendRedirectUri
                                : "http://localhost:3000/login/success";

                // Determine base URL
                String baseUrl = redirectUrl;
                int pathIndex = baseUrl.indexOf("/login");
                if (pathIndex != -1) {
                        baseUrl = baseUrl.substring(0, pathIndex);
                } else {
                        int slashIndex = baseUrl.lastIndexOf("/");
                        if (slashIndex > 8) {
                                baseUrl = baseUrl.substring(0, slashIndex);
                        }
                }

                // If user doesn't exist, redirect to register page to ask for role
                if (existingUser.isEmpty()) {
                        String registerUrl = baseUrl + "/register"
                                        + "?email=" + URLEncoder.encode(email, StandardCharsets.UTF_8)
                                        + "&name=" + URLEncoder.encode(name != null ? name : "", StandardCharsets.UTF_8)
                                        + "&google=true";
                        response.sendRedirect(registerUrl);
                        return;
                }

                User user = existingUser.get();
                String role = user.getRole();
                if (role == null || role.isBlank()) {
                        role = "BUYER";
                }

                String token = jwtService.generateToken(email, role);

                String fullRedirect = redirectUrl.contains("?")
                                ? redirectUrl + "&token="
                                : redirectUrl + "?token=";

                fullRedirect += URLEncoder.encode(token, StandardCharsets.UTF_8)
                                + "&role=" + URLEncoder.encode(role, StandardCharsets.UTF_8);

                response.sendRedirect(fullRedirect);
        }
}
