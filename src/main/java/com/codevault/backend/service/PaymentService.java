package com.codevault.backend.service;

import com.codevault.backend.model.Payment;

import java.util.UUID;

public interface PaymentService {
    Payment save(Payment payment);
    Payment getPaymentByCfOrderId(String cfOrderId);
}
