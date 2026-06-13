package com.sljobbank.service;

import com.sljobbank.entity.Qualification;
import com.sljobbank.repository.QualificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class QualificationService {

    private final QualificationRepository qualificationRepository;

    public List<Qualification> findAll() {
        return qualificationRepository.findAll();
    }

    public Qualification save(Qualification qualification) {
        return qualificationRepository.save(qualification);
    }
}