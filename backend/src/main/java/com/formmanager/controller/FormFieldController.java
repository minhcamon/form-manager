package com.formmanager.controller;

import com.formmanager.dto.APIResponse;
import com.formmanager.dto.request.FormFieldCreateRequest;
import com.formmanager.dto.response.FormFieldResponse;
import com.formmanager.service.FormFieldService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/forms/{formId}/fields")
@RequiredArgsConstructor
public class FormFieldController {

    private final FormFieldService formFieldService;

    @Operation(summary = "Thêm trường dữ liệu vào form")
    @PostMapping({ "" })
    public ResponseEntity<APIResponse<FormFieldResponse>> createField(
            @PathVariable Long formId,
            @Valid @RequestBody FormFieldCreateRequest request) {
        FormFieldResponse field = formFieldService.createField(formId, request);
        return ResponseEntity.ok(APIResponse.success("Successfully created form field", field));
    }

    @Operation(summary = "Cập nhật trường dữ liệu trong form")
    @PutMapping("/{fid}")
    public ResponseEntity<APIResponse<FormFieldResponse>> updateField(
            @PathVariable Long formId,
            @PathVariable Long fid,
            @Valid @RequestBody FormFieldCreateRequest request) {
        FormFieldResponse field = formFieldService.updateField(formId, fid, request);
        return ResponseEntity.ok(APIResponse.success("Successfully updated form field", field));
    }

    @Operation(summary = "Xóa trường dữ liệu khỏi form")
    @DeleteMapping("/{fid}")
    public ResponseEntity<APIResponse<Void>> deleteField(
            @PathVariable Long formId,
            @PathVariable Long fid) {
        formFieldService.deleteField(formId, fid);
        return ResponseEntity.ok(APIResponse.success("Successfully deleted form field", null));
    }
}
