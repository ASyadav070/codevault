package com.codevault.backend.dto;

public record PaymentVerificationRequest(String cfOrderId, String cfPaymentId, String cfSignature) {
}
