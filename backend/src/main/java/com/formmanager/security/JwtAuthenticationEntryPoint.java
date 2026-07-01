package com.formmanager.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.formmanager.dto.APIResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {

    @Override
    public void commence(HttpServletRequest request,
                         HttpServletResponse response,
                         AuthenticationException authException) throws IOException {
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);

        APIResponse<?> apiResponse = APIResponse.error(
                HttpServletResponse.SC_UNAUTHORIZED,
                "Unauthorized: " + authException.getMessage(),
                null
        );

        ObjectMapper mapper = new ObjectMapper();
        mapper.writeValue(response.getOutputStream(), apiResponse);
    }
}
