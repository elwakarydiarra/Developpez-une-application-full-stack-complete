package com.openclassrooms.mddapi.controller;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.openclassrooms.mddapi.dto.PostDto;
import com.openclassrooms.mddapi.service.FeedService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/feed")
@RequiredArgsConstructor
public class FeedController {

	private final FeedService feedService;
	private final CurrentUser currentUser;

	@PreAuthorize("isAuthenticated()")
	@GetMapping
	public List<PostDto> feed(@RequestParam(defaultValue = "desc") String sort) {
		boolean asc = "asc".equalsIgnoreCase(sort);
		Long userId = currentUser.requireUser().getId();

		return feedService.feed(userId, asc).stream()
				.map(p -> new PostDto(p.getId(), p.getAuthor().getId(), p.getAuthor().getUsername(),
						p.getTopic().getId(), p.getTitle(), p.getContent(), p.getCreatedAt().toString()))
				.toList();
	}
}
