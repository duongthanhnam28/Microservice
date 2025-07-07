package com.thanhnam.userservice.config;

import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@Configuration
@EnableJpaRepositories(basePackages = {
        "com.thanhnam.userservice.command.data",
        "com.thanhnam.userservice.query.repository"
})
@EntityScan(basePackages = {
        "com.thanhnam.userservice.command.data",
        "com.thanhnam.userservice.query.model",
        "org.axonframework.eventhandling.tokenstore",
        "org.axonframework.modelling.saga.repository.jpa",
        "org.axonframework.eventsourcing.eventstore.jpa"
})
public class JpaConfig {
}