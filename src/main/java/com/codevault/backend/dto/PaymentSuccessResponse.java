package com.codevault.backend.dto;

public record PaymentSuccessResponse(String status, String message, String token) {
}
