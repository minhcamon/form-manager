package com.formmanager.dto.response;

import com.formmanager.entity.enums.UserRole;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private Long id;
    private String email;
    private String fullname;
    private UserRole role;
}
