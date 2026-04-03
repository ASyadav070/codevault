package com.codevault.backend.service;

import com.codevault.backend.dto.OrderResponse;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;

@Service
public class CashfreeService {

    private static final Logger logger = LoggerFactory.getLogger(CashfreeService.class);

    @Value("${cashfree.app.id}")
    private String appId;

    @Value("${cashfree.secret.key}")
    private String secretKey;

    @Value("${cashfree.environment}")
    private String environment;

    private final WebClient.Builder webClientBuilder;
    private WebClient webClient;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public CashfreeService(WebClient.Builder webClientBuilder) {
        this.webClientBuilder = webClientBuilder;
    }

    @jakarta.annotation.PostConstruct
    void init() {
        this.webClient = webClientBuilder.baseUrl(getBaseUrl()).build();
    }

    private String getBaseUrl() {
        return "SANDBOX".equalsIgnoreCase(environment)
                ? "https://sandbox.cashfree.com/pg"
                : "https://api.cashfree.com/pg";
    }

    public OrderResponse createOrder(String customerId, String customerEmail, String customerPhone, double amount, String orderId) {
        try {
            ObjectNode requestBody = objectMapper.createObjectNode();
            ObjectNode customerDetails = requestBody.putObject("customer_details");
            customerDetails.put("customer_id", customerId);
            customerDetails.put("customer_email", customerEmail);
            customerDetails.put("customer_phone", customerPhone);

            requestBody.put("order_id", orderId);
            requestBody.put("order_amount", amount);
            requestBody.put("order_currency", "INR");

            ObjectNode orderMeta = requestBody.putObject("order_meta");
            orderMeta.put("return_url", "http://localhost:5173/payment/success?order_id={order_id}");

            return webClient.post()
                    .uri("/orders")
                    .header("x-client-id", appId)
                    .header("x-client-secret", secretKey)
                    .header("x-api-version", "2023-08-01")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(Mono.just(objectMapper.writeValueAsString(requestBody)), String.class)
                    .retrieve()
                    .bodyToMono(String.class)
                    .map(response -> {
                        try {
                            JsonNode jsonResponse = objectMapper.readTree(response);
                            return new OrderResponse(
                                    jsonResponse.get("cf_order_id").asText(),
                                    jsonResponse.get("payment_session_id").asText()
                            );
                        } catch (Exception e) {
                            throw new RuntimeException("Failed to parse Cashfree response", e);
                        }
                    })
                    .block();
        } catch (Exception e) {
            throw new RuntimeException("Failed to create Cashfree order", e);
        }
    }

    public boolean verifyPaymentSignature(String orderId, String paymentId, String signature) {
        try {
            String data = orderId + paymentId;
            Mac sha256_HMAC = Mac.getInstance("HmacSHA256");
            SecretKeySpec secret_key = new SecretKeySpec(secretKey.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            sha256_HMAC.init(secret_key);

            String generatedSignature = Base64.getEncoder().encodeToString(sha256_HMAC.doFinal(data.getBytes(StandardCharsets.UTF_8)));

            return generatedSignature.equals(signature);
        } catch (NoSuchAlgorithmException | InvalidKeyException e) {
            logger.error("Error verifying Cashfree payment signature: {}", e.getMessage());
            return false;
        }
    }
}
