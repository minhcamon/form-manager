package com.formmanager.dto.response;

import com.formmanager.entity.enums.SubmissionStatus;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FormSubmissionResponse {
    private Long id;
    private Long formId;
    private String formTitle;
    private String submittedByEmail;
    private String submittedByFullname;
    private LocalDateTime submittedAt;
    private SubmissionStatus status;
    private List<SubmissionValueResponse> values;
}
