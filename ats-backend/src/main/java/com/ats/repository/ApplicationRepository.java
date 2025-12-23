package com.ats.repository;

import com.ats.model.Application;
import com.ats.model.Application.ApplicationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {

    List<Application> findByJobIdOrderBySubmittedAtDesc(Long jobId);

    List<Application> findByStatusOrderBySubmittedAtDesc(ApplicationStatus status);

    @Query("SELECT a FROM Application a WHERE " +
            "(:jobId IS NULL OR a.job.id = :jobId) AND " +
            "(:status IS NULL OR a.status = :status) " +
            "ORDER BY a.submittedAt DESC")
    List<Application> findByFilters(@Param("jobId") Long jobId,
            @Param("status") ApplicationStatus status);

    @Query("SELECT a FROM Application a WHERE " +
            "LOWER(a.candidateName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(a.candidateEmail) LIKE LOWER(CONCAT('%', :query, '%')) " +
            "ORDER BY a.submittedAt DESC")
    List<Application> searchByNameOrEmail(@Param("query") String query);

    long countByStatus(ApplicationStatus status);

    long countByJobId(Long jobId);
}
