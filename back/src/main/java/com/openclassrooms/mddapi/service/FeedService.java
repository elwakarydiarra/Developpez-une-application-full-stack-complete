package com.openclassrooms.mddapi.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.openclassrooms.mddapi.entity.Post;
import com.openclassrooms.mddapi.repository.PostRepository;
import com.openclassrooms.mddapi.repository.SubscriptionRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FeedService {

	private final SubscriptionRepository subRepo;
	private final PostRepository postRepo;

	public List<Post> feed(Long userId, boolean asc) {
		var topicIds = subRepo.findByIdUserId(userId).stream().map(s -> s.getId().getTopicId()).toList();

		if (topicIds.isEmpty()) {

			return asc ? postRepo.findAllByOrderByCreatedAtAsc() : postRepo.findAllByOrderByCreatedAtDesc();
		}

		return asc ? postRepo.findByTopicIdInOrderByCreatedAtAsc(topicIds)
				: postRepo.findByTopicIdInOrderByCreatedAtDesc(topicIds);
	}
}
