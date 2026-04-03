package com.codevault.backend.service;

import com.codevault.backend.model.Payment;
import com.codevault.backend.repository.PaymentRepository;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;

    public PaymentServiceImpl(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    @Override
    public Payment save(Payment payment) {
        return paymentRepository.save(payment);
    }

    @Override
    public Payment getPaymentByCfOrderId(String cfOrderId) {
        return paymentRepository.findByCfOrderId(cfOrderId)
                .orElseThrow(() -> new RuntimeException("Payment not found for CashFree Order ID: " + cfOrderId));
    }
}
