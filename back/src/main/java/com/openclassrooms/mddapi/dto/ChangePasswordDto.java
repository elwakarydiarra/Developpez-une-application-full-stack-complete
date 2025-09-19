package com.openclassrooms.mddapi.dto;

public record ChangePasswordDto(String currentPassword, String newPassword) {
}
