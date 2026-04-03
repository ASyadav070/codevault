package com.codevault.backend.service;

import com.codevault.backend.model.User;

import java.util.UUID;

public interface UserService {
    User registerUser(String email, String rawPassword);
    User authenticateUser(String email, String rawPassword);
    User getUserById(UUID id);
    User getUserByEmail(String email);
    User saveUser(User user); // New method to save an existing user
}
