package com.openclassrooms.mddapi.entity;

import java.time.Instant;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "comments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Comment {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne
	@JoinColumn(name = "author_id", nullable = false)
	private User author;

	@ManyToOne
	@JoinColumn(name = "post_id", nullable = false)
	private Post post;

	@Lob
	@Column(name = "content", nullable = false, columnDefinition = "TEXT")
	private String content;

	@Builder.Default
	@Column(name = "created_at", nullable = false)
	private Instant createdAt = Instant.now();

	public Long getAuthorId() {
		return author != null ? author.getId() : null;
	}

	public Long getPostId() {
		return post != null ? post.getId() : null;
	}
}
