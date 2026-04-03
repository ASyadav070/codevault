package com.codevault.backend.service;

import com.codevault.backend.model.SubscriptionPlan;
import com.codevault.backend.repository.SubscriptionPlanRepository;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class SubscriptionServiceImpl implements SubscriptionService {

    private final SubscriptionPlanRepository subscriptionPlanRepository;

    public SubscriptionServiceImpl(SubscriptionPlanRepository subscriptionPlanRepository) {
        this.subscriptionPlanRepository = subscriptionPlanRepository;
    }

    @Override
    public SubscriptionPlan getSubscriptionPlanById(UUID id) {
        return subscriptionPlanRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Subscription Plan not found with ID: " + id));
    }
}
