package com.codevault.backend.service;

import com.codevault.backend.model.Content;

import java.util.List;
import java.util.UUID;

public interface ContentService {
    List<Content> getAllContent();
    Content getContentById(UUID id);
}
