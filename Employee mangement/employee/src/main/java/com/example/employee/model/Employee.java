package com.example.employee.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "employees")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
@Builder
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String firstName;

    private String lastName;

    @Email
    @Column(nullable = false, unique = true)
    private String email;

    private String phone;

    private String department;

    private String position;

    private String startDate; // YYYY-MM-DD string

    @Builder.Default
    @Column(nullable = false)
    private String status = "Active";

    private String photoUrl;

    @Builder.Default
    @Column(nullable = false)
    private Integer conflictCount = 0;

    @Builder.Default
    @Version
    private Long version = 0L;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    @OneToMany(mappedBy = "employee", cascade = CascadeType.ALL)
    private List<AttendanceRecord> attendanceRecords;

    @OneToMany(mappedBy = "employee", cascade = CascadeType.ALL)
    private List<LeaveRequest> leaveRequests;

    @OneToMany(mappedBy = "employee", cascade = CascadeType.ALL)
    private List<PerformanceReview> performanceReviews;
}
