package com.realestate.backend.controller;

import com.realestate.backend.dto.LoginRequest;
import com.realestate.backend.dto.RegisterRequest;
import com.realestate.backend.service.AuthService;
import com.realestate.backend.entity.User;
import com.realestate.backend.dto.UserProfileResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<UserProfileResponse> register(
            @RequestBody RegisterRequest request) {

        User user = authService.register(request);
        UserProfileResponse response = new UserProfileResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole()
        );
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(
            @RequestBody LoginRequest request) {

        String token = authService.login(request);

        return ResponseEntity.ok(
                Map.of(
                        "token", token,
                        "message", "Login successful"
                )
        );
    }
}