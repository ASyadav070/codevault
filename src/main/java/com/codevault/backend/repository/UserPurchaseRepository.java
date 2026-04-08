package com.codevault.backend.repository;

import com.codevault.backend.model.UserPurchase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserPurchaseRepository extends JpaRepository<UserPurchase, UUID> {
    Optional<UserPurchase> findByUserIdAndContentId(UUID userId, UUID contentId);
    boolean existsByUserIdAndContentId(UUID userId, UUID contentId);
}
