package com.openclassrooms.mddapi.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record ProfileUpdateRequest(@NotBlank String username, @Email @NotBlank String email) {
}
