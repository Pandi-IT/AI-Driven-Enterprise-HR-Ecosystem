package com.example.employee.service;

import com.example.employee.dto.*;
import com.example.employee.model.Employee;
import com.example.employee.model.Role;
import com.example.employee.model.User;
import com.example.employee.repository.EmployeeRepository;
import com.example.employee.repository.UserRepository;
import com.example.employee.security.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AuthServiceTests {

    @Mock
    private UserRepository userRepository;

    @Mock
    private EmployeeRepository employeeRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtTokenProvider tokenProvider;

    @Mock
    private AuthenticationManager authenticationManager;

    @InjectMocks
    private AuthService authService;

    private User user;
    private Employee employee;

    @BeforeEach
    void setUp() {
        employee = Employee.builder()
                .id(1L)
                .firstName("Jane")
                .lastName("Smith")
                .email("jane.s@co.com")
                .department("Marketing")
                .position("Lead")
                .build();

        user = User.builder()
                .id(1L)
                .email("jane.s@co.com")
                .password("hashed_password")
                .role(Role.ROLE_EMPLOYEE)
                .employee(employee)
                .refreshToken("some_refresh_token")
                .refreshTokenExpiryTime(LocalDateTime.now().plusDays(1))
                .build();
    }

    @Test
    void testRegister_Success() {
        RegisterRequest request = RegisterRequest.builder()
                .email("new@co.com")
                .password("password123")
                .role("EMPLOYEE")
                .firstName("New")
                .lastName("User")
                .department("Engineering")
                .position("Junior Dev")
                .build();

        when(userRepository.existsByEmail(request.getEmail())).thenReturn(false);
        when(employeeRepository.save(any(Employee.class))).thenReturn(employee);
        when(passwordEncoder.encode(request.getPassword())).thenReturn("encoded_pass");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(tokenProvider.generateAccessToken(anyString(), anyString())).thenReturn("access_token");
        when(tokenProvider.generateRefreshToken(anyString())).thenReturn("refresh_token");

        AuthResponse response = authService.register(request);

        assertNotNull(response);
        assertEquals("access_token", response.getAccessToken());
        assertEquals("refresh_token", response.getRefreshToken());
        assertEquals("new@co.com", response.getUser().getEmail());

        verify(userRepository, times(1)).existsByEmail(request.getEmail());
        verify(employeeRepository, times(1)).save(any(Employee.class));
        verify(userRepository, times(2)).save(any(User.class));
    }

    @Test
    void testRegister_EmailAlreadyExists() {
        RegisterRequest request = RegisterRequest.builder()
                .email("jane.s@co.com")
                .password("password123")
                .role("EMPLOYEE")
                .firstName("Jane")
                .lastName("Smith")
                .build();

        when(userRepository.existsByEmail(request.getEmail())).thenReturn(true);

        assertThrows(IllegalArgumentException.class, () -> authService.register(request));

        verify(userRepository, times(1)).existsByEmail(request.getEmail());
        verifyNoInteractions(employeeRepository, passwordEncoder, tokenProvider);
    }

    @Test
    void testLogin_Success() {
        AuthRequest request = AuthRequest.builder()
                .email("jane.s@co.com")
                .password("password123")
                .build();

        Authentication authentication = mock(Authentication.class);
        when(authentication.getPrincipal()).thenReturn(user);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(authentication);
        when(tokenProvider.generateAccessToken(user.getEmail(), user.getRole().name())).thenReturn("access_token");
        when(tokenProvider.generateRefreshToken(user.getEmail())).thenReturn("refresh_token");
        when(userRepository.save(any(User.class))).thenReturn(user);

        AuthResponse response = authService.login(request);

        assertNotNull(response);
        assertEquals("access_token", response.getAccessToken());
        assertEquals("refresh_token", response.getRefreshToken());

        verify(authenticationManager, times(1)).authenticate(any(UsernamePasswordAuthenticationToken.class));
        verify(userRepository, times(1)).save(user);
    }

    @Test
    void testRefresh_Success() {
        RefreshTokenRequest request = RefreshTokenRequest.builder()
                .refreshToken("some_refresh_token")
                .build();

        when(userRepository.findByRefreshToken(request.getRefreshToken())).thenReturn(Optional.of(user));
        when(tokenProvider.generateAccessToken(user.getEmail(), user.getRole().name())).thenReturn("new_access_token");
        when(tokenProvider.generateRefreshToken(user.getEmail())).thenReturn("new_refresh_token");
        when(userRepository.save(any(User.class))).thenReturn(user);

        AuthResponse response = authService.refresh(request);

        assertNotNull(response);
        assertEquals("new_access_token", response.getAccessToken());
        assertEquals("new_refresh_token", response.getRefreshToken());

        verify(userRepository, times(1)).findByRefreshToken(request.getRefreshToken());
        verify(userRepository, times(1)).save(user);
    }

    @Test
    void testRefresh_ExpiredToken() {
        user.setRefreshTokenExpiryTime(LocalDateTime.now().minusMinutes(5));
        RefreshTokenRequest request = RefreshTokenRequest.builder()
                .refreshToken("some_refresh_token")
                .build();

        when(userRepository.findByRefreshToken(request.getRefreshToken())).thenReturn(Optional.of(user));

        assertThrows(IllegalArgumentException.class, () -> authService.refresh(request));

        verify(userRepository, times(1)).findByRefreshToken(request.getRefreshToken());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void testLogout_Success() {
        String token = "some_refresh_token";

        when(userRepository.findByRefreshToken(token)).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenReturn(user);

        authService.logout(token);

        assertNull(user.getRefreshToken());
        assertNull(user.getRefreshTokenExpiryTime());

        verify(userRepository, times(1)).findByRefreshToken(token);
        verify(userRepository, times(1)).save(user);
    }
}
