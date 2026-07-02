package com.formmanager.service;

import com.formmanager.dto.request.FormSubmissionRequest;
import com.formmanager.dto.request.SubmissionValueRequest;
import com.formmanager.dto.response.FormSubmissionResponse;
import com.formmanager.dto.response.SubmissionValueResponse;
import com.formmanager.entity.*;
import com.formmanager.entity.enums.FormStatus;
import com.formmanager.entity.enums.SubmissionStatus;
import com.formmanager.entity.enums.UserRole;
import com.formmanager.exception.ResourceNotFoundException;
import com.formmanager.repository.FormFieldRepository;
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
public class FormSubmissionService {

    private final FormSubmissionRepository formSubmissionRepository;
    private final FormRepository formRepository;
    private final FormFieldRepository formFieldRepository;

    // ── POST /api/forms/:id/submit ───────────────────────────────────
    @Transactional
    public FormSubmissionResponse submitForm(Long formId, FormSubmissionRequest request, User submittedBy) {
        Form form = formRepository.findById(formId)
                .orElseThrow(() -> new ResourceNotFoundException("Form not found with id: " + formId));

        if (form.getStatus() != FormStatus.PUBLISHED) {
            throw new IllegalStateException("Form is not available for submission (status: " + form.getStatus() + ")");
        }

        // Build submission entity
        FormSubmission submission = FormSubmission.builder()
                .form(form)
                .submittedBy(submittedBy)
                .status(SubmissionStatus.SUBMITTED)
                .build();

        // Build and link submission values
        List<SubmissionValue> values = new ArrayList<>();
        for (SubmissionValueRequest valReq : request.getValues()) {
            FormField field = formFieldRepository.findById(valReq.getFieldId())
                    .orElseThrow(() -> new ResourceNotFoundException("Field not found with id: " + valReq.getFieldId()));

            // Ensure the field belongs to this form
            if (!field.getForm().getId().equals(formId)) {
                throw new IllegalArgumentException("Field " + valReq.getFieldId() + " does not belong to form " + formId);
            }

            values.add(SubmissionValue.builder()
                    .submission(submission)
                    .field(field)
                    .value(valReq.getValue())
                    .build());
        }

        submission.setValues(values);
        FormSubmission saved = formSubmissionRepository.save(submission);

        return mapToResponse(saved);
    }

    // ── GET /api/submissions ─────────────────────────────────────────
    @Transactional(readOnly = true)
    public List<FormSubmissionResponse> getSubmissions(User requestingUser) {
        List<FormSubmission> submissions;

        if (requestingUser.getRole() == UserRole.ADMIN) {
            // Admin sees all submissions
            submissions = formSubmissionRepository.findAll();
        } else {
            // User sees only their own submissions
            submissions = formSubmissionRepository.findBySubmittedBy(requestingUser);
        }

        return submissions.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // ── GET /api/submissions/form/:formId ────────────────────────────
    @Transactional(readOnly = true)
    public List<FormSubmissionResponse> getSubmissionsByFormId(Long formId, User requestingUser) {
        List<FormSubmission> submissions;

        if (requestingUser.getRole() == UserRole.ADMIN) {
            submissions = formSubmissionRepository.findByFormId(formId);
        } else {
            submissions = formSubmissionRepository.findByFormIdAndSubmittedBy(formId, requestingUser);
        }

        return submissions.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // ── Mapper ───────────────────────────────────────────────────────
    private FormSubmissionResponse mapToResponse(FormSubmission submission) {
        String email = submission.getSubmittedBy() != null ? submission.getSubmittedBy().getEmail() : "Anonymous";
        String fullname = submission.getSubmittedBy() != null ? submission.getSubmittedBy().getFullname() : "";

        List<SubmissionValueResponse> valuesResponse = submission.getValues().stream()
                .map(val -> SubmissionValueResponse.builder()
                        .id(val.getId())
                        .fieldId(val.getField().getId())
                        .fieldName(val.getField().getName())
                        .fieldLabel(val.getField().getLabel())
                        .value(val.getValue())
                        .build())
                .collect(Collectors.toList());

        return FormSubmissionResponse.builder()
                .id(submission.getId())
                .formId(submission.getForm().getId())
                .formTitle(submission.getForm().getTitle())
                .submittedByEmail(email)
                .submittedByFullname(fullname)
                .submittedAt(submission.getSubmittedAt())
                .status(submission.getStatus())
                .values(valuesResponse)
                .build();
    }
}
