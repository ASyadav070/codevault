package com.codevault.backend.controller;

import com.codevault.backend.dto.AuthRequest;
import com.codevault.backend.dto.AuthResponse;
import com.codevault.backend.dto.UserProfileResponse;
import com.codevault.backend.model.User;
import com.codevault.backend.security.JwtTokenProvider;
import com.codevault.backend.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;


@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserService userService;

    public AuthController(AuthenticationManager authenticationManager, JwtTokenProvider jwtTokenProvider, UserService userService) {
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> registerUser(@RequestBody AuthRequest authRequest) {
        User registeredUser = userService.registerUser(authRequest.email(), authRequest.password());
        String jwt = jwtTokenProvider.generateToken(registeredUser);
        return new ResponseEntity<>(new AuthResponse(
                jwt,
                registeredUser.getId(),
                registeredUser.getEmail(),
                registeredUser.getRole().name(),
                registeredUser.getSubscriptionStatus().name()
        ), HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> authenticateUser(@RequestBody AuthRequest authRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(authRequest.email(), authRequest.password())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Fetch the full User object to get role and subscription status
        User user = userService.getUserByEmail(authRequest.email());
        String jwt = jwtTokenProvider.generateToken(user);

        return new ResponseEntity<>(new AuthResponse(
                jwt,
                user.getId(),
                user.getEmail(),
                user.getRole().name(),
                user.getSubscriptionStatus().name()
        ), HttpStatus.OK);
    }

    @GetMapping("/profile")
    public ResponseEntity<UserProfileResponse> getUserProfile(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        // The username in UserDetails is the email in our CustomUserDetailsService
        User user = userService.getUserByEmail(userDetails.getUsername());
        UserProfileResponse profileResponse = new UserProfileResponse(
                user.getId(),
                user.getEmail(),
                user.getRole().name(),
                user.getSubscriptionStatus().name()
        );
        return new ResponseEntity<>(profileResponse, HttpStatus.OK);
    }
}
