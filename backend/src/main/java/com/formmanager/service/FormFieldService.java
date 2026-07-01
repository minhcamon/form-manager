package com.formmanager.service;

import com.formmanager.dto.request.FormFieldCreateRequest;
import com.formmanager.dto.response.FormFieldResponse;
import com.formmanager.entity.Form;
import com.formmanager.entity.FormField;
import com.formmanager.exception.ResourceNotFoundException;
import com.formmanager.repository.FormRepository;
import com.formmanager.repository.FormFieldRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class FormFieldService {

    private final FormFieldRepository formFieldRepository;
    private final FormRepository formRepository;

    @Transactional
    public FormFieldResponse createField(Long formId, FormFieldCreateRequest request) {
        Form form = formRepository.findById(formId)
                .orElseThrow(() -> new ResourceNotFoundException("Form not found with id: " + formId));

        if (form.getStatus() == com.formmanager.entity.enums.FormStatus.PUBLISHED) {
            throw new IllegalStateException("Không thể thêm câu hỏi vào biểu mẫu đã công khai.");
        }

        if (formFieldRepository.existsByFormIdAndName(formId, request.getName())) {
            throw new IllegalArgumentException("Field with name '" + request.getName() + "' already exists in this form");
        }

        FormField field = FormField.builder()
                .form(form)
                .label(request.getLabel())
                .name(request.getName())
                .type(request.getType())
                .required(request.isRequired())
                .displayOrder(request.getDisplayOrder())
                .placeholder(request.getPlaceholder())
                .optionsJson(request.getOptionsJson())
                .validationJson(request.getValidationJson())
                .build();

        FormField savedField = formFieldRepository.save(field);
        return mapToResponse(savedField);
    }

    @Transactional
    public FormFieldResponse updateField(Long formId, Long fieldId, FormFieldCreateRequest request) {
        Form form = formRepository.findById(formId)
                .orElseThrow(() -> new ResourceNotFoundException("Form not found with id: " + formId));

        if (form.getStatus() == com.formmanager.entity.enums.FormStatus.PUBLISHED) {
            throw new IllegalStateException("Không thể chỉnh sửa câu hỏi của biểu mẫu đã công khai.");
        }

        FormField field = formFieldRepository.findById(fieldId)
                .orElseThrow(() -> new ResourceNotFoundException("Field not found with id: " + fieldId));

        if (!field.getForm().getId().equals(formId)) {
            throw new IllegalArgumentException("Field with id " + fieldId + " does not belong to form with id " + formId);
        }

        if (formFieldRepository.existsByFormIdAndNameAndIdNot(formId, request.getName(), fieldId)) {
            throw new IllegalArgumentException("Field with name '" + request.getName() + "' already exists in this form");
        }

        field.setLabel(request.getLabel());
        field.setName(request.getName());
        field.setType(request.getType());
        field.setRequired(request.isRequired());
        field.setDisplayOrder(request.getDisplayOrder());
        field.setPlaceholder(request.getPlaceholder());
        field.setOptionsJson(request.getOptionsJson());
        field.setValidationJson(request.getValidationJson());

        FormField updatedField = formFieldRepository.save(field);
        return mapToResponse(updatedField);
    }

    @Transactional
    public void deleteField(Long formId, Long fieldId) {
        Form form = formRepository.findById(formId)
                .orElseThrow(() -> new ResourceNotFoundException("Form not found with id: " + formId));

        if (form.getStatus() == com.formmanager.entity.enums.FormStatus.PUBLISHED) {
            throw new IllegalStateException("Không thể xóa câu hỏi khỏi biểu mẫu đã công khai.");
        }

        FormField field = formFieldRepository.findById(fieldId)
                .orElseThrow(() -> new ResourceNotFoundException("Field not found with id: " + fieldId));

        if (!field.getForm().getId().equals(formId)) {
            throw new IllegalArgumentException("Field with id " + fieldId + " does not belong to form with id " + formId);
        }

        formFieldRepository.delete(field);
    }

    private FormFieldResponse mapToResponse(FormField field) {
        return FormFieldResponse.builder()
                .id(field.getId())
                .label(field.getLabel())
                .name(field.getName())
                .type(field.getType())
                .required(field.isRequired())
                .displayOrder(field.getDisplayOrder())
                .placeholder(field.getPlaceholder())
                .optionsJson(field.getOptionsJson())
                .validationJson(field.getValidationJson())
                .build();
    }
}
