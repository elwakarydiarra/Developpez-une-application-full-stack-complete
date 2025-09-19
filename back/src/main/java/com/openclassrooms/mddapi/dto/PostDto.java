package com.openclassrooms.mddapi.dto;

public record PostDto(Long id, Long authorId, String authorUsername, Long topicId, String topicName, String title,
		String content, String createdAt) {
}
