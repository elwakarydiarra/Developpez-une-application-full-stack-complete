package com.openclassrooms.mddapi.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.openclassrooms.mddapi.dto.UserDto;
import com.openclassrooms.mddapi.dto.UserUpdateRequest;
import com.openclassrooms.mddapi.entity.User;
import com.openclassrooms.mddapi.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {
	private final UserRepository userRepo;
	private final PasswordEncoder encoder;

	public UserDto getByUsername(String username) {
		User u = userRepo.findByUsername(username).orElseThrow();
		return new UserDto(u.getId(), u.getEmail(), u.getUsername());
	}

	public UserDto update(String username, UserUpdateRequest req) {
		User u = userRepo.findByUsername(username).orElseThrow();
		if (req.email() != null && !req.email().isBlank())
			u.setEmail(req.email());
		if (req.username() != null && !req.username().isBlank())
			u.setUsername(req.username());
		if (req.password() != null && !req.password().isBlank())
			u.setPasswordHash(encoder.encode(req.password()));
		u = userRepo.save(u);
		return new UserDto(u.getId(), u.getEmail(), u.getUsername());
	}
}