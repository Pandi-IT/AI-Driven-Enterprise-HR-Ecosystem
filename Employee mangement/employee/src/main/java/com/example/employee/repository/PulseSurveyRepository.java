package com.example.employee.repository;

import com.example.employee.model.PulseSurvey;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PulseSurveyRepository extends JpaRepository<PulseSurvey, Long> {
    
    @Query("SELECT AVG(p.rating) FROM PulseSurvey p")
    Double getAverageRating();
    
    List<PulseSurvey> findTop10ByOrderBySurveyDateDesc();
}
