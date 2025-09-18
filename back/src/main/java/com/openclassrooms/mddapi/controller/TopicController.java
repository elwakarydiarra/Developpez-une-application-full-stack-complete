package com.openclassrooms.mddapi.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.openclassrooms.mddapi.dto.TopicDto;
import com.openclassrooms.mddapi.service.TopicService;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;

@SecurityRequirement(name = "bearerAuth")
@RestController
@RequestMapping("/api/topics")
@RequiredArgsConstructor
public class TopicController {
	private final TopicService topicService;
	private final CurrentUser currentUser;

	@GetMapping
	public List<TopicDto> list() {
		Long userId = currentUser.requireUser().getId();
		return topicService.listForUser(userId);
	}

	/** S'abonner */
	@PostMapping("/{id}/subscribe")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void subscribe(@PathVariable Long id) {
		Long userId = currentUser.requireUser().getId();
		topicService.subscribe(userId, id);
	}

	/** Se désabonner */
	@DeleteMapping("/{id}/subscribe")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void unsubscribe(@PathVariable Long id) {
		Long userId = currentUser.requireUser().getId();
		topicService.unsubscribe(userId, id);
	}

	/** Optionnel: ne retourner que mes thèmes */
	@GetMapping("/me")
	public List<TopicDto> myTopics() {
		Long userId = currentUser.requireUser().getId();
		return topicService.listForUser(userId).stream().filter(TopicDto::subscribed).toList();
	}
}
