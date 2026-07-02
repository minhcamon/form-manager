package com.formmanager.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import lombok.*;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FormSubmissionRequest {

    @NotEmpty(message = "Submission values must not be empty")
    @Valid
    private List<SubmissionValueRequest> values;
}
