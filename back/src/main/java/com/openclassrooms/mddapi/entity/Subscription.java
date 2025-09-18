package com.openclassrooms.mddapi.entity;

import java.io.Serializable;
import java.time.Instant;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "subscriptions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Subscription {

	@EmbeddedId
	private Id id;

	@Builder.Default
	@Column(name = "created_at", nullable = false)
	private Instant createdAt = Instant.now();

	@Embeddable
	@Getter
	@Setter
	@NoArgsConstructor
	@AllArgsConstructor
	@EqualsAndHashCode
	public static class Id implements Serializable {
		private static final long serialVersionUID = 1L;

		@Column(name = "user_id", nullable = false)
		private Long userId;

		@Column(name = "topic_id", nullable = false)
		private Long topicId;
	}
}
