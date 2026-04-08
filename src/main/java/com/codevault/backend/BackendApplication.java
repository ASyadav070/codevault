package com.codevault.backend;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
		// Load .env file variables before Spring context initializes
		Dotenv dotenv = Dotenv.configure()
				.directory("./") // Look for .env in the current directory (project root)
				.load();

		// Set system properties from .env variables
		dotenv.entries().forEach(entry -> System.setProperty(entry.getKey(), entry.getValue()));

		SpringApplication.run(BackendApplication.class, args);
	}

}
    