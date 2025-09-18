package com.openclassrooms.mddapi.service;

import java.util.Map;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.openclassrooms.mddapi.config.JwtService;
import com.openclassrooms.mddapi.dto.AuthRequest;
import com.openclassrooms.mddapi.dto.AuthResponse;
import com.openclassrooms.mddapi.dto.SignupRequest;
import com.openclassrooms.mddapi.entity.User;
import com.openclassrooms.mddapi.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

	private final UserRepository userRepo;
	private final PasswordEncoder encoder;
	private final AuthenticationManager authManager;
	private final JwtService jwtService;
	private final AppUserDetailsService userDetailsService;

	public AuthResponse signup(SignupRequest req) {
		if (userRepo.existsByEmail(req.email()))
			throw new IllegalArgumentException("Email déjà utilisé");
		if (userRepo.existsByUsername(req.username()))
			throw new IllegalArgumentException("Username déjà utilisé");

		User u = User.builder().email(req.email()).username(req.username()).passwordHash(encoder.encode(req.password()))
				.build();

		u = userRepo.save(u);

		String token = jwtService.generate(u.getUsername(), Map.of("uid", u.getId()));
		return new AuthResponse(token);
	}

	public AuthResponse login(AuthRequest req) {

		authManager.authenticate(new UsernamePasswordAuthenticationToken(req.identifier(), req.password()));

		String username = userRepo.findByUsername(req.identifier()).or(() -> userRepo.findByEmail(req.identifier()))
				.orElseThrow(() -> new IllegalArgumentException("Utilisateur non trouvé")).getUsername();

		User u = userRepo.findByUsername(username).orElseThrow();

		String token = jwtService.generate(username, Map.of("uid", u.getId()));
		return new AuthResponse(token);
	}
}
