package com.example.demospringsecurity.repository;

import com.example.demospringsecurity.model.Category;
import com.example.demospringsecurity.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {
    boolean existsByName(String name);
    List<Product> findByCategory(Category category);
}
