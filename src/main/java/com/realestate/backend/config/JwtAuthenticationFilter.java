
package com.realestate.backend.config;

import com.realestate.backend.service.JwtService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.crypto.SecretKey;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

        private final SecretKey key;

        public JwtAuthenticationFilter() {
                this.key = Keys.hmacShaKeyFor(
                                JwtService.SECRET.getBytes(StandardCharsets.UTF_8));
        }

        @Override
        protected boolean shouldNotFilter(HttpServletRequest request) {

                String path = request.getServletPath();

                // OAuth authorization and callback endpoints
                return path.startsWith("/oauth2/")
                                || path.startsWith("/login/oauth2/");
        }

        @Override
        protected void doFilterInternal(
                        HttpServletRequest request,
                        HttpServletResponse response,
                        FilterChain filterChain)
                        throws ServletException, IOException {

                String authHeader = request.getHeader("Authorization");

                // No JWT supplied: allow Spring Security to decide access.
                if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                        filterChain.doFilter(request, response);
                        return;
                }

                String token = authHeader.substring(7);

                try {
                        Claims claims = Jwts.parser()
                                        .verifyWith(key)
                                        .build()
                                        .parseSignedClaims(token)
                                        .getPayload();

                        String email = claims.getSubject();
                        String role = claims.get("role", String.class);

                        if (email == null || role == null) {
                                SecurityContextHolder.clearContext();
                                response.sendError(
                                                HttpServletResponse.SC_UNAUTHORIZED,
                                                "Invalid JWT claims");
                                return;
                        }

                        var authorities = List.of(
                                        new SimpleGrantedAuthority("ROLE_" + role));

                        var authentication = new UsernamePasswordAuthenticationToken(
                                        email,
                                        null,
                                        authorities);

                        SecurityContextHolder.getContext()
                                        .setAuthentication(authentication);

                } catch (Exception exception) {
                        SecurityContextHolder.clearContext();

                        response.sendError(
                                        HttpServletResponse.SC_UNAUTHORIZED,
                                        "Invalid or expired JWT");
                        return;
                }

                filterChain.doFilter(request, response);
        }
}
