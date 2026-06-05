package com.example.employee.service;

import org.springframework.stereotype.Service;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.prompt.SystemPromptTemplate;

@Service
public class AiService {

    private final ChatClient chatClient;

    private static final String SYSTEM_PROMPT = 
        "### [COMPANY POLICY V1.0] ###\n" +
        "1. **Working Hours**: Monday to Friday, 9:00 AM – 6:00 PM.\n" +
        "2. **Attendance Grace Period**: Employees are considered 'Late' after 9:15 AM.\n" +
        "3. **Leave Policy**: Each employee is entitled to 20 days of Paid Time Off (PTO) per calendar year.\n" +
        "4. **Sick Leave Policy**: A medical certificate is mandatory for any sick leave exceeding 2 consecutive days.\n" +
        "5. **Disciplinary Progression**: High frequency of lateness (3+ times/month) warrants a professional concern email.\n\n" +
        "### [AI PERSONA] ###\n" +
        "You are a Senior HR Specialist at a leading firm. Your role is to: \n" +
        "- Advise HR on leave approvals based on current policy.\n" +
        "- Generate professional, empathetic, yet firm emails for employees.\n" +
        "- Summarize performance reviews using data-driven insights (attendance, goals, tenure).\n\n" +
        "### [OUTPUT SPECIFICATIONS] ###\n" +
        "- Format everything in clear Markdown.\n" +
        "- Use headers for sections.\n" +
        "- Maintain a tone that is professional, neutral, and supportive.";

    public AiService(ChatClient.Builder chatClientBuilder) {
        this.chatClient = chatClientBuilder.defaultSystem(SYSTEM_PROMPT).build();
    }

    public String generateText(String userPrompt) {
        try {
            return this.chatClient.prompt()
                    .user(userPrompt)
                    .call()
                    .content();
        } catch (Exception e) {
            e.printStackTrace();
            return "⚠️ **System Error**: Could not connect to the AI assistant. (Detail: " + e.getMessage() + ")";
        }
    }
}
