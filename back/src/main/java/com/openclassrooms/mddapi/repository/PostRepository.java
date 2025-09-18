package com.openclassrooms.mddapi.repository;

import java.util.Collection;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.openclassrooms.mddapi.entity.Post;

public interface PostRepository extends JpaRepository<Post, Long> {

	List<Post> findAllByOrderByCreatedAtDesc();

	List<Post> findAllByOrderByCreatedAtAsc();

	List<Post> findByTopicIdInOrderByCreatedAtDesc(Collection<Long> topicIds);

	List<Post> findByTopicIdInOrderByCreatedAtAsc(Collection<Long> topicIds);
}
