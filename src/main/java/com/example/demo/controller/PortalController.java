package com.example.demo.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.Book;
import com.example.demo.model.CanteenItem;
import com.example.demo.model.Event;
import com.example.demo.repository.BookRepository;
import com.example.demo.repository.CanteenItemRepository;
import com.example.demo.repository.EventRepository;

@RestController
@RequestMapping("/api/portal")
public class PortalController {

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private CanteenItemRepository canteenItemRepository;

    @Autowired
    private EventRepository eventRepository;

    @GetMapping("/books")
    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    @PutMapping("/books/reserve/{id}")
    public ResponseEntity<?> reserveBook(@PathVariable String id) {
        Optional<Book> bookData = bookRepository.findById(id);

        if (bookData.isPresent()) {
            Book book = bookData.get();
            if (book.isReserved()) {
                return ResponseEntity.badRequest().body("Book is already reserved");
            }
            book.setReserved(true);
            bookRepository.save(book);
            return ResponseEntity.ok(book);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/canteen")
    public List<CanteenItem> getAllCanteenItems() {
        return canteenItemRepository.findAll();
    }

    @GetMapping("/events")
    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }
}
