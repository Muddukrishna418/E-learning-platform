package com.elearning.config;

import com.elearning.entity.Role;
import com.elearning.entity.User;
import com.elearning.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (!userRepository.existsByEmail("test@example.com")) {
            User user = User.builder()
                    .fullName("Test User")
                    .email("test@example.com")
                    .password(passwordEncoder.encode("password123"))
                    .role(Role.STUDENT)
                    .build();
            userRepository.save(user);
        }
    }
}
