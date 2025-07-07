package com.thanhnam.orderservice.command.aggregate;

import com.thanhnam.orderservice.command.command.CreateOrderCommand;
import com.thanhnam.orderservice.command.command.UpdateOrderStatusCommand;
import com.thanhnam.orderservice.command.command.CancelOrderCommand;
import com.thanhnam.orderservice.command.data.Order;
import com.thanhnam.orderservice.command.event.OrderCreatedEvent;
import com.thanhnam.orderservice.command.event.OrderStatusUpdatedEvent;
import com.thanhnam.orderservice.command.event.OrderCancelledEvent;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDate;

@NoArgsConstructor
@Getter
@Setter
public class OrderAggregate {

    private Integer id;
    private Integer userId;
    private Long total;
    private Integer status;
    private LocalDate createdDate;

    // Command Handlers
    public OrderCreatedEvent handle(CreateOrderCommand command) {
        OrderCreatedEvent event = new OrderCreatedEvent();
        event.setUserId(command.getUserId());
        event.setTotal(command.getTotal());
        event.setStatus(1); // PENDING
        event.setCreatedDate(LocalDate.now());
        
        // Update aggregate state
        this.userId = event.getUserId();
        this.total = event.getTotal();
        this.status = event.getStatus();
        this.createdDate = event.getCreatedDate();
        
        return event;
    }

    public OrderStatusUpdatedEvent handle(UpdateOrderStatusCommand command) {
        OrderStatusUpdatedEvent event = new OrderStatusUpdatedEvent();
        event.setOrderId(command.getOrderId());
        event.setStatus(command.getStatus());
        
        // Update aggregate state
        this.status = event.getStatus();
        
        return event;
    }

    public OrderCancelledEvent handle(CancelOrderCommand command) {
        OrderCancelledEvent event = new OrderCancelledEvent();
        event.setOrderId(command.getOrderId());
        event.setStatus(0); // CANCELLED
        
        // Update aggregate state
        this.status = event.getStatus();
        
        return event;
    }

    // Event Sourcing Handlers
    public void on(OrderCreatedEvent event) {
        this.userId = event.getUserId();
        this.total = event.getTotal();
        this.status = event.getStatus();
        this.createdDate = event.getCreatedDate();
    }

    public void on(OrderStatusUpdatedEvent event) {
        this.status = event.getStatus();
    }

    public void on(OrderCancelledEvent event) {
        this.status = event.getStatus();
    }

    // Business logic methods
    public boolean isPending() {
        return this.status != null && this.status == 1;
    }
    
    public boolean isCancelled() {
        return this.status != null && this.status == 0;
    }
    
    public boolean isCompleted() {
        return this.status != null && this.status == 3;
    }

    // Convert to Order entity
    public Order toOrder() {
        Order order = new Order();
        order.setUserId(this.userId);
        order.setTotal(this.total);
        order.setStatus(this.status);
        order.setCreatedDate(this.createdDate);
        return order;
    }

    // Create from Order entity
    public static OrderAggregate fromOrder(Order order) {
        OrderAggregate aggregate = new OrderAggregate();
        aggregate.setUserId(order.getUserId());
        aggregate.setTotal(order.getTotal());
        aggregate.setStatus(order.getStatus());
        aggregate.setCreatedDate(order.getCreatedDate());
        return aggregate;
    }
}
