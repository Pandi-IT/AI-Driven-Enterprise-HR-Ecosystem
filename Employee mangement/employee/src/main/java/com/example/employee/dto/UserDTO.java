package com.example.employee.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
@Builder
public class UserDTO {
    private Long id;
    private String email;
    private String role;
    private Long employeeId;
    private String firstName;
    private String lastName;
}
