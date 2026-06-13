package com.sljobbank.repository;

import com.sljobbank.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface FavoriteRepository extends JpaRepository<Favorite, String>, JpaSpecificationExecutor<Favorite> {
    List<Favorite> findByUserId(String userId);
    Optional<Favorite> findByUserIdAndJobId(String userId, String jobId);
    boolean existsByUserIdAndJobId(String userId, String jobId);
}
