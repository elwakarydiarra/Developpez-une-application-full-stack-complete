package com.openclassrooms.mddapi.dto;

public record SignupRequest(@jakarta.validation.constraints.Email String email,
		@jakarta.validation.constraints.NotBlank String username,
		@jakarta.validation.constraints.Size(min = 6) String password) {
}
