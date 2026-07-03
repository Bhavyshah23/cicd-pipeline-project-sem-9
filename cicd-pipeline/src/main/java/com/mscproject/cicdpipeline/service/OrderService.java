package com.mscproject.cicdpipeline.service;

import com.mscproject.cicdpipeline.model.Order;
import com.mscproject.cicdpipeline.model.Product;
import com.mscproject.cicdpipeline.repository.OrderRepository;
import com.mscproject.cicdpipeline.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Optional<Order> getOrderById(Long id) {
        return orderRepository.findById(id);
    }

    public List<Order> getOrdersByUser(Long userId) {
        return orderRepository.findByUserId(userId);
    }

    public List<Order> getOrdersByStatus(String status) {
        return orderRepository.findByStatus(status);
    }

    public Order createOrder(Order order) {
        // Calculate total price
        Product product = productRepository.findById(
            order.getProduct().getId()
        ).orElseThrow(() -> new RuntimeException("Product not found"));

        // Check stock availability
        if (product.getQuantity() < order.getQuantity()) {
            throw new RuntimeException("Insufficient stock! Available: " + product.getQuantity());
        }

        // Calculate total
        order.setTotalPrice(product.getPrice() * order.getQuantity());

        // Reduce product stock
        product.setQuantity(product.getQuantity() - order.getQuantity());
        productRepository.save(product);

        return orderRepository.save(order);
    }

    public Order updateOrderStatus(Long id, String status) {
        return orderRepository.findById(id).map(order -> {
            order.setStatus(status);
            return orderRepository.save(order);
        }).orElseThrow(() -> new RuntimeException("Order not found: " + id));
    }

    public void deleteOrder(Long id) {
        orderRepository.deleteById(id);
    }

    public Double getTotalRevenue() {
        return orderRepository.findAll()
            .stream()
            .filter(o -> !o.getStatus().equals("CANCELLED"))
            .mapToDouble(Order::getTotalPrice)
            .sum();
    }
}