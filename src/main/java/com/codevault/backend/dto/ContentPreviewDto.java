package com.codevault.backend.dto;

import java.util.UUID;

public record ContentPreviewDto(UUID id, String title, String description, String accessLevel, String contentType) {
}
