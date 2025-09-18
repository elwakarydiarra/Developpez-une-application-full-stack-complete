package com.openclassrooms.mddapi.service;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.openclassrooms.mddapi.dto.PostCreateRequest;
import com.openclassrooms.mddapi.entity.Post;
import com.openclassrooms.mddapi.entity.Topic;
import com.openclassrooms.mddapi.entity.User;
import com.openclassrooms.mddapi.repository.PostRepository;
import com.openclassrooms.mddapi.repository.TopicRepository;
import com.openclassrooms.mddapi.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PostService {
	private final PostRepository postRepo;
	private final TopicRepository topicRepo;
	private final UserRepository userRepo;

	public Post create(Long userId, PostCreateRequest req) {
		User author = userRepo.findById(userId).orElseThrow(
				() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Utilisateur introuvable: " + userId));

		Topic topic = topicRepo.findById(req.topicId()).orElseThrow(
				() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Topic inexistant: " + req.topicId()));

		Post p = Post.builder().author(author).topic(topic).title(req.title()).content(req.content()).build();

		return postRepo.save(p);
	}

	public Post getById(Long id) {
		return postRepo.findById(id)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Post introuvable: " + id));
	}
}
