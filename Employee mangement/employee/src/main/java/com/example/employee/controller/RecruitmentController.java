package com.example.employee.controller;

import com.example.employee.model.Candidate;
import com.example.employee.model.JobPosting;
import com.example.employee.repository.CandidateRepository;
import com.example.employee.repository.JobPostingRepository;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/recruitment")
public class RecruitmentController {

    private final JobPostingRepository jobRepo;
    private final CandidateRepository candidateRepo;

    public RecruitmentController(JobPostingRepository jobRepo, CandidateRepository candidateRepo) {
        this.jobRepo = jobRepo;
        this.candidateRepo = candidateRepo;
    }

    @GetMapping("/jobs")
    public List<JobPosting> getAllJobs() {
        return jobRepo.findAll();
    }

    @PostMapping("/jobs")
    public JobPosting createJob(@Valid @RequestBody JobPosting job) {
        return jobRepo.save(job);
    }

    @GetMapping("/candidates")
    public List<Candidate> getAllCandidates() {
        return candidateRepo.findAll();
    }

    @PostMapping("/candidates")
    public Candidate apply(@Valid @RequestBody Candidate candidate) {
        if (candidate.getJobPosting() != null && candidate.getJobPosting().getId() != null) {
            JobPosting job = jobRepo.findById(candidate.getJobPosting().getId())
                    .orElseThrow(() -> new IllegalArgumentException("Invalid Job Posting ID"));
            candidate.setJobPosting(job);
        }
        return candidateRepo.save(candidate);
    }
    
    @GetMapping("/jobs/{id}/candidates")
    public List<Candidate> getCandidatesByJob(@PathVariable Long id) {
        return candidateRepo.findByJobPostingId(id);
    }
}
