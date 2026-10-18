
package com.realestate.backend.controller;

import com.realestate.backend.dto.UserProfileResponse;
import com.realestate.backend.entity.User;
import com.realestate.backend.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

        private final UserRepository userRepository;

        public UserController(UserRepository userRepository) {
                this.userRepository = userRepository;
        }

        // Get the currently logged-in user's profile
        @GetMapping("/profile")
        public ResponseEntity<UserProfileResponse> getProfile(
                        Authentication authentication) {

                String email = authentication.getName();

                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                UserProfileResponse profile = new UserProfileResponse(
                                user.getId(),
                                user.getName(),
                                user.getEmail(),
                                user.getRole());

                return ResponseEntity.ok(profile);
        }

        // Get all registered users
        @GetMapping
        public ResponseEntity<List<User>> getAllUsers() {
                return ResponseEntity.ok(userRepository.findAll());
        }
}
