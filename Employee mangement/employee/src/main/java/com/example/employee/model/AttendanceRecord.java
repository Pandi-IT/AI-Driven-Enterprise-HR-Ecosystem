package com.example.employee.model;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "attendance_records")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class AttendanceRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDate date;

    private LocalTime checkIn;

    private LocalTime checkOut;

    @Column(nullable = false)
    private String status; // Present, Late, Absent, Half-Day

    private String notes;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "employee_id", nullable = false)
    @JsonIgnoreProperties({"attendanceRecords", "leaveRequests", "performanceReviews", "hibernateLazyInitializer", "handler"})
    private Employee employee;
}
