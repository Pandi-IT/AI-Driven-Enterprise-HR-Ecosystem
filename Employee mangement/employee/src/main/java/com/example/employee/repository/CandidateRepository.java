package com.example.employee.repository;

import com.example.employee.model.Candidate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CandidateRepository extends JpaRepository<Candidate, Long> {
    List<Candidate> findByJobPostingId(Long jobId);
}
