package com.formmanager.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/forms/{formId}/fields")
@RequiredArgsConstructor
public class FormFieldController {
}
