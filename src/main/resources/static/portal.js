document.addEventListener("DOMContentLoaded", () => {
    
    const API_BASE_URL = "http://localhost:8081/api/portal";

    const bookList = document.getElementById("book-list");
    const canteenList = document.getElementById("canteen-list");
    const eventList = document.getElementById("event-list");
    
    const billList = document.getElementById("bill-list");
    const totalAmountEl = document.getElementById("total-amount");
    const payBtn = document.getElementById("pay-btn");
    
    let currentBill = [];

    const tabs = document.querySelectorAll(".tab-link");
    const contents = document.querySelectorAll(".tab-content");

    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            tabs.forEach(t => t.classList.remove("active"));
            contents.forEach(c => c.classList.remove("active"));
            tab.classList.add("active");
            document.getElementById(tab.dataset.tab).classList.add("active");
        });
    });

    document.getElementById("logout-btn").addEventListener("click", () => {
        window.location.href = "index.html"; 
    });

    async function loadBooks() {
        try {
            const response = await fetch(`${API_BASE_URL}/books`);
            if (!response.ok) throw new Error("Network response was not ok");
            const books = await response.json();

            bookList.innerHTML = ""; 
            books.forEach(book => {
                const card = document.createElement("div");
                card.className = "book-card";
                const status = book.reserved ? "Reserved" : "Available";
                const statusClass = book.reserved ? "status-reserved" : "status-available";

                card.innerHTML = `
                    <h3>${book.title}</h3>
                    <p>by ${book.author}</p>
                    <p>Status: <span class="${statusClass}">${status}</span></p>
                    <button class="reserve-btn" data-id="${book.id}" ${book.reserved ? "disabled" : ""}>
                        ${book.reserved ? "Reserved" : "Reserve"}
                    </button>
                `;
                bookList.appendChild(card);
            });
            addReserveButtonListeners();
        } catch (error) {
            bookList.innerHTML = "<p class='error'>Failed to load books.</p>";
            console.error("Error loading books:", error);
        }
    }

    async function loadCanteenItems() {
        try {
            const response = await fetch(`${API_BASE_URL}/canteen`);
            if (!response.ok) throw new Error("Network response was not ok");
            const items = await response.json();

            canteenList.innerHTML = ""; 
            items.forEach(item => {
                const card = document.createElement("div");
                card.className = "canteen-card";
                card.innerHTML = `
                    <h3>${item.name}</h3>
                    <p class="price">Price: ₹${item.price.toFixed(2)}</p>
                    <button class="add-to-bill-btn" 
                        data-name="${item.name}" 
                        data-price="${item.price}">
                        Add to Bill
                    </button>
                `;
                canteenList.appendChild(card);
            });
            addCanteenButtonListeners();
        } catch (error) {
            canteenList.innerHTML = "<p class='error'>Failed to load canteen menu.</p>";
            console.error("Error loading canteen items:", error);
        }
    }

    async function loadEvents() {
        try {
            const response = await fetch(`${API_BASE_URL}/events`);
            if (!response.ok) throw new Error("Network response was not ok");
            const events = await response.json();

            eventList.innerHTML = ""; 
            events.forEach(event => {
                const card = document.createElement("div");
                card.className = "event-card";
                card.innerHTML = `
                    <h3>${event.title}</h3>
                    <p><strong>Date:</strong> ${event.date}</p>
                    <p>${event.description}</p>
                `;
                eventList.appendChild(card);
            });
        } catch (error)
        {
            eventList.innerHTML = "<p class='error'>Failed to load events.</p>";
            console.error("Error loading events:", error);
        }
    }

    function addReserveButtonListeners() {
        const reserveButtons = document.querySelectorAll(".reserve-btn");
        reserveButtons.forEach(button => {
            button.addEventListener("click", async () => {
                const bookId = button.dataset.id;
                try {
                    const response = await fetch(`${API_BASE_URL}/books/reserve/${bookId}`, {
                        method: "PUT"
                    });
                    if (response.ok) {
                        loadBooks();
                    } else {
                        const error = await response.text();
                        alert("Failed to reserve book: " + error);
                    }
                } catch (error) {
                    alert("Network error: Could not reserve book.");
                    console.error("Error reserving book:", error);
                }
            });
        });
    }
    
    function addCanteenButtonListeners() {
        const canteenButtons = document.querySelectorAll(".add-to-bill-btn");
        canteenButtons.forEach(button => {
            button.addEventListener("click", () => {
                const item = {
                    name: button.dataset.name,
                    price: parseFloat(button.dataset.price)
                };
                
                currentBill.push(item);
                
                updateBillDisplay();
            });
        });
    }

    function updateBillDisplay() {
        billList.innerHTML = "";
        
        if (currentBill.length === 0) {
            billList.innerHTML = "<p class='empty-bill'>Your bill is empty.</p>";
            totalAmountEl.textContent = "₹0.00";
            return;
        }

        let total = 0;
        
        currentBill.forEach(item => {
            const li = document.createElement("div");
            li.className = "bill-item";
            li.innerHTML = `
                <span>${item.name}</span>
                <span>₹${item.price.toFixed(2)}</span>
            `;
            billList.appendChild(li);
            
            total += item.price;
        });

        totalAmountEl.textContent = `₹${total.toFixed(2)}`;
    }
    
    payBtn.addEventListener("click", () => {
        if (currentBill.length === 0) {
            alert("Your bill is empty!");
            return;
        }
        
        const total = currentBill.reduce((sum, item) => sum + item.price, 0);
        
        alert(`Payment of ₹${total.toFixed(2)} received!\nThank you for your order.`);
        
        currentBill = [];
        updateBillDisplay();
    });

    loadBooks();
    loadCanteenItems();
    loadEvents();
});