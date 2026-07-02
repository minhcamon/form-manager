package com.formmanager.service;

import com.formmanager.dto.request.FormCreateRequest;
import com.formmanager.dto.request.FormUpdateRequest;
import com.formmanager.dto.response.*;
import com.formmanager.entity.*;
import com.formmanager.entity.enums.FormStatus;
import com.formmanager.exception.ResourceNotFoundException;
import com.formmanager.repository.FormRepository;
import com.formmanager.repository.FormSubmissionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FormService {

    private final FormRepository formRepository;
    private final FormSubmissionRepository formSubmissionRepository;

    @Transactional(readOnly = true)
    public List<FormResponse> getAllForms() {
        return formRepository.findAllByStatusNot(FormStatus.ARCHIVED).stream()
                .map(this::mapToFormResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<FormResponse> getActiveForms() {
        return formRepository.findByStatus(FormStatus.PUBLISHED).stream()
                .map(this::mapToFormResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public FormResponse getFormById(Long id) {
        Form form = formRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Form not found with id: " + id));
        return mapToFormResponse(form);
    }

    @Transactional
    public FormResponse createForm(FormCreateRequest request, User creator) {
        FormStatus status = request.getStatus() != null ? request.getStatus() : FormStatus.DRAFT;

        Form form = Form.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .status(status)
                .allowMultipleSubmission(request.isAllowMultipleSubmission())
                .startAt(request.getStartAt())
                .endAt(request.getEndAt())
                .createdBy(creator)
                .build();

        Form savedForm = formRepository.save(form);
        return mapToFormResponse(savedForm);
    }

    @Transactional
    public FormResponse updateForm(Long id, FormUpdateRequest request) {
        Form form = formRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Form not found with id: " + id));

        form.setTitle(request.getTitle());
        form.setDescription(request.getDescription());
        form.setStatus(request.getStatus());
        form.setAllowMultipleSubmission(request.isAllowMultipleSubmission());
        form.setStartAt(request.getStartAt());
        form.setEndAt(request.getEndAt());

        Form updatedForm = formRepository.save(form);
        return mapToFormResponse(updatedForm);
    }

    @Transactional
    public void deleteForm(Long id) {
        Form form = formRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Form not found with id: " + id));
        form.setStatus(FormStatus.ARCHIVED);
        formRepository.save(form);
    }

    private FormResponse mapToFormResponse(Form form) {
        UserResponse createdByResponse = null;
        if (form.getCreatedBy() != null) {
            createdByResponse = UserResponse.builder()
                    .id(form.getCreatedBy().getId())
                    .email(form.getCreatedBy().getEmail())
                    .fullname(form.getCreatedBy().getFullname())
                    .role(form.getCreatedBy().getRole())
                    .build();
        }

        List<FormFieldResponse> fieldsResponse = new ArrayList<>();
        if (form.getFields() != null) {
            fieldsResponse = form.getFields().stream()
                    .map(field -> FormFieldResponse.builder()
                            .id(field.getId())
                            .label(field.getLabel())
                            .name(field.getName())
                            .type(field.getType())
                            .required(field.isRequired())
                            .displayOrder(field.getDisplayOrder())
                            .placeholder(field.getPlaceholder())
                            .optionsJson(field.getOptionsJson())
                            .validationJson(field.getValidationJson())
                            .build())
                    .collect(Collectors.toList());
        }

        long totalSubmissions = formSubmissionRepository.countByFormId(form.getId());

        return FormResponse.builder()
                .id(form.getId())
                .title(form.getTitle())
                .description(form.getDescription())
                .status(form.getStatus())
                .allowMultipleSubmission(form.isAllowMultipleSubmission())
                .startAt(form.getStartAt())
                .endAt(form.getEndAt())
                .createdBy(createdByResponse)
                .createdAt(form.getCreatedAt())
                .updatedAt(form.getUpdatedAt())
                .fields(fieldsResponse)
                .totalSubmissions(totalSubmissions)
                .build();
    }
}
