package com.openclassrooms.mddapi.dto;

public record CommentDto(Long id, Long authorId, String authorUsername, String content, String createdAt) {
}
