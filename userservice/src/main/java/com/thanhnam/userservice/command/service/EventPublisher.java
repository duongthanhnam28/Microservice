package com.thanhnam.userservice.command.service;

import com.thanhnam.userservice.command.event.*;
import org.springframework.stereotype.Service;

@Service
public class EventPublisher {
    
    // Vì query side giờ truy cập trực tiếp vào command repositories,
    // nên không cần event handler nữa
    // Có thể mở rộng sau này để publish events ra Kafka hoặc message queue
    
    public void publish(UserCreatedEvent event) {
        // TODO: Có thể publish ra Kafka hoặc message queue sau này
        System.out.println("UserCreatedEvent published: " + event.getMaTaiKhoan());
    }
    
    public void publish(UserUpdatedEvent event) {
        // TODO: Có thể publish ra Kafka hoặc message queue sau này
        System.out.println("UserUpdatedEvent published: " + event.getMaTaiKhoan());
    }
    
    public void publish(UserDeletedEvent event) {
        // TODO: Có thể publish ra Kafka hoặc message queue sau này
        System.out.println("UserDeletedEvent published: " + event.getMaTaiKhoan());
    }
    
    public void publish(UserRoleAssignedEvent event) {
        // TODO: Có thể publish ra Kafka hoặc message queue sau này
        System.out.println("UserRoleAssignedEvent published: " + event.getMaTaiKhoan() + " - " + event.getMaChucVu());
    }
    
    public void publish(UserRoleRemovedEvent event) {
        // TODO: Có thể publish ra Kafka hoặc message queue sau này
        System.out.println("UserRoleRemovedEvent published: " + event.getMaTaiKhoan() + " - " + event.getMaChucVu());
    }
} 