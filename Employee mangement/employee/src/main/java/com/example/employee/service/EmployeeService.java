package com.example.employee.service;

import com.example.employee.model.Employee;
import com.example.employee.repository.EmployeeRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EmployeeService {
    private final EmployeeRepository repo;

    public EmployeeService(EmployeeRepository repo) {
        this.repo = repo;
    }

    public List<Employee> listAll() {
        return repo.findAll();
    }

    public Optional<Employee> getById(Long id) {
        return repo.findById(id);
    }

    public Employee create(Employee emp) {
        // basic unique email check (optional)
        if (emp.getEmail() != null && repo.existsByEmail(emp.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }
        return repo.save(emp);
    }

    public Employee update(Long id, Employee updated) {
        Employee emp = repo.findById(id).orElseThrow(() -> new IllegalArgumentException("Employee not found"));
        emp.setFirstName(updated.getFirstName());
        emp.setLastName(updated.getLastName());
        emp.setEmail(updated.getEmail());
        emp.setPhone(updated.getPhone());
        emp.setDepartment(updated.getDepartment());
        emp.setPosition(updated.getPosition());
        emp.setStartDate(updated.getStartDate());
        emp.setStatus(updated.getStatus());
        emp.setPhotoUrl(updated.getPhotoUrl());
        return repo.save(emp);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }
}
