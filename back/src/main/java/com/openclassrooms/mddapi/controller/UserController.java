package com.openclassrooms.mddapi.controller;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.openclassrooms.mddapi.dto.PasswordUpdateRequest;
import com.openclassrooms.mddapi.dto.ProfileUpdateRequest;
import com.openclassrooms.mddapi.dto.UserDto;
import com.openclassrooms.mddapi.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/me")
@RequiredArgsConstructor
public class UserController {
	private final CurrentUser currentUser;
	private final UserRepository userRepo;
	private final PasswordEncoder encoder;

	@GetMapping
	public UserDto me() {
		var u = currentUser.requireUser();
		return new UserDto(u.getId(), u.getEmail(), u.getUsername());
	}

	@PutMapping
	public UserDto update(@RequestBody ProfileUpdateRequest req) {
		var u = currentUser.requireUser();
		if (req.email() != null)
			u.setEmail(req.email().trim().toLowerCase());
		if (req.username() != null)
			u.setUsername(req.username().trim());
		userRepo.save(u);
		return new UserDto(u.getId(), u.getEmail(), u.getUsername());
	}

	@PutMapping("/password")
	public void changePassword(@RequestBody PasswordUpdateRequest req) {
		var u = currentUser.requireUser();
		if (!encoder.matches(req.currentPassword(), u.getPasswordHash()))
			throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Mot de passe actuel invalide");
		u.setPasswordHash(encoder.encode(req.newPassword()));
		userRepo.save(u);
	}
}
