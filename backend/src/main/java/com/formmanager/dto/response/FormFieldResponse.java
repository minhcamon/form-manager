package com.formmanager.dto.response;

import com.formmanager.entity.enums.FieldType;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FormFieldResponse {
    private Long id;
    private String label;
    private String name;
    private FieldType type;
    private boolean required;
    private Integer displayOrder;
    private String placeholder;
    private String optionsJson;
    private String validationJson;
}
