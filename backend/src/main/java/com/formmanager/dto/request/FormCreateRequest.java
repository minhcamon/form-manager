package com.formmanager.dto.request;

import com.formmanager.entity.enums.FormStatus;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FormCreateRequest {

    @NotBlank(message = "Title is required")
    @Size(max = 200, message = "Title must not exceed 200 characters")
    private String title;

    private String description;

    private FormStatus status;

    private boolean allowMultipleSubmission;

    private LocalDateTime startAt;

    private LocalDateTime endAt;
}
