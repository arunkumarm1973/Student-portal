package com.example.demo.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Data
@Document(collection = "canteen_items")
public class CanteenItem {

    @Id
    private String id;

    private String name;
    private double price;
}