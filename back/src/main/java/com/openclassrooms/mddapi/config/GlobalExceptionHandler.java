package com.openclassrooms.mddapi.config;

import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler(MethodArgumentNotValidException.class)
	@ResponseStatus(HttpStatus.BAD_REQUEST)
	public Map<String, Object> handleValidation(MethodArgumentNotValidException ex) {
		var errors = ex.getBindingResult().getFieldErrors().stream().collect(Collectors.groupingBy(e -> e.getField(),
				Collectors.mapping(e -> e.getDefaultMessage(), Collectors.toList())));
		return Map.of("message", "Validation error", "errors", errors);
	}
}
