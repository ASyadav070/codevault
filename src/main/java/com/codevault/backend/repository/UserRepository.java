package com.codevault.backend.repository;

import com.codevault.backend.model.User; // Assuming your User entity is in this package
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID; // Import UUID

/**
 * Spring Data JPA repository for the User entity.
 */
@Repository
public interface UserRepository extends JpaRepository<User, UUID> { // Change Long to UUID
    Optional<User> findByEmail(String email);
}