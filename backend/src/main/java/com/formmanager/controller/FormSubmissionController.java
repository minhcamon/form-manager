package com.formmanager.controller;

import com.formmanager.dto.APIResponse;
import com.formmanager.dto.response.FormSubmissionResponse;
import com.formmanager.security.CustomUserDetails;
import com.formmanager.service.FormSubmissionService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/submissions")
@RequiredArgsConstructor
public class FormSubmissionController {

    private final FormSubmissionService formSubmissionService;

    @Operation(summary = "Lấy lịch sử/danh sách câu trả lời đã nộp")
    @GetMapping({ "" })
    public ResponseEntity<APIResponse<List<FormSubmissionResponse>>> getSubmissions(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        List<FormSubmissionResponse> submissions = formSubmissionService.getSubmissions(userDetails.getUser());
        return ResponseEntity.ok(APIResponse.success("Successfully retrieved submissions", submissions));
    }

    @Operation(summary = "Lấy danh sách câu trả lời của 1 form cụ thể")
    @GetMapping("/form/{formId}")
    public ResponseEntity<APIResponse<List<FormSubmissionResponse>>> getSubmissionsByFormId(
            @PathVariable Long formId,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        List<FormSubmissionResponse> submissions = formSubmissionService.getSubmissionsByFormId(formId, userDetails.getUser());
        return ResponseEntity.ok(APIResponse.success("Successfully retrieved submissions for form", submissions));
    }
}
