package com.sljobbank.service;

import com.sljobbank.dto.response.InstituteResponse;
import com.sljobbank.entity.Institute;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface InstituteService {

    Page<InstituteResponse> getAll(String q, String type, Pageable pageable);

    InstituteResponse getById(String id);

    String create(Institute institute);

    String update(String id, Institute institute);

    void delete(String id);
}