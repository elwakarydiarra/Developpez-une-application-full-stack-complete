package com.openclassrooms.mddapi.dto;

import jakarta.validation.constraints.NotBlank;

public record AuthRequest(@NotBlank String identifier, @NotBlank String password) {
}
