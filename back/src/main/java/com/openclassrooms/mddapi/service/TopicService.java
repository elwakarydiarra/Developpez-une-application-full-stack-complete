package com.openclassrooms.mddapi.service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.openclassrooms.mddapi.dto.TopicDto;
import com.openclassrooms.mddapi.entity.Subscription;
import com.openclassrooms.mddapi.repository.SubscriptionRepository;
import com.openclassrooms.mddapi.repository.TopicRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TopicService {
	private final TopicRepository topicRepo;
	private final SubscriptionRepository subRepo;

	public List<TopicDto> listForUser(Long userId) {

		Set<Long> subscribedTopicIds = subRepo.findByIdUserId(userId).stream().map(s -> s.getId().getTopicId())
				.collect(Collectors.toSet());

		return topicRepo.findAll().stream().map(
				t -> new TopicDto(t.getId(), t.getName(), t.getDescription(), subscribedTopicIds.contains(t.getId())))
				.toList();
	}

	public void subscribe(Long userId, Long topicId) {
		var id = new Subscription.Id(userId, topicId);

		if (!subRepo.existsByIdUserIdAndIdTopicId(userId, topicId)) {
			subRepo.save(Subscription.builder().id(id).build());
		}
	}

	public void unsubscribe(Long userId, Long topicId) {
		// Deux options équivalentes:
		subRepo.deleteById(new Subscription.Id(userId, topicId));
		// ou: subRepo.deleteByIdUserIdAndIdTopicId(userId, topicId);
	}
}
