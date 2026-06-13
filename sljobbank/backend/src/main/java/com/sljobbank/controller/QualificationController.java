package com.sljobbank.controller;

import com.sljobbank.entity.Qualification;
import com.sljobbank.service.QualificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/qualifications")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // adjust as needed
public class QualificationController {

    private final QualificationService qualificationService;

    @GetMapping
    public ResponseEntity<?> getAllQualifications() {
        List<?> quals = qualificationService.findAll();
        return ResponseEntity.ok(Map.of("data", quals)); // match your frontend expectation
    }

    @PostMapping
    public ResponseEntity<?> createQualification(
            @RequestBody Qualification qualification) {

        Qualification saved =
                qualificationService.save(qualification);

        return ResponseEntity.ok(saved);
    }
}