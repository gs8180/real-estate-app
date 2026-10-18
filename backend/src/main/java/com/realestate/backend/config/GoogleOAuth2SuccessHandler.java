
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

@Component
public class GoogleOAuth2SuccessHandler
                implements AuthenticationSuccessHandler {

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

                User user = userRepository.findByEmail(email)
                                .orElseGet(() -> userRepository.save(
                                                new User(name != null && !name.isBlank() ? name : email.split("@")[0], email, "", "BUYER")));

                String role = user.getRole();

                if (role == null || role.isBlank()) {
                        role = "BUYER";
                }

                String token = jwtService.generateToken(email, role);

                String redirectUrl = (frontendRedirectUri != null && !frontendRedirectUri.isBlank())
                                ? frontendRedirectUri
                                : "http://localhost:3000/login/success";

                String fullRedirect = redirectUrl.contains("?")
                                ? redirectUrl + "&token="
                                : redirectUrl + "?token=";

                response.sendRedirect(
                                fullRedirect
                                                + java.net.URLEncoder.encode(
                                                                token,
                                                                java.nio.charset.StandardCharsets.UTF_8));
        }
}
