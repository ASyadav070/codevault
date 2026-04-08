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
@Table(name = "subscription_plans")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubscriptionPlan {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String name; // e.g., "Professional", "Enterprise"

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private BigDecimal price;

    @Column(nullable = false)
    private String currency; // e.g., "USD"

    @Column(name = "cashfree_plan_id", unique = true, nullable = false)
    private String cashfreePlanId;

    @Column(name = "duration_months")
    private Integer durationMonths; // e.g., 1 for monthly, 12 for yearly

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
