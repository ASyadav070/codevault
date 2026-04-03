package com.codevault.backend.service;

import com.codevault.backend.model.SubscriptionPlan;

import java.util.UUID;

public interface SubscriptionService {
    SubscriptionPlan getSubscriptionPlanById(UUID id);
}
