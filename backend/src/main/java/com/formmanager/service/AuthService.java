package com.formmanager.service;

import com.formmanager.dto.request.LoginRequest;
import com.formmanager.dto.response.AuthResponse;
import com.formmanager.entity.User;
import com.formmanager.repository.UserRepository;
import com.formmanager.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import com.formmanager.security.CustomUserDetails;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthResponse login(LoginRequest loginRequest) {
        User user = userRepository.findByEmail(loginRequest.getUsername())
                .orElseThrow(() -> new BadCredentialsException("Invalid username or password."));

        if (user.getPassword() == null || user.getPassword().isBlank()) {
            throw new BadCredentialsException("Invalid username or password.");
        }

        if (!passwordEncoder.matches(
                loginRequest.getPassword(),
                user.getPassword())) {
            throw new BadCredentialsException("Invalid username or password.");
        }

        CustomUserDetails userDetails = new CustomUserDetails(user);
        Authentication authentication = new UsernamePasswordAuthenticationToken(
                userDetails, null, userDetails.getAuthorities());
        String token = jwtTokenProvider.generateToken(authentication);

        return AuthResponse.builder()
                .userId(user.getId())
                .userName(user.getFullname())
                .userEmail(user.getEmail())
                .userRole(user.getRole())
                .token(token)
                .build();
    }

}
