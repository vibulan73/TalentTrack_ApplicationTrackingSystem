package com.ats.controller;

import com.ats.model.Application;
import com.ats.model.Application.ApplicationStatus;
import com.ats.model.Job;
import com.ats.model.User;
import com.ats.repository.ApplicationRepository;
import com.ats.repository.JobRepository;
import com.ats.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

/**
 * Seeder Controller - Call POST /api/seed to populate mock data
 * 
 * Usage:
 * - Start project normally: .\mvnw.cmd spring-boot:run
 * - When you need data, call: POST http://localhost:8080/api/seed
 * - Or open in browser: http://localhost:8080/api/seed/run
 */
@RestController
@RequestMapping("/api/seed")
@RequiredArgsConstructor
public class SeederController {

    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;
    private final PasswordEncoder passwordEncoder;

    private final Random random = new Random();

    /**
     * GET endpoint - Easy to trigger from browser
     * http://localhost:8080/api/seed/run
     */
    @GetMapping("/run")
    public ResponseEntity<Map<String, Object>> seedGet() {
        return runSeeder();
    }

    /**
     * POST endpoint - For API calls
     * POST http://localhost:8080/api/seed
     */
    @PostMapping
    public ResponseEntity<Map<String, Object>> seedPost() {
        return runSeeder();
    }

    private ResponseEntity<Map<String, Object>> runSeeder() {
        Map<String, Object> result = new HashMap<>();

        try {
            // Create recruiters
            User recruiter1 = createUser("John Smith", "john@company.com", "password123");
            User recruiter2 = createUser("Sarah Johnson", "sarah@company.com", "password123");
            User testUser = createUser("Test Recruiter", "test@test.com", "123456");

            // Create jobs
            List<Job> jobs = List.of(
                    createJob("Senior Software Engineer", """
                            We are looking for a Senior Software Engineer to join our team.

                            Requirements:
                            - 5+ years of experience in software development
                            - Strong proficiency in Java, Spring Boot, and React
                            - Experience with PostgreSQL and RESTful APIs
                            - Excellent problem-solving skills

                            Benefits:
                            - Competitive salary
                            - Remote work options
                            - Health insurance
                            """, recruiter1),

                    createJob("Frontend Developer", """
                            Join our frontend team to build amazing user experiences.

                            Requirements:
                            - 3+ years of React/Vue/Angular experience
                            - Strong CSS and JavaScript skills
                            - Experience with responsive design
                            """, recruiter1),

                    createJob("DevOps Engineer", """
                            We need a DevOps Engineer to improve our CI/CD pipelines.

                            Requirements:
                            - Experience with Docker and Kubernetes
                            - AWS/GCP/Azure cloud platforms
                            - CI/CD tools (Jenkins, GitHub Actions)
                            """, recruiter2),

                    createJob("Product Manager", """
                            Lead product development for our core platform.

                            Requirements:
                            - 4+ years of product management experience
                            - Strong analytical and communication skills
                            - Experience with Agile methodologies
                            """, recruiter2),

                    createJob("UX Designer", """
                            Create beautiful and intuitive user interfaces.

                            Requirements:
                            - 3+ years of UX/UI design experience
                            - Proficiency in Figma/Sketch
                            - Understanding of user-centered design
                            """, testUser));

            // Create applications
            String[] candidateNames = {
                    "Alice Williams", "Bob Anderson", "Carol Martinez", "David Lee",
                    "Emma Thompson", "Frank Wilson", "Grace Chen", "Henry Davis",
                    "Isabella Garcia", "Jack Brown", "Kate Johnson", "Liam Miller",
                    "Mia Robinson", "Noah Taylor", "Olivia White", "Peter Harris"
            };

            ApplicationStatus[] statuses = ApplicationStatus.values();
            int applicationCount = 0;

            for (Job job : jobs) {
                int numApplications = 3 + random.nextInt(6);
                for (int i = 0; i < numApplications && applicationCount < candidateNames.length; i++) {
                    String name = candidateNames[applicationCount % candidateNames.length];
                    String email = name.toLowerCase().replace(" ", ".") + "@email.com";
                    ApplicationStatus status = statuses[random.nextInt(statuses.length)];

                    createApplication(name, email, job, status);
                    applicationCount++;
                }
            }

            result.put("success", true);
            result.put("message", "Database seeded successfully!");
            result.put("recruitersCreated", 3);
            result.put("jobsCreated", jobs.size());
            result.put("applicationsCreated", applicationCount);
            result.put("testCredentials", Map.of(
                    "email", "test@test.com",
                    "password", "123456"));

            return ResponseEntity.ok(result);

        } catch (Exception e) {
            result.put("success", false);
            result.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(result);
        }
    }

    private User createUser(String fullName, String email, String password) {
        if (userRepository.existsByEmail(email)) {
            return userRepository.findByEmail(email).orElse(null);
        }
        User user = User.builder()
                .fullName(fullName)
                .email(email)
                .password(passwordEncoder.encode(password))
                .build();
        return userRepository.save(user);
    }

    private Job createJob(String title, String description, User createdBy) {
        Job job = Job.builder()
                .title(title)
                .description(description)
                .active(true)
                .createdBy(createdBy)
                .createdAt(LocalDateTime.now().minusDays(random.nextInt(30)))
                .build();
        return jobRepository.save(job);
    }

    private Application createApplication(String name, String email, Job job, ApplicationStatus status) {
        Application application = Application.builder()
                .candidateName(name)
                .candidateEmail(email)
                .job(job)
                .status(status)
                .submittedAt(LocalDateTime.now().minusDays(random.nextInt(14)))
                .build();
        return applicationRepository.save(application);
    }
}
