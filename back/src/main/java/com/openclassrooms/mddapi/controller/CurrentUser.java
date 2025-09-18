package com.openclassrooms.mddapi.controller;

import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import com.openclassrooms.mddapi.entity.User;
import com.openclassrooms.mddapi.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class CurrentUser {
	private final UserRepository userRepo;

	public User requireUser() {
		var ctx = SecurityContextHolder.getContext();
		var auth = ctx.getAuthentication();

		if (auth == null || !auth.isAuthenticated()) {
			throw new AuthenticationCredentialsNotFoundException("Utilisateur non authentifié");
		}

		String username = auth.getName();
		return userRepo.findByUsername(username).orElseThrow();
	}
}
