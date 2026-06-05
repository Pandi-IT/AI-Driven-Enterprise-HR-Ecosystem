package com.example.employee.controller;

import com.example.employee.model.LeaveRequest;
import com.example.employee.repository.LeaveRequestRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/leaves")
public class LeaveRequestController {

    private final LeaveRequestRepository repository;

    public LeaveRequestController(LeaveRequestRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<LeaveRequest> listAll() {
        return repository.findAll();
    }

    @GetMapping("/employee/{id}")
    public List<LeaveRequest> getByEmployee(@PathVariable Long id) {
        return repository.findByEmployeeId(id);
    }

    @PostMapping
    public LeaveRequest create(@RequestBody LeaveRequest request) {
        return repository.save(request);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<LeaveRequest> updateStatus(@PathVariable Long id, @RequestBody String status) {
        return repository.findById(id).map(req -> {
            req.setStatus(status.replace("\"", "")); // remove quotes if sent as plain string
            return ResponseEntity.ok(repository.save(req));
        }).orElse(ResponseEntity.notFound().build());
    }
}
