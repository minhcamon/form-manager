package com.formmanager.service;

import com.formmanager.dto.request.LoginRequest;
import com.formmanager.dto.response.AuthResponse;
import com.formmanager.entity.User;
import com.formmanager.entity.enums.UserRole;
import com.formmanager.repository.UserRepository;
import com.formmanager.security.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtTokenProvider jwtTokenProvider;

    @InjectMocks
    private AuthService authService;

    private User user;
    private LoginRequest loginRequest;

    @BeforeEach
    void setUp() {
        user = User.builder()
                .id(1L)
                .email("test@example.com")
                .password("encodedPassword")
                .fullname("Test User")
                .role(UserRole.USER)
                .build();

        loginRequest = LoginRequest.builder()
                .username("test@example.com")
                .password("rawPassword")
                .build();
    }

    @Test
    void login_Success() {
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("rawPassword", "encodedPassword")).thenReturn(true);
        when(jwtTokenProvider.generateToken(any(Authentication.class))).thenReturn("dummyToken");

        AuthResponse response = authService.login(loginRequest);

        assertNotNull(response);
        assertEquals("dummyToken", response.getToken());
        assertEquals(1L, response.getUserId());
        assertEquals("test@example.com", response.getUserEmail());
        assertEquals("Test User", response.getUserName());
        assertEquals(UserRole.USER, response.getUserRole());

        verify(userRepository).findByEmail("test@example.com");
        verify(passwordEncoder).matches("rawPassword", "encodedPassword");
        verify(jwtTokenProvider).generateToken(any(Authentication.class));
    }

    @Test
    void login_UserNotFound() {
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.empty());

        assertThrows(BadCredentialsException.class, () -> authService.login(loginRequest));

        verify(userRepository).findByEmail("test@example.com");
        verifyNoInteractions(passwordEncoder, jwtTokenProvider);
    }

    @Test
    void login_EmptyPassword() {
        user.setPassword("");
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));

        assertThrows(BadCredentialsException.class, () -> authService.login(loginRequest));

        verify(userRepository).findByEmail("test@example.com");
        verifyNoInteractions(passwordEncoder, jwtTokenProvider);
    }

    @Test
    void login_InvalidPassword() {
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("rawPassword", "encodedPassword")).thenReturn(false);

        assertThrows(BadCredentialsException.class, () -> authService.login(loginRequest));

        verify(userRepository).findByEmail("test@example.com");
        verify(passwordEncoder).matches("rawPassword", "encodedPassword");
        verifyNoInteractions(jwtTokenProvider);
    }
}
