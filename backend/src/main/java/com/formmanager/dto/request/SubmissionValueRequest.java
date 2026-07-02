package com.formmanager.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubmissionValueRequest {

    @NotNull(message = "Field ID is required")
    private Long fieldId;

    private String value;
}
