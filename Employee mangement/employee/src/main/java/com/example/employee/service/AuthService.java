package com.example.employee.service;

import com.example.employee.dto.*;
import com.example.employee.model.Employee;
import com.example.employee.model.Role;
import com.example.employee.model.User;
import com.example.employee.repository.EmployeeRepository;
import com.example.employee.repository.UserRepository;
import com.example.employee.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final EmployeeRepository employeeRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already registered");
        }

        // 1. Determine role
        Role userRole;
        try {
            userRole = Role.valueOf("ROLE_" + request.getRole().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid role specified. Supported: ADMIN, HR, EMPLOYEE");
        }

        // 2. Create Employee profile if it doesn't exist
        Employee employee = employeeRepository.save(
                Employee.builder()
                        .firstName(request.getFirstName())
                        .lastName(request.getLastName())
                        .email(request.getEmail())
                        .department(request.getDepartment() != null ? request.getDepartment() : "General")
                        .position(request.getPosition() != null ? request.getPosition() : "Staff")
                        .startDate(LocalDateTime.now().toLocalDate().toString())
                        .status("Active")
                        .build()
        );

        // 3. Create User account
        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(userRole)
                .employee(employee)
                .build();

        user = userRepository.save(user);
        log.info("Registered new user and employee: {}", user.getEmail());

        // 4. Generate tokens
        String accessToken = tokenProvider.generateAccessToken(user.getEmail(), user.getRole().name());
        String refreshToken = tokenProvider.generateRefreshToken(user.getEmail());

        user.setRefreshToken(refreshToken);
        user.setRefreshTokenExpiryTime(LocalDateTime.now().plusDays(7));
        userRepository.save(user);

        return buildAuthResponse(user, accessToken, refreshToken);
    }

    @Transactional
    public AuthResponse login(AuthRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        User user = (User) authentication.getPrincipal();

        String accessToken = tokenProvider.generateAccessToken(user.getEmail(), user.getRole().name());
        String refreshToken = tokenProvider.generateRefreshToken(user.getEmail());

        user.setRefreshToken(refreshToken);
        user.setRefreshTokenExpiryTime(LocalDateTime.now().plusDays(7));
        userRepository.save(user);

        log.info("User logged in successfully: {}", user.getEmail());
        return buildAuthResponse(user, accessToken, refreshToken);
    }

    @Transactional
    public AuthResponse refresh(RefreshTokenRequest request) {
        String token = request.getRefreshToken();
        User user = userRepository.findByRefreshToken(token)
                .orElseThrow(() -> new IllegalArgumentException("Invalid refresh token"));

        if (user.getRefreshTokenExpiryTime().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Refresh token expired. Please login again.");
        }

        String accessToken = tokenProvider.generateAccessToken(user.getEmail(), user.getRole().name());
        String newRefreshToken = tokenProvider.generateRefreshToken(user.getEmail());

        user.setRefreshToken(newRefreshToken);
        user.setRefreshTokenExpiryTime(LocalDateTime.now().plusDays(7));
        userRepository.save(user);

        log.info("Refreshed JWT access token for: {}", user.getEmail());
        return buildAuthResponse(user, accessToken, newRefreshToken);
    }

    @Transactional
    public void logout(String refreshToken) {
        User user = userRepository.findByRefreshToken(refreshToken)
                .orElseThrow(() -> new IllegalArgumentException("Invalid refresh token"));
        user.setRefreshToken(null);
        user.setRefreshTokenExpiryTime(null);
        userRepository.save(user);
        log.info("Logged out user: {}", user.getEmail());
    }

    private AuthResponse buildAuthResponse(User user, String accessToken, String refreshToken) {
        Employee emp = user.getEmployee();
        UserDTO userDTO = UserDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .role(user.getRole().name())
                .employeeId(emp != null ? emp.getId() : null)
                .firstName(emp != null ? emp.getFirstName() : "Admin")
                .lastName(emp != null ? emp.getLastName() : "User")
                .build();

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .user(userDTO)
                .build();
    }
}
