package com.codevault.backend.service;

import com.codevault.backend.model.Content;
import com.codevault.backend.repository.ContentRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class ContentServiceImpl implements ContentService {

    private final ContentRepository contentRepository;

    public ContentServiceImpl(ContentRepository contentRepository) {
        this.contentRepository = contentRepository;
    }

    @Override
    public List<Content> getAllContent() {
        return contentRepository.findAll();
    }

    @Override
    public Content getContentById(UUID id) {
        return contentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Content not found with ID: " + id));
    }
}
