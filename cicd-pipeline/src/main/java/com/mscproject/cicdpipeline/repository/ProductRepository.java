package com.mscproject.cicdpipeline.repository;

import com.mscproject.cicdpipeline.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    // Find products by name (custom query)
    List<Product> findByNameContainingIgnoreCase(String name);

    // Find products below a certain price
    List<Product> findByPriceLessThan(Double price);
}