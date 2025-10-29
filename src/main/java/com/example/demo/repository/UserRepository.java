package com.example.demo.repository;

import java.util.Optional; // Import your User model

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.model.User;

@Repository
public interface UserRepository extends MongoRepository<User, String> {

    // Spring Data MongoDB will automatically create this method
    // just from the name! It will find a User by their username.
    Optional<User> findByUsername(String username);

    // We can also add this for checking if an email is already used
    Boolean existsByUsername(String username);
    Boolean existsByEmail(String email);
}