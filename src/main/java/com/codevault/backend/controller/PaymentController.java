package com.codevault.backend.controller;

import com.codevault.backend.dto.OrderRequest;
import com.codevault.backend.dto.OrderResponse;
import com.codevault.backend.dto.PaymentSuccessResponse;
import com.codevault.backend.dto.PaymentVerificationRequest;
import com.codevault.backend.model.Payment;
import com.codevault.backend.model.SubscriptionPlan;
import com.codevault.backend.model.User;
import com.codevault.backend.repository.PaymentRepository;
import com.codevault.backend.security.JwtTokenProvider;
import com.codevault.backend.service.CashfreeService;
import com.codevault.backend.service.SubscriptionService;
import com.codevault.backend.service.UserService;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/payments")
public class PaymentController {

    private static final Logger logger = LoggerFactory.getLogger(PaymentController.class);

    private final CashfreeService cashfreeService;
    private final SubscriptionService subscriptionService;
    private final UserService userService;
    private final PaymentRepository paymentRepository; // Use repository directly for webhook
    private final JwtTokenProvider jwtTokenProvider;

    public PaymentController(CashfreeService cashfreeService,
                             SubscriptionService subscriptionService,
                             UserService userService,
                             PaymentRepository paymentRepository,
                             JwtTokenProvider jwtTokenProvider) {
        this.cashfreeService = cashfreeService;
        this.subscriptionService = subscriptionService;
        this.userService = userService;
        this.paymentRepository = paymentRepository;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestBody OrderRequest orderRequest,
                                         @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return new ResponseEntity<>("Authentication required", HttpStatus.UNAUTHORIZED);
        }

        try {
            User user = userService.getUserByEmail(userDetails.getUsername());
            SubscriptionPlan plan = subscriptionService.getSubscriptionPlanById(orderRequest.planId());

            String orderId = UUID.randomUUID().toString();
            double amount = plan.getPrice().doubleValue();

            OrderResponse cashfreeOrder = cashfreeService.createOrder(
                    user.getId().toString(),
                    user.getEmail(),
                    user.getPhoneNumber() != null ? user.getPhoneNumber() : "9999999999", // Use real or placeholder phone
                    amount,
                    orderId
            );

            // Save pending payment record
            Payment pendingPayment = Payment.builder()
                    .user(user)
                    .subscriptionPlan(plan)
                    .amount(plan.getPrice())
                    .currency(plan.getCurrency())
                    .cfOrderId(orderId)
                    .status(Payment.PaymentStatus.PENDING)
                    .build();
            paymentRepository.save(pendingPayment);

            return new ResponseEntity<>(cashfreeOrder, HttpStatus.OK);

        } catch (RuntimeException e) {
            logger.error("Error creating order: ", e);
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/verify-payment")
    public ResponseEntity<?> verifyPayment(@RequestBody PaymentVerificationRequest verificationRequest,
                                           @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return new ResponseEntity<>("Authentication required", HttpStatus.UNAUTHORIZED);
        }

        try {
            boolean isVerified = cashfreeService.verifyPaymentSignature(
                    verificationRequest.cfOrderId(),
                    verificationRequest.cfPaymentId(),
                    verificationRequest.cfSignature()
            );

            if (isVerified) {
                Payment payment = paymentRepository.findByCfOrderId(verificationRequest.cfOrderId())
                        .orElseThrow(() -> new RuntimeException("Payment not found"));
                payment.setStatus(Payment.PaymentStatus.SUCCESS);
                payment.setCfPaymentId(verificationRequest.cfPaymentId());
                payment.setCfSignature(verificationRequest.cfSignature());
                paymentRepository.save(payment);

                User user = payment.getUser();
                user.setSubscriptionStatus(User.SubscriptionStatus.ACTIVE);
                userService.saveUser(user);

                String newToken = jwtTokenProvider.generateToken(user);

                return new ResponseEntity<>(new PaymentSuccessResponse(
                        "SUCCESS", "Payment verified and subscription activated.", newToken
                ), HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Payment verification failed.", HttpStatus.BAD_REQUEST);
            }
        } catch (RuntimeException e) {
            logger.error("Error verifying payment: ", e);
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/webhook")
    public ResponseEntity<String> handleWebhook(@RequestBody String payload,
                                                @RequestHeader(value = "x-webhook-signature", required = false) String signature) {
        logger.info("--- CashFree Webhook Received ---");
        logger.info("Payload: {}", payload);
        logger.info("Signature: {}", signature);

        // TEMPORARY: Bypassing signature verification for debugging
        boolean isVerified = true; // cashfreeService.verifyWebhookSignature(payload, signature);
        logger.warn("!!! TEMPORARY: Webhook signature verification is currently BYPASSED for testing. !!!");


        if (isVerified) {
            try {
                JSONObject payloadJson = new JSONObject(payload);
                JSONObject data = payloadJson.getJSONObject("data");
                JSONObject order = data.getJSONObject("order");
                JSONObject payment = data.getJSONObject("payment");

                String orderId = order.getString("order_id");
                String paymentStatus = payment.getString("payment_status");

                logger.info("Parsed Webhook Data: order_id={}, payment_status={}", orderId, paymentStatus);

                if ("SUCCESS".equals(paymentStatus)) {
                    logger.info("Payment status is SUCCESS. Attempting to update database.");

                    Optional<Payment> paymentOptional = paymentRepository.findByCfOrderId(orderId);
                    if (paymentOptional.isPresent()) {
                        logger.info("Order found in DB with cfOrderId: {}", orderId);
                        Payment paymentRecord = paymentOptional.get();

                        if (paymentRecord.getStatus() == Payment.PaymentStatus.SUCCESS) {
                            logger.warn("Payment for order {} is already marked as SUCCESS. Ignoring webhook.", orderId);
                            return new ResponseEntity<>("Already processed", HttpStatus.OK);
                        }

                        paymentRecord.setStatus(Payment.PaymentStatus.SUCCESS);
                        // FIX: Read cf_payment_id as Long and convert to String
                        long cfPaymentIdLong = payment.getLong("cf_payment_id");
                        paymentRecord.setCfPaymentId(String.valueOf(cfPaymentIdLong));
                        paymentRepository.save(paymentRecord);
                        logger.info("Payment record updated to SUCCESS for orderId: {}", orderId);

                        User user = paymentRecord.getUser();
                        user.setSubscriptionStatus(User.SubscriptionStatus.ACTIVE);
                        user.setRole(User.Role.PREMIUM); // Upgrading user role
                        userService.saveUser(user);
                        logger.info("User {} upgraded to PREMIUM.", user.getEmail());

                        return new ResponseEntity<>("Webhook processed successfully", HttpStatus.OK);
                    } else {
                        logger.error("CRITICAL: Order with cfOrderId {} not found in the database.", orderId);
                        return new ResponseEntity<>("Order not found", HttpStatus.NOT_FOUND);
                    }
                } else {
                    logger.warn("Webhook received for non-SUCCESS payment status: {}. No action taken.", paymentStatus);
                    return new ResponseEntity<>("Non-SUCCESS status", HttpStatus.OK);
                }
            } catch (Exception e) {
                logger.error("Error processing webhook payload: ", e);
                return new ResponseEntity<>("Error processing payload", HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } else {
            logger.error("Webhook signature verification failed.");
            return new ResponseEntity<>("Invalid signature", HttpStatus.BAD_REQUEST);
        }
    }
}
