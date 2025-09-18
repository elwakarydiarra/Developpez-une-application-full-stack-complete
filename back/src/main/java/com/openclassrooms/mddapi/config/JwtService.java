package com.openclassrooms.mddapi.config;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {
	@Value("${app.jwt.secret}")
	private String secret;
	@Value("${app.jwt.expiration-seconds:86400}")
	private long expiration;

	private Key key() {
		return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
	}

	public String generate(String username, Map<String, Object> claims) {
		return Jwts.builder().setClaims(claims).setSubject(username).setIssuedAt(new Date())
				.setExpiration(new Date(System.currentTimeMillis() + expiration * 1000))
				.signWith(key(), SignatureAlgorithm.HS256).compact();
	}

	public String extractUsername(String token) {
		return parse(token).getBody().getSubject();
	}

	public boolean isTokenValid(String token, UserDetails user) {
		final String subject = extractUsername(token);
		return subject.equals(user.getUsername()) && !parse(token).getBody().getExpiration().before(new Date());
	}

	private Jws<Claims> parse(String token) {
		return Jwts.parserBuilder().setSigningKey(key()).build().parseClaimsJws(token);
	}
}
