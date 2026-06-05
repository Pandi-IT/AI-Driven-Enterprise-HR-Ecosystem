package com.example.employee.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.time.LocalDateTime;

@Entity
@Table(name = "candidates")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
@Builder
public class Candidate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String firstName;

    private String lastName;

    @Email
    @Column(nullable = false)
    private String email;

    @Column(columnDefinition = "TEXT")
    private String resumeText;

    private Integer score; // AI Suitability Score (0-100)

    @Column(columnDefinition = "TEXT")
    private String aiFeedback;

    @Builder.Default
    private String status = "Applied"; // Applied, Shortlisted, Rejected, Hired

    private LocalDateTime appliedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_id")
    @JsonIgnoreProperties({"candidates", "hibernateLazyInitializer", "handler"})
    private JobPosting jobPosting;

    @PrePersist
    protected void onApply() {
        appliedAt = LocalDateTime.now();
    }
}
