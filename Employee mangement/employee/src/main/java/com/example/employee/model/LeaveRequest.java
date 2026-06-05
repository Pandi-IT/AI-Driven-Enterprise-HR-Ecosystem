package com.example.employee.model;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.time.LocalDate;

@Entity
@Table(name = "leave_requests")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class LeaveRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDate startDate;

    @Column(nullable = false)
    private LocalDate endDate;

    @Column(nullable = false)
    private String leaveType; // Sick, Vacation, Personal, etc.

    @Column(nullable = false)
    private String reason;

    @Builder.Default
    @Column(nullable = false)
    private String status = "Pending"; // Pending, Approved, Rejected

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "employee_id", nullable = false)
    @JsonIgnoreProperties({"attendanceRecords", "leaveRequests", "performanceReviews", "hibernateLazyInitializer", "handler"})
    private Employee employee;
}
