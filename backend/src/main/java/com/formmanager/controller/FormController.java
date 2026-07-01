package com.formmanager.controller;

import com.formmanager.dto.APIResponse;
import com.formmanager.dto.request.FormCreateRequest;
import com.formmanager.dto.request.FormUpdateRequest;
import com.formmanager.dto.response.FormResponse;
import com.formmanager.security.CustomUserDetails;
import com.formmanager.service.FormService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/forms")
public class FormController {

    private final FormService formService;

    @Operation(summary = "Lấy danh sách tất cả các form")
    @GetMapping({"", "/"})
    public ResponseEntity<APIResponse<List<FormResponse>>> getAllForms() {
        List<FormResponse> forms = formService.getAllForms();
        return ResponseEntity.ok(APIResponse.success("Successfully retrieved all forms", forms));
    }

    @Operation(summary = "Tạo form mới")
    @PostMapping({"", "/"})
    public ResponseEntity<APIResponse<FormResponse>> createForm(
            @Valid @RequestBody FormCreateRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        FormResponse form = formService.createForm(request, userDetails.getUser());
        return ResponseEntity.ok(APIResponse.success("Successfully created form", form));
    }

    @Operation(summary = "Lấy thông tin form chi tiết")
    @GetMapping({"/{id}"})
    public ResponseEntity<APIResponse<FormResponse>> getFormById(@PathVariable Long id) {
        FormResponse form = formService.getFormById(id);
        return ResponseEntity.ok(APIResponse.success("Successfully retrieved form details", form));
    }

    @Operation(summary = "Cập nhật thông tin form")
    @PutMapping("/{id}")
    public ResponseEntity<APIResponse<FormResponse>> updateForm(
            @PathVariable Long id,
            @Valid @RequestBody FormUpdateRequest request) {
        FormResponse form = formService.updateForm(id, request);
        return ResponseEntity.ok(APIResponse.success("Successfully updated form", form));
    }

    @Operation(summary = "Xóa form")
    @DeleteMapping("/{id}")
    public ResponseEntity<APIResponse<Void>> deleteForm(@PathVariable Long id) {
        formService.deleteForm(id);
        return ResponseEntity.ok(APIResponse.success("Successfully deleted form", null));
    }
}
