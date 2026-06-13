package com.sljobbank.repository;

import com.sljobbank.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface CareerClusterRepository extends JpaRepository<CareerCluster, String>, JpaSpecificationExecutor<CareerCluster> {
    
}
