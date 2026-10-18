package com.realestate.backend.controller;

import com.realestate.backend.entity.User;
import com.realestate.backend.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMINISTRATOR')")
public class AdminController {

    private final UserRepository userRepository;

    public AdminController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // View all users
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
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
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found: " + id));
        try {
            userRepository.delete(user);
        } catch (org.springframework.dao.DataIntegrityViolationException e) {
            // Conflict due to foreign key constraints
            return ResponseEntity.status(409).build();
        }
        return ResponseEntity.noContent().build();
    }
}