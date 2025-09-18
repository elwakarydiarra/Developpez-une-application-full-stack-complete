package com.openclassrooms.mddapi.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

public record UserUpdateRequest(@Email String email, @Size(min = 3, max = 30) String username,
		@Size(min = 8) String password) {
}
