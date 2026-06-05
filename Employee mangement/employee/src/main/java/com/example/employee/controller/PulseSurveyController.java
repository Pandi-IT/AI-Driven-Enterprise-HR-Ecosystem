package com.example.employee.controller;

import com.example.employee.model.PulseSurvey;
import com.example.employee.repository.PulseSurveyRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pulse")
public class PulseSurveyController {

    private final PulseSurveyRepository pulseRepo;

    public PulseSurveyController(PulseSurveyRepository pulseRepo) {
        this.pulseRepo = pulseRepo;
    }

    @PostMapping
    public PulseSurvey submitSurvey(@RequestBody PulseSurvey survey) {
        return pulseRepo.save(survey);
    }

    @GetMapping("/recent")
    public List<PulseSurvey> getRecentSurveys() {
        return pulseRepo.findTop10ByOrderBySurveyDateDesc();
    }
}
