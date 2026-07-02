package com.formmanager.dto.response;

import com.formmanager.entity.enums.FormStatus;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FormResponse {
    private Long id;
    private String title;
    private String description;
    private FormStatus status;
    private boolean allowMultipleSubmission;
    private LocalDateTime startAt;
    private LocalDateTime endAt;
    private UserResponse createdBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<FormFieldResponse> fields;
    private long totalSubmissions;
}
