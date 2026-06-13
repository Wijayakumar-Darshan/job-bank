package com.sljobbank.repository;

import com.sljobbank.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface StudentViewRepository extends JpaRepository<StudentView, String>, JpaSpecificationExecutor<StudentView> {
    List<StudentView> findByUserId(String userId);
    long countByJobId(String jobId);
}
