package com.mscproject.cicdpipeline;

import com.mscproject.cicdpipeline.model.Product;
import com.mscproject.cicdpipeline.repository.ProductRepository;
import com.mscproject.cicdpipeline.service.ProductService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class CicdPipelineApplicationTests {

	@Autowired
	private ProductService productService;

	@Autowired
	private ProductRepository productRepository;

	// Runs before every single test — clears database
	@BeforeEach
	void setUp() {
		productRepository.deleteAll();
	}

	// ── TEST 1 ──────────────────────────────────────
	// Check application loads correctly
	@Test
	void contextLoads() {
		assertNotNull(productService);
		System.out.println("✅ Test 1 Passed: Application context loaded successfully");
	}

	// ── TEST 2 ──────────────────────────────────────
	// Create a product and check it's saved
	@Test
	void testCreateProduct() {
		Product product = new Product(
			"Laptop",
			"Dell Inspiron 15 inch",
			55000.00,
			10
		);

		Product saved = productService.createProduct(product);

		assertNotNull(saved.getId());
		assertEquals("Laptop", saved.getName());
		assertEquals(55000.00, saved.getPrice());
		System.out.println("✅ Test 2 Passed: Product created successfully with ID: " + saved.getId());
	}

	// ── TEST 3 ──────────────────────────────────────
	// Get all products
	@Test
	void testGetAllProducts() {
		// Create 2 products
		productService.createProduct(new Product("Laptop", "Dell", 55000.00, 10));
		productService.createProduct(new Product("Phone", "iPhone 15", 80000.00, 5));

		List<Product> products = productService.getAllProducts();

		assertEquals(2, products.size());
		System.out.println("✅ Test 3 Passed: Retrieved " + products.size() + " products");
	}

	// ── TEST 4 ──────────────────────────────────────
	// Get product by ID
	@Test
	void testGetProductById() {
		Product saved = productService.createProduct(
			new Product("Tablet", "Samsung Tab S9", 45000.00, 8)
		);

		Optional<Product> found = productService.getProductById(saved.getId());

		assertTrue(found.isPresent());
		assertEquals("Tablet", found.get().getName());
		System.out.println("✅ Test 4 Passed: Product found by ID: " + saved.getId());
	}

	// ── TEST 5 ──────────────────────────────────────
	// Get product by wrong ID — should return empty
	@Test
	void testGetProductByIdNotFound() {
		Optional<Product> found = productService.getProductById(9999L);

		assertFalse(found.isPresent());
		System.out.println("✅ Test 5 Passed: Correctly returned empty for invalid ID");
	}

	// ── TEST 6 ──────────────────────────────────────
	// Update a product
	@Test
	void testUpdateProduct() {
		Product saved = productService.createProduct(
			new Product("Laptop", "Dell", 55000.00, 10)
		);

		Product updated = new Product(
			"Gaming Laptop",
			"Asus ROG",
			95000.00,
			3
		);

		Product result = productService.updateProduct(saved.getId(), updated);

		assertEquals("Gaming Laptop", result.getName());
		assertEquals(95000.00, result.getPrice());
		assertEquals(3, result.getQuantity());
		System.out.println("✅ Test 6 Passed: Product updated successfully");
	}

	// ── TEST 7 ──────────────────────────────────────
	// Delete a product
	@Test
	void testDeleteProduct() {
		Product saved = productService.createProduct(
			new Product("Headphones", "Sony WH1000XM5", 25000.00, 15)
		);

		productService.deleteProduct(saved.getId());

		Optional<Product> found = productService.getProductById(saved.getId());
		assertFalse(found.isPresent());
		System.out.println("✅ Test 7 Passed: Product deleted successfully");
	}

	// ── TEST 8 ──────────────────────────────────────
	// Search product by name
	@Test
	void testSearchByName() {
		productService.createProduct(new Product("Laptop", "Dell", 55000.00, 10));
		productService.createProduct(new Product("Gaming Laptop", "Asus", 95000.00, 3));
		productService.createProduct(new Product("Phone", "iPhone", 80000.00, 5));

		List<Product> results = productService.searchByName("laptop");

		assertEquals(2, results.size());
		System.out.println("✅ Test 8 Passed: Found " + results.size() + " products with 'laptop'");
	}

	// ── TEST 9 ──────────────────────────────────────
	// Product name cannot be null
	@Test
	void testProductFields() {
		Product product = new Product(
			"Smartwatch",
			"Apple Watch Series 9",
			35000.00,
			20
		);

		assertNotNull(product.getName());
		assertNotNull(product.getDescription());
		assertNotNull(product.getPrice());
		assertNotNull(product.getQuantity());
		System.out.println("✅ Test 9 Passed: All product fields are valid");
	}

	// ── TEST 10 ──────────────────────────────────────
	// Database starts empty before each test
	@Test
	void testDatabaseStartsEmpty() {
		List<Product> products = productService.getAllProducts();
		assertEquals(0, products.size());
		System.out.println("✅ Test 10 Passed: Database is clean before each test");
	}
}