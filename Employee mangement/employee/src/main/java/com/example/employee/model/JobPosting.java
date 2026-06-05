package com.example.employee.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "job_postings")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
@Builder
public class JobPosting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String title;

    private String department;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Builder.Default
    private String status = "Open"; // Open, Closed

    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "jobPosting", cascade = CascadeType.ALL)
    @JsonIgnoreProperties({"jobPosting", "hibernateLazyInitializer", "handler"})
    private List<Candidate> candidates;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
