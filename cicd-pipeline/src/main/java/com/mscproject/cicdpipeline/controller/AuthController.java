package com.mscproject.cicdpipeline.controller;

import com.mscproject.cicdpipeline.model.Admin;
import com.mscproject.cicdpipeline.repository.AdminRepository;
import com.mscproject.cicdpipeline.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String password = request.get("password");

        return adminRepository.findByUsername(username)
            .map(admin -> {
                if (passwordEncoder.matches(password, admin.getPassword())) {
                    String token = jwtUtil.generateToken(username);
                    return ResponseEntity.ok(Map.of(
                        "token", token,
                        "username", username,
                        "role", admin.getRole(),
                        "message", "Login successful"
                    ));
                }
                return ResponseEntity.status(401).body(Map.of("error", "Invalid password"));
            })
            .orElse(ResponseEntity.status(401).body(Map.of("error", "Admin not found")));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String password = request.get("password");

        if (adminRepository.findByUsername(username).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Username already exists"));
        }

        Admin admin = new Admin(username, passwordEncoder.encode(password));
        adminRepository.save(admin);
        return ResponseEntity.ok(Map.of("message", "Admin registered successfully"));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentAdmin(
            @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        String username = jwtUtil.extractUsername(token);
        return adminRepository.findByUsername(username)
            .map(admin -> ResponseEntity.ok(Map.of(
                "username", admin.getUsername(),
                "role", admin.getRole()
            )))
            .orElse(ResponseEntity.notFound().build());
    }
}