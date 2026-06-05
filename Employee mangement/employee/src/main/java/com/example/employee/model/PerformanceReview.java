package com.example.employee.model;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.time.LocalDate;

@Entity
@Table(name = "performance_reviews")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class PerformanceReview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDate reviewDate;

    private int score; // 0-10

    @Column(columnDefinition = "TEXT")
    private String strengths;

    @Column(columnDefinition = "TEXT")
    private String improvements;

    private String recommendation;

    @Column(columnDefinition = "TEXT")
    private String aiSummary; // Stores the full raw response from the AI

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "employee_id", nullable = false)
    @JsonIgnoreProperties({"attendanceRecords", "leaveRequests", "performanceReviews", "hibernateLazyInitializer", "handler"})
    private Employee employee;
}
