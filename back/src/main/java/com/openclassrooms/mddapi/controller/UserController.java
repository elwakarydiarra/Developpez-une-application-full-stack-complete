package com.openclassrooms.mddapi.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.openclassrooms.mddapi.config.JwtService;
import com.openclassrooms.mddapi.dto.PasswordUpdateRequest;
import com.openclassrooms.mddapi.dto.ProfileUpdateRequest;
import com.openclassrooms.mddapi.dto.UserDto;
import com.openclassrooms.mddapi.entity.User;
import com.openclassrooms.mddapi.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/me")
@RequiredArgsConstructor
public class UserController {

	private final CurrentUser currentUser;
	private final UserRepository userRepo;
	private final PasswordEncoder encoder;
	private final JwtService jwtService;

	/** Petite DTO de réponse pour renvoyer l'user + le nouveau token */
	public record UpdateResponse(UserDto user, String token) {
	}

	@PreAuthorize("isAuthenticated()")
	@GetMapping
	public ResponseEntity<UserDto> me() {
		User u = currentUser.requireUser();
		return ResponseEntity.ok(new UserDto(u.getId(), u.getEmail(), u.getUsername()));
	}

	@PreAuthorize("isAuthenticated()")
	@PutMapping
	public ResponseEntity<?> update(@RequestBody ProfileUpdateRequest req) {
		try {
			if (req == null || req.email() == null || req.username() == null) {
				return ResponseEntity.badRequest().body("email/username manquant");
			}

			User u = currentUser.requireUser();
			String newEmail = req.email().trim().toLowerCase();
			String newUsername = req.username().trim();

			boolean emailTaken = userRepo.existsByEmail(newEmail) && !newEmail.equalsIgnoreCase(u.getEmail());
			if (emailTaken)
				return ResponseEntity.status(HttpStatus.CONFLICT).body("Email déjà utilisé");

			boolean usernameTaken = userRepo.existsByUsername(newUsername) && !newUsername.equals(u.getUsername());
			if (usernameTaken)
				return ResponseEntity.status(HttpStatus.CONFLICT).body("Username déjà utilisé");

			// Mise à jour
			u.setEmail(newEmail);
			u.setUsername(newUsername);
			userRepo.save(u);

			String token = jwtService.generate(u.getUsername(), Map.of());

			return ResponseEntity.ok(new UpdateResponse(new UserDto(u.getId(), u.getEmail(), u.getUsername()), token));
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erreur mise à jour profil");
		}
	}

	@PreAuthorize("isAuthenticated()")
	@PutMapping("/password")
	public ResponseEntity<?> changePassword(@RequestBody PasswordUpdateRequest req) {
		try {
			if (req == null || req.newPassword() == null || req.newPassword().length() < 6) {
				return ResponseEntity.badRequest().body("Nouveau mot de passe trop court (≥6)");
			}

			User u = currentUser.requireUser();


			if (req.currentPassword() != null && !req.currentPassword().isBlank()) {
				if (!encoder.matches(req.currentPassword(), u.getPasswordHash())) {
					return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Mot de passe actuel incorrect");
				}
			}

			u.setPasswordHash(encoder.encode(req.newPassword()));
			userRepo.save(u);

			return ResponseEntity.noContent().build();
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erreur changement de mot de passe");
		}
	}
}
