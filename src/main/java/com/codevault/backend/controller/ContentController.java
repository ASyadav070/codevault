package com.codevault.backend.controller;

import com.codevault.backend.dto.ContentPreviewDto;
import com.codevault.backend.model.Content;
import com.codevault.backend.model.User;
import com.codevault.backend.repository.UserPurchaseRepository;
import com.codevault.backend.service.ContentService;
import com.codevault.backend.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
    private final UserPurchaseRepository userPurchaseRepository;

    public ContentController(ContentService contentService, UserService userService, UserPurchaseRepository userPurchaseRepository) {
        this.contentService = contentService;
        this.userService = userService;
        this.userPurchaseRepository = userPurchaseRepository;
    }

    @GetMapping(value = {"", "/"})
    public ResponseEntity<List<ContentPreviewDto>> getAllContent(@AuthenticationPrincipal UserDetails userDetails) {
        List<Content> contents = contentService.getAllContent();
        User user = null;
        if (userDetails != null) {
            user = userService.getUserByEmail(userDetails.getUsername());
        }

        final User finalUser = user;
        List<ContentPreviewDto> previewDtos = contents.stream()
                .map(content -> {
                    ContentPreviewDto dto = new ContentPreviewDto(
                            content.getId(),
                            content.getTitle(),
                            content.getDescription(),
                            content.getAccessLevel().name(),
                            content.getContentType(),
                            content.getPrice()
                    );
                    if (finalUser != null && content.getAccessLevel() == Content.AccessLevel.PREMIUM) {
                        dto.setPurchased(userPurchaseRepository.existsByUserIdAndContentId(finalUser.getId(), content.getId()));
                    }
                    return dto;
                })
                .collect(Collectors.toList());
        return new ResponseEntity<>(previewDtos, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Content> getContentById(@PathVariable UUID id, @AuthenticationPrincipal UserDetails userDetails) {
        Content content = contentService.getContentById(id);

        boolean canAccess = false;

        if (content.getAccessLevel() == Content.AccessLevel.FREE) {
            canAccess = true;
        } else if (userDetails != null) {
            User user = userService.getUserByEmail(userDetails.getUsername());
            if (user != null && userPurchaseRepository.existsByUserIdAndContentId(user.getId(), content.getId())) {
                canAccess = true;
            }
        }

        if (!canAccess) {
            content.setContentUrl(null);
            content.setAccessDenied(true);
        }

        return new ResponseEntity<>(content, HttpStatus.OK);
    }
}
