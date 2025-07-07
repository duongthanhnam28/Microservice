package com.thanhnam.orderservice.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.info.License;
import io.swagger.v3.oas.annotations.servers.Server;

@OpenAPIDefinition(
        info = @Info(
                title = "Order API Specification",
                description = "API documentation for Order Service",
                version = "1.0",
                contact = @Contact(
                        name = "Thanh Nam",
                        email = "namtrung28012001@gmail.com",
                        url = ""
                ),
                license = @License(
                        name = "MIT License",
                        url = ""
                ),
                termsOfService = ""
        ),
        servers = {
                @Server(
                        description = "Local ENV",
                        url = "http://localhost:8081"
                ),
                @Server(
                        description = "Dev ENV",
                        url = "https://order-service.dev.com"
                ),
                @Server(
                        description = "Prod ENV",
                        url = "https://order-service.prod.com"
                )
        }
)
public class OpenApiConfig {
}
