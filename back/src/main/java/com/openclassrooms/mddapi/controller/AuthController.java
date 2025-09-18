package com.openclassrooms.mddapi.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.openclassrooms.mddapi.config.JwtService;
import com.openclassrooms.mddapi.dto.LoginRequest;
import com.openclassrooms.mddapi.dto.SignupRequest;
import com.openclassrooms.mddapi.entity.User;
import com.openclassrooms.mddapi.repository.UserRepository;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
	private final AuthenticationManager authManager;
	private final JwtService jwtService;
	private final PasswordEncoder encoder;
	private final UserRepository userRepo;

	@PostMapping("/signup")
	public Map<String, String> signup(@Valid @RequestBody SignupRequest req) {
		if (userRepo.existsByEmail(req.email()) || userRepo.existsByUsername(req.username())) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "Email ou username déjà utilisé");
		}
		var u = new User();
		u.setEmail(req.email().trim().toLowerCase());
		u.setUsername(req.username().trim());
		u.setPasswordHash(encoder.encode(req.password()));
		userRepo.save(u);
		String token = jwtService.generate(u.getUsername(), Map.of());
		return Map.of("token", token);
	}

	@PostMapping("/login")
	public Map<String, String> login(@Valid @RequestBody LoginRequest req) {

		var auth = authManager.authenticate(new UsernamePasswordAuthenticationToken(req.username(), req.password()));
		String canonicalUsername = auth.getName();
		String token = jwtService.generate(canonicalUsername, Map.of());
		return Map.of("token", token);
	}
}
