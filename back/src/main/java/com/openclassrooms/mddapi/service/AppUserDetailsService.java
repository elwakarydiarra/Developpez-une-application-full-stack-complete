package com.openclassrooms.mddapi.service;

import java.util.List;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.openclassrooms.mddapi.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AppUserDetailsService implements UserDetailsService {

	private final UserRepository repo;

	@Override
	public UserDetails loadUserByUsername(String login) throws UsernameNotFoundException {
		var u = repo.findByUsername(login).or(() -> repo.findByEmail(login.toLowerCase()))
				.orElseThrow(() -> new UsernameNotFoundException("User not found"));

		return org.springframework.security.core.userdetails.User.withUsername(u.getUsername())
				.password(u.getPasswordHash()).authorities(List.of(new SimpleGrantedAuthority("ROLE_USER")))

				.build();
	}
}
