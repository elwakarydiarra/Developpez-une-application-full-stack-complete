package com.openclassrooms.mddapi.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record PostCreateRequest(@NotNull Long topicId, @NotBlank String title, @NotBlank String content) {
}
