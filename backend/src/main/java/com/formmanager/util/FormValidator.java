package com.formmanager.util;

import com.formmanager.entity.FormField;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.List;

public class FormValidator {
    private static final ObjectMapper objectMapper = new ObjectMapper();

    public static void validateFieldValue(FormField field, String value) {
        // 1. Validate required fields
        if (field.isRequired()) {
            if (value == null || value.trim().isEmpty() || "[]".equals(value.trim())) {
                throw new IllegalArgumentException("Trường '" + field.getLabel() + "' là bắt buộc và không được để trống.");
            }
        }

        // 2. Validate value format if not empty
        if (value != null && !value.trim().isEmpty() && !"[]".equals(value.trim())) {
            String valStr = value.trim();
            switch (field.getType()) {
                case NUMBER:
                    try {
                        Double.parseDouble(valStr);
                    } catch (NumberFormatException e) {
                        throw new IllegalArgumentException("Trường '" + field.getLabel() + "' phải là một số hợp lệ.");
                    }
                    break;
                case DATE:
                    if (!valStr.matches("^\\d{4}-\\d{2}-\\d{2}$")) {
                        throw new IllegalArgumentException("Trường '" + field.getLabel() + "' phải là ngày hợp lệ (định dạng YYYY-MM-DD).");
                    }
                    break;
                case COLOR:
                    if (!valStr.matches("^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$")) {
                        throw new IllegalArgumentException("Trường '" + field.getLabel() + "' phải là mã màu hex hợp lệ (ví dụ: #FF0000).");
                    }
                    break;
                case SELECT:
                    if (field.getOptionsJson() != null && !field.getOptionsJson().trim().isEmpty()) {
                        try {
                            List<?> options = objectMapper.readValue(field.getOptionsJson(), List.class);
                            boolean matches = options.stream().anyMatch(opt -> String.valueOf(opt).equals(valStr));
                            if (!matches) {
                                throw new IllegalArgumentException("Trường '" + field.getLabel() + "' chứa giá trị lựa chọn không hợp lệ.");
                            }
                        } catch (IllegalArgumentException e) {
                            throw e;
                        } catch (Exception e) {
                            // Skip options check if optionsJson parsing fails due to bad configuration
                        }
                    }
                    break;
                case TEXT:
                default:
                    break;
            }
        }
    }
}
