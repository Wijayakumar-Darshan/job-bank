package com.sljobbank.service;

import com.sljobbank.dto.response.JobResponse;
import com.sljobbank.entity.*;
import com.sljobbank.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JobService {

    private final JobRepository jobRepo;
    private final StudentViewRepository viewRepo;
    private final CareerClusterRepository careerClusterRepository;
    private final QualificationRepository qualificationRepository;

    // GET ALL JOBS
    public Page<JobResponse> getAll(String q, String clusterId, Pageable pageable) {

        Page<Job> page;

        if (q != null && !q.isBlank()) {
            page = jobRepo.findByTitleContainingIgnoreCase(q, pageable);
        } else if (clusterId != null && !clusterId.isBlank()) {
            page = jobRepo.findByCluster_Id(clusterId, pageable);
        } else {
            page = jobRepo.findAll(pageable);
        }

        return page.map(this::toResponse);
    }

    // GET BY ID
    public JobResponse getById(String id) {
        return jobRepo.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new RuntimeException("Job not found"));
    }

    // CREATE JOB
    @Transactional
    public String create(Job job, List<String> qualificationIds, String clusterId) {

        if (job == null) {
            throw new RuntimeException("Job cannot be null");
        }

        if (clusterId == null || clusterId.isBlank()) {
            throw new RuntimeException("Cluster ID is required");
        }

        CareerCluster cluster = careerClusterRepository.findById(clusterId)
                .orElseThrow(() -> new RuntimeException("Cluster not found: " + clusterId));

        List<Qualification> qualifications =
                (qualificationIds == null || qualificationIds.isEmpty())
                        ? List.of()
                        : qualificationRepository.findAllById(qualificationIds);

        job.setCluster(cluster);
        job.setQualifications(qualifications);

        return jobRepo.save(job).getId();
    }

    // UPDATE JOB
    public String update(String id, Job updatedJob, List<String> qualificationIds, String clusterId) {

        Job job = jobRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        CareerCluster cluster = careerClusterRepository.findById(clusterId)
                .orElseThrow(() -> new RuntimeException("Cluster not found"));

        List<Qualification> qualifications = qualificationRepository.findAllById(qualificationIds);

        job.setTitle(updatedJob.getTitle());
        job.setDescription(updatedJob.getDescription());
        job.setSkills(updatedJob.getSkills());
        job.setAlStream(updatedJob.getAlStream());
        job.setAlSubjects(updatedJob.getAlSubjects());
        job.setSalaryMin(updatedJob.getSalaryMin());
        job.setSalaryMax(updatedJob.getSalaryMax());
        job.setIndustryDemand(updatedJob.getIndustryDemand());
        job.setCareerPathway(updatedJob.getCareerPathway());
        job.setEmploymentGrowth(updatedJob.getEmploymentGrowth());
        job.setSector(updatedJob.getSector());
        job.setImage(updatedJob.getImage());
        job.setRemoteAvailable(updatedJob.getRemoteAvailable());
        job.setInternshipAvailable(updatedJob.getInternshipAvailable());

        job.setCluster(cluster);
        job.setQualifications(qualifications);

        return jobRepo.save(job).getId();
    }

    // DELETE JOB
    public void delete(String id) {
        jobRepo.deleteById(id);
    }

    // RESPONSE MAPPING
    private JobResponse toResponse(Job j) {

        return JobResponse.builder()
                .id(j.getId())
                .title(j.getTitle())
                .description(j.getDescription())

                .qualifications(
                        j.getQualifications() == null
                                ? List.of()
                                : j.getQualifications().stream()
                                .map(q -> JobResponse.QualificationDto.builder()
                                        .id(q.getId())
                                        .name(q.getName())
                                        .build())
                                .collect(Collectors.toList())
                )

                .skills(j.getSkills())
                .alStream(j.getAlStream())
                .alSubjects(j.getAlSubjects())
                .salaryMin(j.getSalaryMin())
                .salaryMax(j.getSalaryMax())
                .industryDemand(j.getIndustryDemand())
                .careerPathway(j.getCareerPathway())
                .employmentGrowth(j.getEmploymentGrowth())
                .sector(j.getSector())
                .image(j.getImage())
                .remoteAvailable(j.getRemoteAvailable())
                .internshipAvailable(j.getInternshipAvailable())

                .clusterId(j.getCluster().getId())
                .clusterName(j.getCluster().getName())
                .clusterEmoji(j.getCluster().getEmoji())
                .clusterColor(j.getCluster().getColor())
                .build();
    }
}