package com.mscproject.cicdpipeline.component;

import com.mscproject.cicdpipeline.model.Admin;
import com.mscproject.cicdpipeline.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (adminRepository.findByUsername("admin").isEmpty()) {
            Admin admin = new Admin("admin", passwordEncoder.encode("admin123"));
            adminRepository.save(admin);
            System.out.println("✅ Default admin created: admin / admin123");
        }
    }
}