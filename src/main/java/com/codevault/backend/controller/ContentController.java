package com.codevault.backend.controller;

import com.codevault.backend.dto.ContentPreviewDto;
import com.codevault.backend.model.Content;
import com.codevault.backend.model.User;
import com.codevault.backend.service.ContentService;
import com.codevault.backend.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/content")
public class ContentController {

    private final ContentService contentService;
    private final UserService userService;

    public ContentController(ContentService contentService, UserService userService) {
        this.contentService = contentService;
        this.userService = userService;
    }

    @GetMapping("/")
    public ResponseEntity<List<ContentPreviewDto>> getAllContent() {
        List<Content> contents = contentService.getAllContent();
        List<ContentPreviewDto> previewDtos = contents.stream()
                .map(content -> new ContentPreviewDto(
                        content.getId(),
                        content.getTitle(),
                        content.getDescription(),
                        content.getAccessLevel().name(),
                        content.getContentType()
                ))
                .collect(Collectors.toList());
        return new ResponseEntity<>(previewDtos, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Content> getContentById(@PathVariable UUID id, @AuthenticationPrincipal UserDetails userDetails) {
        Content content = contentService.getContentById(id);

        if (content.getAccessLevel() == Content.AccessLevel.FREE) {
            return new ResponseEntity<>(content, HttpStatus.OK);
        } else { // PREMIUM content
            if (userDetails == null) {
                throw new AccessDeniedException("Authentication required to access premium content.");
            }
            User user = userService.getUserByEmail(userDetails.getUsername());
            if (user.getSubscriptionStatus() == User.SubscriptionStatus.ACTIVE) {
                return new ResponseEntity<>(content, HttpStatus.OK);
            } else {
                throw new AccessDeniedException("Premium subscription required to access this content.");
            }
        }
    }
}
