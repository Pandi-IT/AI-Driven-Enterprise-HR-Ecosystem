package com.example.employee.controller;

import com.example.employee.repository.EmployeeRepository;
import com.example.employee.repository.AttendanceRecordRepository;
import com.example.employee.repository.LeaveRequestRepository;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.HashMap;
import java.time.LocalDate;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final EmployeeRepository empRepo;
    private final AttendanceRecordRepository attendanceRepo;
    private final LeaveRequestRepository leaveRepo;

    public DashboardController(EmployeeRepository empRepo, 
                               AttendanceRecordRepository attendanceRepo, 
                               LeaveRequestRepository leaveRepo) {
        this.empRepo = empRepo;
        this.attendanceRepo = attendanceRepo;
        this.leaveRepo = leaveRepo;
    }

    @GetMapping("/today")
    public Map<String, Object> getTodayStats() {
        LocalDate today = LocalDate.now();
        Map<String, Object> stats = new HashMap<>();
        
        stats.put("totalEmployees", empRepo.count());
        stats.put("presentToday", attendanceRepo.countByDateAndStatus(today, "Present"));
        stats.put("lateToday", attendanceRepo.countByDateAndStatus(today, "Late"));
        stats.put("pendingLeaves", leaveRepo.countByStatus("Pending"));
        
        return stats;
    }
}
