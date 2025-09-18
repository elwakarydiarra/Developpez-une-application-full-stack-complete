package com.openclassrooms.mddapi.dto;

public record CommentDto(Long id, Long authorId, String content, String createdAt) {
}
