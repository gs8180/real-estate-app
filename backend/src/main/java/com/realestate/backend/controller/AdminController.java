package com.realestate.backend.controller;

import com.realestate.backend.dto.AdminCreateUserRequest;
import com.realestate.backend.dto.AdminUpdateUserRequest;
import com.realestate.backend.entity.User;
import com.realestate.backend.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMINISTRATOR')")
public class AdminController {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public AdminController(UserRepository userRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    // View all users
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    // Add new user
    @PostMapping("/users")
    public ResponseEntity<?> createUser(@RequestBody AdminCreateUserRequest request) {
        if (request.getEmail() == null || request.getEmail().isBlank()) {
            return ResponseEntity.badRequest().body("Email is required");
        }
        if (userRepository.existsByEmail(request.getEmail().trim())) {
            return ResponseEntity.badRequest().body("Email is already registered");
        }
        if (request.getPassword() == null || request.getPassword().length() < 6) {
            return ResponseEntity.badRequest().body("Password must be at least 6 characters");
        }

        String role = request.getRole() != null ? request.getRole().toUpperCase().trim() : "BUYER";
        if (!isValidRole(role)) {
            return ResponseEntity.badRequest().body("Invalid role. Allowed roles: BUYER, REAL_ESTATE_AGENT, LEGAL_REVIEWER, FINANCIAL_INSTITUTION, ADMINISTRATOR");
        }

        String name = request.getName() != null && !request.getName().isBlank()
                ? request.getName().trim()
                : request.getEmail().split("@")[0];

        User user = new User(
                name,
                request.getEmail().trim(),
                passwordEncoder.encode(request.getPassword()),
                role
        );

        User saved = userRepository.save(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    // Edit user
    @PutMapping("/users/{id}")
    public ResponseEntity<?> updateUser(
            @PathVariable Long id,
            @RequestBody AdminUpdateUserRequest request) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found: " + id));

        if (request.getEmail() != null && !request.getEmail().isBlank()) {
            String newEmail = request.getEmail().trim();
            if (!newEmail.equalsIgnoreCase(user.getEmail()) && userRepository.existsByEmail(newEmail)) {
                return ResponseEntity.badRequest().body("Email is already in use by another user");
            }
            user.setEmail(newEmail);
        }

        if (request.getName() != null && !request.getName().isBlank()) {
            user.setName(request.getName().trim());
        }

        if (request.getRole() != null && !request.getRole().isBlank()) {
            String normalizedRole = request.getRole().toUpperCase().trim();
            if (!isValidRole(normalizedRole)) {
                return ResponseEntity.badRequest().body("Invalid role. Allowed roles: BUYER, REAL_ESTATE_AGENT, LEGAL_REVIEWER, FINANCIAL_INSTITUTION, ADMINISTRATOR");
            }
            user.setRole(normalizedRole);
        }

        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            if (request.getPassword().length() < 6) {
                return ResponseEntity.badRequest().body("Password must be at least 6 characters");
            }
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        User updated = userRepository.save(user);
        return ResponseEntity.ok(updated);
    }

    // Change user role
    @PutMapping("/users/{id}/role")
    public ResponseEntity<User> updateUserRole(
            @PathVariable Long id,
            @RequestParam String role) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("User not found: " + id));

        String normalizedRole = role.toUpperCase();

        if (!isValidRole(normalizedRole)) {
            throw new IllegalArgumentException(
                    "Invalid role. Allowed roles: BUYER, REAL_ESTATE_AGENT, " +
                    "LEGAL_REVIEWER, FINANCIAL_INSTITUTION, ADMINISTRATOR"
            );
        }

        user.setRole(normalizedRole);

        return ResponseEntity.ok(
                userRepository.save(user)
        );
    }

    private boolean isValidRole(String role) {
        return role.equals("BUYER")
                || role.equals("REAL_ESTATE_AGENT")
                || role.equals("LEGAL_REVIEWER")
                || role.equals("FINANCIAL_INSTITUTION")
                || role.equals("ADMINISTRATOR");
    }

    // Delete user
    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found: " + id));
        try {
            userRepository.delete(user);
            return ResponseEntity.noContent().build();
        } catch (org.springframework.dao.DataIntegrityViolationException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Cannot delete user because they have associated records in the system.");
        }
    }
}