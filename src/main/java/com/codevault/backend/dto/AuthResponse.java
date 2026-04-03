package com.codevault.backend.dto;

import java.util.UUID;

public record AuthResponse(String token, UUID userId, String email, String role, String subscriptionStatus) {
}
