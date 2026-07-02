package com.mscproject.cicdpipeline.service;

import com.mscproject.cicdpipeline.model.Category;
import com.mscproject.cicdpipeline.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public Optional<Category> getCategoryById(Long id) {
        return categoryRepository.findById(id);
    }

    public Category createCategory(Category category) {
        if (categoryRepository.existsByName(category.getName())) {
            throw new RuntimeException("Category already exists: " + category.getName());
        }
        return categoryRepository.save(category);
    }

    public Category updateCategory(Long id, Category updated) {
        return categoryRepository.findById(id).map(category -> {
            category.setName(updated.getName());
            category.setDescription(updated.getDescription());
            return categoryRepository.save(category);
        }).orElseThrow(() -> new RuntimeException("Category not found: " + id));
    }

    public void deleteCategory(Long id) {
        categoryRepository.deleteById(id);
    }
}