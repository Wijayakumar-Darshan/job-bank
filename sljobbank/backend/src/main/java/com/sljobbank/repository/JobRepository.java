package com.sljobbank.repository;

import com.sljobbank.entity.Job;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, String>, JpaSpecificationExecutor<Job> {

    // ✅ FIXED: correct nested property
    Page<Job> findByCluster_Id(String clusterId, Pageable pageable);

    // Search jobs by title
    Page<Job> findByTitleContainingIgnoreCase(String q, Pageable pageable);

    // Latest 10 jobs
    List<Job> findTop10ByOrderByCreatedAtDesc();

    // Optional (no paging version)
    List<Job> findByCluster_Id(String clusterId);
}