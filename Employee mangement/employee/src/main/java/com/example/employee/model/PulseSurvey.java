package com.example.employee.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.*;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.time.LocalDateTime;

@Entity
@Table(name = "pulse_surveys")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
@Builder
public class PulseSurvey {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Min(1) @Max(5)
    private Integer rating; // 1-5 rating (Sad-Happy)

    private String comment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id")
    @JsonIgnoreProperties({"attendanceRecords", "leaveRequests", "performanceReviews", "hibernateLazyInitializer", "handler"})
    private Employee employee;

    private LocalDateTime surveyDate;

    @PrePersist
    protected void onSurvey() {
        surveyDate = LocalDateTime.now();
    }
}
