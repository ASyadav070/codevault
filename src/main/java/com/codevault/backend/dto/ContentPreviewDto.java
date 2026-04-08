package com.codevault.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.math.BigDecimal;
import java.util.UUID;

public class ContentPreviewDto {
    private UUID id;
    private String title;
    private String description;
    private String accessLevel;
    private String contentType;
    private BigDecimal price;
    
    @JsonProperty("isPurchased")
    private boolean isPurchased;

    public ContentPreviewDto(UUID id, String title, String description, String accessLevel, String contentType, BigDecimal price) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.accessLevel = accessLevel;
        this.contentType = contentType;
        this.price = price;
        this.isPurchased = false; // Default value
    }

    // Getters
    public UUID getId() { return id; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public String getAccessLevel() { return accessLevel; }
    public String getContentType() { return contentType; }
    public BigDecimal getPrice() { return price; }
    public boolean isPurchased() { return isPurchased; }

    // Setters
    public void setId(UUID id) { this.id = id; }
    public void setTitle(String title) { this.title = title; }
    public void setDescription(String description) { this.description = description; }
    public void setAccessLevel(String accessLevel) { this.accessLevel = accessLevel; }
    public void setContentType(String contentType) { this.contentType = contentType; }
    public void setPrice(BigDecimal price) { this.price = price; }
    public void setPurchased(boolean purchased) { isPurchased = purchased; }
}
