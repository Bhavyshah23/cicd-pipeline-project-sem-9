package com.mscproject.cicdpipeline.service;

import com.mscproject.cicdpipeline.model.User;
import com.mscproject.cicdpipeline.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public User createUser(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already exists: " + user.getEmail());
        }
        return userRepository.save(user);
    }

    public User updateUser(Long id, User updated) {
        return userRepository.findById(id).map(user -> {
            user.setName(updated.getName());
            user.setPhone(updated.getPhone());
            user.setAddress(updated.getAddress());
            return userRepository.save(user);
        }).orElseThrow(() -> new RuntimeException("User not found: " + id));
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}