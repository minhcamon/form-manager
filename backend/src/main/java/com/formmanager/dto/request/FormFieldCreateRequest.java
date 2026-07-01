package com.formmanager.dto.request;

import com.formmanager.entity.enums.FieldType;
import jakarta.validation.constraints.*;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FormFieldCreateRequest {

    @NotBlank(message = "Label is required")
    @Size(max = 200, message = "Label must not exceed 200 characters")
    private String label;

    @NotBlank(message = "Name is required")
    @Size(max = 100, message = "Name must not exceed 100 characters")
    @Pattern(regexp = "^[a-zA-Z0-9_]+$", message = "Name can only contain alphanumeric characters and underscores")
    private String name;

    @NotNull(message = "Type is required")
    private FieldType type;

    private boolean required;

    @NotNull(message = "Display order is required")
    private Integer displayOrder;

    private String placeholder;

    private String optionsJson;

    private String validationJson;
}
