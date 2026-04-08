package com.codevault.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "content")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Content {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private String contentUrl; // URL to the actual content (e.g., video, article)

    @Enumerated(EnumType.STRING)
    @Column(name = "access_level", nullable = false)
    private AccessLevel accessLevel; // e.g., FREE, PREMIUM

    @Column(name = "content_type", nullable = false)
    private String contentType; // e.g., VIDEO, ARTICLE, QUIZ

    @Column(precision = 10, scale = 2)
    private BigDecimal price;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public enum AccessLevel {
        FREE, PREMIUM
    }
    @Transient // This tells Hibernate NOT to look for this in the Supabase database
    private boolean accessDenied;

    public boolean isAccessDenied() {
        return accessDenied;
    }

    public void setAccessDenied(boolean accessDenied) {
        this.accessDenied = accessDenied;
    }
}
