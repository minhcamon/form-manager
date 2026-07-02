package com.formmanager.dto.response;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubmissionValueResponse {
    private Long id;
    private Long fieldId;
    private String fieldLabel;
    private String fieldName;
    private String value;
}
