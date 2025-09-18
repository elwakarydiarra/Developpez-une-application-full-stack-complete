package com.openclassrooms.mddapi.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.openclassrooms.mddapi.entity.Topic;

public interface TopicRepository extends JpaRepository<Topic, Long> {
	Optional<Topic> findByName(String name);
}