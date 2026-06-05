package com.example.employee.controller;

import org.springframework.web.bind.annotation.*;
import com.example.employee.service.AiService;
import com.example.employee.model.*;
import com.example.employee.repository.*;
import java.util.List;
import java.util.Map;
import java.time.LocalDate;

@RestController
@RequestMapping("/api/ai")
public class AiController {
    
    private final AiService aiService;
    private final AttendanceRecordRepository attendanceRepo;
    private final LeaveRequestRepository leaveRepo;
    private final PerformanceReviewRepository reviewRepo;
    private final PulseSurveyRepository pulseRepo;
    
    public AiController(AiService aiService, 
                        AttendanceRecordRepository attendanceRepo,
                        LeaveRequestRepository leaveRepo,
                        PerformanceReviewRepository reviewRepo,
                        PulseSurveyRepository pulseRepo) {
        this.aiService = aiService;
        this.attendanceRepo = attendanceRepo;
        this.leaveRepo = leaveRepo;
        this.reviewRepo = reviewRepo;
        this.pulseRepo = pulseRepo;
    }

    @PostMapping("/chat")
    public Map<String, String> chat(@RequestBody Map<String, String> payload) {
        String prompt = "Context: General HR Query. User Message: " + payload.get("message");
        String response = aiService.generateText(prompt);
        return Map.of("response", response);
    }
    
    @PostMapping("/email/generate")
    public Map<String, String> generateEmail(@RequestBody Map<String, Object> payload) {
        String prompt = "TASK: Generate a professional HR email.\n" +
                        "CONTEXT: " + payload.toString() + "\n" +
                        "REQUIREMENTS: Include a professional Subject, Salutation, structured Body, and formal Closing. " +
                        "Ensure the tone is warm but authoritative.";
        String response = aiService.generateText(prompt);
        return Map.of("email", response);
    }

    @PostMapping("/evaluate")
    public Map<String, String> evaluateEmployee(@RequestBody Map<String, Object> payload) {
        Long empId = Long.valueOf(payload.get("id").toString());
        List<AttendanceRecord> attendance = attendanceRepo.findByEmployeeId(empId);
        List<PerformanceReview> pastReviews = reviewRepo.findByEmployeeIdOrderByReviewDateDesc(empId);
        
        String prompt = "TASK: Generate a detailed Employee Performance Evaluation.\n" +
                        "EMPLOYEE: " + payload.toString() + "\n" +
                        "ATTENDANCE HISTORY: " + attendance.toString() + "\n" +
                        "PAST REVIEWS: " + pastReviews.toString() + "\n" +
                        "OUTPUT FORMAT: \n" +
                        "1. Performance Score (0-10)\n" +
                        "2. Top 3 Strengths\n" +
                        "3. Critical Areas for Improvement\n" +
                        "4. Future Recommendation (Promotion/Warning/Development Plan)\n\n" +
                        "Use Markdown formatting for clear sections.";
        
        String response = aiService.generateText(prompt);
        
        // Save to DB
        try {
            com.example.employee.model.Employee emp = new com.example.employee.model.Employee();
            emp.setId(empId);
            
            PerformanceReview review = PerformanceReview.builder()
                .reviewDate(LocalDate.now())
                .aiSummary(response)
                .employee(emp)
                .build();
            reviewRepo.save(review);
        } catch (Exception e) {
            System.err.println("Failed to save review: " + e.getMessage());
        }

        return Map.of("evaluation", response);
    }

    @PostMapping("/leave/respond")
    public Map<String, String> respondToLeave(@RequestBody Map<String, Object> payload) {
        Long empId = Long.valueOf(payload.get("id").toString());
        List<LeaveRequest> existingLeaves = leaveRepo.findByEmployeeId(empId);

        String prompt = "TASK: Draft a professional response to a leave request.\n" +
                        "DETAILS: " + payload.toString() + "\n" +
                        "EMPLOYEE LEAVE HISTORY: " + existingLeaves.toString() + "\n" +
                        "TONE: Formal HR communication. Ensure all dates mentioned are handled accurately.";
        String response = aiService.generateText(prompt);
        return Map.of("response", response);
    }

