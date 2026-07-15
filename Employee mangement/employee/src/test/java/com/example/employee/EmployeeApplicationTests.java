package com.example.employee;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(properties = "spring.ai.openai.api-key=mock-key-for-testing")
class EmployeeApplicationTests {

	@Test
	void contextLoads() {
	}

}
