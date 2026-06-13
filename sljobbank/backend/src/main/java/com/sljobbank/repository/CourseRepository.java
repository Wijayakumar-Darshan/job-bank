package com.sljobbank.repository;

import com.sljobbank.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course, String>, JpaSpecificationExecutor<Course> {
    List<Course> findByQualificationId(String qualificationId);
    List<Course> findByInstituteId(String instituteId);
}