    @PostMapping("/attendance/analyze")
    public Map<String, String> analyzeAttendance(@RequestBody Map<String, Object> payload) {
        Long empId = Long.valueOf(payload.get("id").toString());
        List<AttendanceRecord> attendance = attendanceRepo.findByEmployeeId(empId);

        String prompt = "TASK: Analyze employee attendance patterns.\n" +
                        "DATA: " + attendance.toString() + "\n" +
                        "REQUIREMENTS: Identify any negative trends (repeated lateness, absenteeism) or positive patterns. " +
                        "Provide a 'Risk Level' (Low/Medium/High) and suggested HR action items.";
        String response = aiService.generateText(prompt);
        return Map.of("analysis", response);
    }

    // --- NEW RECRUITMENT ENDPOINTS ---

    @PostMapping("/recruitment/generate-jd")
    public Map<String, String> generateJD(@RequestBody Map<String, String> payload) {
        String prompt = "TASK: Generate a professional Job Description.\n" +
                        "TITLE: " + payload.get("title") + "\n" +
                        "DEPARTMENT: " + payload.get("department") + "\n" +
                        "REQUIREMENTS: Include Role Overview, Key Responsibilities, Required Skills, and Qualifications. " +
                        "Format with Markdown headers.";
        String response = aiService.generateText(prompt);
        return Map.of("jd", response);
    }

    @PostMapping("/recruitment/rank-candidate")
    public Map<String, String> rankCandidate(@RequestBody Map<String, String> payload) {
        String prompt = "TASK: Evaluate candidate suitability for a job.\n" +
                        "JOB DESCRIPTION: " + payload.get("jd") + "\n" +
                        "CANDIDATE RESUME: " + payload.get("resume") + "\n" +
                        "OUTPUT: \n" +
                        "1. Suitability Score (0-100)\n" +
                        "2. Match Breakdown (Skills, Experience, Education)\n" +
                        "3. Verdict (Shortlist/Reject/Hold)\n\n" +
                        "Be critical and objective.";
        String response = aiService.generateText(prompt);
        return Map.of("ranking", response);
    }

    // --- NEW ANALYTICS ENDPOINTS ---

    @PostMapping("/analytics/attrition-risk")
    public Map<String, String> checkAttritionRisk(@RequestBody Map<String, Object> payload) {
        Long empId = Long.valueOf(payload.get("id").toString());
        List<AttendanceRecord> attendance = attendanceRepo.findByEmployeeId(empId);
        List<LeaveRequest> leaves = leaveRepo.findByEmployeeId(empId);
        List<PerformanceReview> reviews = reviewRepo.findByEmployeeIdOrderByReviewDateDesc(empId);

        String prompt = "TASK: Predict Attrition Risk (Turnover Risk).\n" +
                        "EMPLOYEE DATA: " + payload.toString() + "\n" +
                        "ATTENDANCE: " + attendance.toString() + "\n" +
                        "LEAVES: " + leaves.toString() + "\n" +
                        "REVIEWS: " + reviews.toString() + "\n" +
                        "REQUIREMENTS: Provide a Risk Level (Low/Med/High), key predictors (e.g., declining performance, high absenteeism), " +
                        "and retention strategies. Format with Markdown.";
        String response = aiService.generateText(prompt);
        return Map.of("riskAnalysis", response);
    }

    @PostMapping("/analytics/mood-summary")
    public Map<String, String> getMoodSummary() {
        List<PulseSurvey> recentSurveys = pulseRepo.findTop10ByOrderBySurveyDateDesc();
        Double avgRating = pulseRepo.getAverageRating();

        String prompt = "TASK: Summarize Company Mood & Sentiment.\n" +
                        "AVERAGE RATING: " + (avgRating != null ? avgRating : "N/A") + " / 5\n" +
                        "RECENT COMMENTS: " + recentSurveys.stream().map(PulseSurvey::getComment).toList().toString() + "\n" +
                        "REQUIREMENTS: Provide a 'Pulse Check' summary. Is morale high/low? What are the common themes? " +
                        "Give 2 specific HR recommendations to improve engagement.";
        String response = aiService.generateText(prompt);
        return Map.of("summary", response);
    }
}
