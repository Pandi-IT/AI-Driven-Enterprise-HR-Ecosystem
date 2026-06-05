package com.example.employee.controller;

import com.example.employee.model.AttendanceRecord;
import com.example.employee.repository.AttendanceRecordRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {

    private final AttendanceRecordRepository repository;
    private final com.example.employee.repository.EmployeeRepository employeeRepository;

    public AttendanceController(AttendanceRecordRepository repository, com.example.employee.repository.EmployeeRepository employeeRepository) {
        this.repository = repository;
        this.employeeRepository = employeeRepository;
    }

    @GetMapping
    public List<AttendanceRecord> listAll() {
        return repository.findAll();
    }

    @GetMapping("/employee/{id}")
    public List<AttendanceRecord> getByEmployee(@PathVariable Long id) {
        return repository.findByEmployeeId(id);
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody AttendanceRecord record) {
        if (record.getEmployee() == null || record.getEmployee().getId() == null) {
            return ResponseEntity.badRequest().body("Employee ID is required.");
        }
        return employeeRepository.findById(record.getEmployee().getId())
                .map(employee -> {
                    record.setEmployee(employee);
                    return ResponseEntity.ok(repository.save(record));
                })
                .orElse(ResponseEntity.badRequest().build());
    }
}
