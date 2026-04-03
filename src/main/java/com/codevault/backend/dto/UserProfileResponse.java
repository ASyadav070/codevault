package com.codevault.backend.dto;

import java.util.UUID;

public record UserProfileResponse(
    UUID id,
    String email,
    String role,
    String subscriptionStatus
) {}