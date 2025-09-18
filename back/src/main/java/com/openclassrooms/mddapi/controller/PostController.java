package com.openclassrooms.mddapi.controller;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.openclassrooms.mddapi.dto.CommentCreateRequest;
import com.openclassrooms.mddapi.dto.CommentDto;
import com.openclassrooms.mddapi.dto.PostCreateRequest;
import com.openclassrooms.mddapi.dto.PostDto;
import com.openclassrooms.mddapi.entity.Comment;
import com.openclassrooms.mddapi.entity.Post;
import com.openclassrooms.mddapi.repository.CommentRepository;
import com.openclassrooms.mddapi.service.PostService;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;

@SecurityRequirement(name = "bearerAuth")
@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

	private final PostService postService;
	private final CommentRepository commentRepo;
	private final CurrentUser currentUser;

	@PreAuthorize("isAuthenticated()")
	@PostMapping
	public PostDto create(@Validated @RequestBody PostCreateRequest req) {
		Long userId = currentUser.requireUser().getId();
		Post p = postService.create(userId, req);
		return new PostDto(p.getId(), p.getAuthor().getId(), p.getAuthor().getUsername(), p.getTopic().getId(),
				p.getTitle(), p.getContent(), p.getCreatedAt().toString());
	}

	@GetMapping("/{id}")
	public PostDto get(@PathVariable Long id) {
		Post p = postService.getById(id);
		return new PostDto(p.getId(), p.getAuthor().getId(), p.getAuthor().getUsername(), p.getTopic().getId(),
				p.getTitle(), p.getContent(), p.getCreatedAt().toString());
	}

	@GetMapping("/{id}/comments")
	public List<CommentDto> listComments(@PathVariable Long id) {
		return commentRepo.findByPost_IdOrderByCreatedAtAsc(id).stream().map(c -> new CommentDto(c.getId(),
				c.getAuthor() != null ? c.getAuthor().getId() : null, c.getContent(), c.getCreatedAt().toString()))
				.toList();
	}

	@PreAuthorize("isAuthenticated()")
	@PostMapping("/{id}/comments")
	public CommentDto addComment(@PathVariable Long id, @Validated @RequestBody CommentCreateRequest req) {
		var user = currentUser.requireUser();
		var post = postService.getById(id);
		var c = commentRepo.save(Comment.builder().post(post).author(user).content(req.content()).build());
		return new CommentDto(c.getId(), c.getAuthor() != null ? c.getAuthor().getId() : null, c.getContent(),
				c.getCreatedAt().toString());
	}
}
