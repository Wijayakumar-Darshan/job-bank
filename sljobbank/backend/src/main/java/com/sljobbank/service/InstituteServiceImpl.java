package com.sljobbank.service;

import com.sljobbank.dto.response.InstituteResponse;
import com.sljobbank.entity.Institute;
import com.sljobbank.repository.InstituteRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class InstituteServiceImpl implements InstituteService {

    private final InstituteRepository instituteRepository;

    @Override
    @Transactional(readOnly = true)
    public Page<InstituteResponse> getAll(String q, String type, Pageable pageable) {

        Specification<Institute> spec = Specification.where(null);

        if (q != null && !q.trim().isEmpty()) {
            String search = "%" + q.trim().toLowerCase() + "%";
            spec = spec.and((root, cq, cb) ->
                    cb.or(
                            cb.like(cb.lower(root.get("name")), search),
                            cb.like(cb.lower(root.get("location")), search)
                    )
            );
        }

        if (type != null && !type.trim().isEmpty()) {
            spec = spec.and((root, cq, cb) ->
                    cb.equal(root.get("type"), type.trim())
            );
        }

        return instituteRepository.findAll(spec, pageable)
                .map(this::convertToResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public InstituteResponse getById(String id) {
        Institute institute = instituteRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Institute not found with id: " + id));

        return convertToResponse(institute);
    }

    @Override
    public String create(Institute institute) {
        return instituteRepository.save(institute).getId();
    }

    @Override
    public String update(String id, Institute updated) {

        Institute existing = instituteRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Institute not found with id: " + id));

        existing.setName(updated.getName());
        existing.setLogo(updated.getLogo());
        existing.setLocation(updated.getLocation());
        existing.setContact(updated.getContact());
        existing.setWebsite(updated.getWebsite());
        existing.setAccreditation(updated.getAccreditation());
        existing.setType(updated.getType());

        return instituteRepository.save(existing).getId();
    }

    @Override
    public void delete(String id) {
        if (!instituteRepository.existsById(id)) {
            throw new EntityNotFoundException("Institute not found with id: " + id);
        }
        instituteRepository.deleteById(id);
    }

    private InstituteResponse convertToResponse(Institute institute) {
        return InstituteResponse.builder()
                .id(institute.getId())
                .name(institute.getName())
                .logo(institute.getLogo())
                .location(institute.getLocation())
                .contact(institute.getContact())
                .website(institute.getWebsite())
                .accreditation(institute.getAccreditation())
                .type(institute.getType())
                .build();
    }
}