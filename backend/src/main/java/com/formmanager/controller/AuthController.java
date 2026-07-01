package com.formmanager.controller;

import com.formmanager.dto.APIResponse;
import com.formmanager.dto.request.LoginRequest;
import com.formmanager.dto.response.AuthResponse;
import com.formmanager.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @Operation(summary = "Đăng nhập tài khoản", description = "Đăng nhập tài khoản vào hệ thống.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Đăng nhập thành công."),
            @ApiResponse(responseCode = "400", description = "Thông tin đăng nhập không hợp lệ, email và password không trùng khớp.")
    })
    @PostMapping(path = "/login")
    public ResponseEntity<APIResponse<AuthResponse>> login(
            @Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(
                APIResponse.success("Successfully Login", response));
    }
}
