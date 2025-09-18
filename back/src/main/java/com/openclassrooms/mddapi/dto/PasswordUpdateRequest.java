package com.openclassrooms.mddapi.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record PasswordUpdateRequest(@NotBlank String currentPassword,
		@NotBlank @Size(min = 8, max = 100) String newPassword) {
}
