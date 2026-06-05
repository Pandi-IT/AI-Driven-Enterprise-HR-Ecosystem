package com.example.employee.config;

import com.example.employee.model.*;
import com.example.employee.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import lombok.extern.slf4j.Slf4j;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Arrays;

@Configuration
@Slf4j
public class DataLoader {

    @Bean
    CommandLineRunner initDatabase(EmployeeRepository empRepo, 
                                   AttendanceRecordRepository attendanceRepo,
                                   LeaveRequestRepository leaveRepo,
                                   PerformanceReviewRepository reviewRepo) {
        return args -> {
            if (empRepo.count() > 0) return;

            // 1. John Doe (Engineering) - Pattern: Intermittently Late
            Employee john = empRepo.save(Employee.builder().firstName("John").lastName("Doe").email("john.d@co.com").department("Engineering").position("Dev").startDate("2023-01-01").status("Active").build());
            attendanceRepo.saveAll(Arrays.asList(
                AttendanceRecord.builder().employee(john).date(LocalDate.now().minusDays(1)).checkIn(LocalTime.of(9, 10)).status("Present").build(),
                AttendanceRecord.builder().employee(john).date(LocalDate.now()).checkIn(LocalTime.of(10, 30)).status("Late").notes("Overslept").build()
            ));

            // 2. Jane Smith (Marketing) - Pattern: Perfect On-Time
            Employee jane = empRepo.save(Employee.builder().firstName("Jane").lastName("Smith").email("jane.s@co.com").department("Marketing").position("Lead").startDate("2022-05-20").status("Active").build());
            attendanceRepo.saveAll(Arrays.asList(
                AttendanceRecord.builder().employee(jane).date(LocalDate.now().minusDays(1)).checkIn(LocalTime.of(8, 55)).status("Present").build(),
                AttendanceRecord.builder().employee(jane).date(LocalDate.now()).checkIn(LocalTime.of(8, 58)).status("Present").build()
            ));
            leaveRepo.save(LeaveRequest.builder().employee(jane).startDate(LocalDate.now().plusDays(15)).endDate(LocalDate.now().plusDays(20)).leaveType("Vacation").reason("Family Trip").status("Pending").build());

            // 3. Robert Brown (Design) - Pattern: Sick Leave & Absences
            Employee rob = empRepo.save(Employee.builder().firstName("Robert").lastName("Brown").email("rob.b@co.com").department("Design").position("Junior").startDate("2023-11-10").status("Active").build());
            leaveRepo.save(LeaveRequest.builder().employee(rob).startDate(LocalDate.now().minusDays(15)).endDate(LocalDate.now().minusDays(13)).leaveType("Sick").reason("Flu").status("Approved").build());
            attendanceRepo.save(AttendanceRecord.builder().employee(rob).date(LocalDate.now()).status("Absent").notes("No show").build());

            // 4. Alice Green (QA) - New Joiner, Onboarding
            Employee alice = empRepo.save(Employee.builder().firstName("Alice").lastName("Green").email("alice.g@co.com").department("QA").position("Tester").startDate("2024-03-01").status("Active").build());
            attendanceRepo.save(AttendanceRecord.builder().employee(alice).date(LocalDate.now()).checkIn(LocalTime.of(9, 0)).status("Present").build());

            // 5. Bob White (Sales) - Currently on Approved Leave
            Employee bob = empRepo.save(Employee.builder().firstName("Bob").lastName("White").email("bob.w@co.com").department("Sales").position("Exec").startDate("2021-08-10").status("Active").build());
            leaveRepo.save(LeaveRequest.builder().employee(bob).startDate(LocalDate.now().minusDays(1)).endDate(LocalDate.now().plusDays(2)).leaveType("Vacation").reason("Beach Trip").status("Approved").build());

            // 6. Charlie Black (Management) - High Performer
            Employee charlie = empRepo.save(Employee.builder().firstName("Charlie").lastName("Black").email("charlie.b@co.com").department("Management").position("Director").startDate("2019-10-01").status("Active").build());
            attendanceRepo.save(AttendanceRecord.builder().employee(charlie).date(LocalDate.now()).checkIn(LocalTime.of(8, 30)).status("Present").build());
            reviewRepo.save(PerformanceReview.builder().employee(charlie).reviewDate(LocalDate.now().minusMonths(3)).score(10).aiSummary("Exceptional leadership and vision.").build());

            log.info(">>> 🚀 MASSIVE HR DUMMY DATA SEEDED SUCCESSFULLY <<<");
        };
    }
}
