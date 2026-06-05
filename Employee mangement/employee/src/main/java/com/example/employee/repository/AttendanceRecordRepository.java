package com.example.employee.repository;

import com.example.employee.model.AttendanceRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.data.repository.query.Param;
import java.util.List;

@Repository
public interface AttendanceRecordRepository extends JpaRepository<AttendanceRecord, Long> {
    List<AttendanceRecord> findByEmployeeId(Long employeeId);
    
    // For Dashboard Stats - Added @Param for robustness
    @Query("SELECT COUNT(a) FROM AttendanceRecord a WHERE a.date = :date AND a.status = :status")
    long countByDateAndStatus(@Param("date") java.time.LocalDate date, @Param("status") String status);
}
