package com.openclassrooms.mddapi.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.openclassrooms.mddapi.entity.Subscription;

public interface SubscriptionRepository extends JpaRepository<Subscription, Subscription.Id> {

	boolean existsByIdUserIdAndIdTopicId(Long userId, Long topicId);

	void deleteByIdUserIdAndIdTopicId(Long userId, Long topicId);

	List<Subscription> findByIdUserId(Long userId);

	List<Subscription> findByIdTopicId(Long topicId);
}
