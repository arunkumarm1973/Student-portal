document.addEventListener("DOMContentLoaded", () => {

    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");
    const showRegisterLink = document.getElementById("show-register");
    const showLoginLink = document.getElementById("show-login");

    showRegisterLink.addEventListener("click", (e) => {
        e.preventDefault();
        loginForm.style.display = "none";
        registerForm.style.display = "block";
    });

    showLoginLink.addEventListener("click", (e) => {
        e.preventDefault();
        loginForm.style.display = "block";
        registerForm.style.display = "none";
    });

    const loginMessage = document.getElementById("login-message");
    const registerMessage = document.getElementById("register-message");

    const loginBtn = document.getElementById("login-btn");
    loginBtn.addEventListener("click", async () => {
        const username = document.getElementById("login-username").value;
        const password = document.getElementById("login-password").value;
        loginMessage.textContent = "";

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const result = await response.text();
                loginMessage.textContent = result;
                loginMessage.className = "success";
                
                window.location.href = "portal.html"; 
            } else {
                const error = await response.text();
                loginMessage.textContent = error;
                loginMessage.className = "error";
            }
        } catch (error) {
            loginMessage.textContent = "Network error. Is the server running?";
            loginMessage.className = "error";
        }
    });

    const registerBtn = document.getElementById("register-btn");
    registerBtn.addEventListener("click", async () => {
        const username = document.getElementById("reg-username").value;
        const email = document.getElementById("reg-email").value;
        const password = document.getElementById("reg-password").value;
        registerMessage.textContent = "";

        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, email, password }),
            });

            if (response.ok) {
                const result = await response.text();
                registerMessage.textContent = result + " Please login.";
                registerMessage.className = "success";
                
                loginForm.style.display = "block";
                registerForm.style.display = "none";
            } else {
                const error = await response.text();
                registerMessage.textContent = error;
                registerMessage.className = "error";
            }
        } catch (error) {
            registerMessage.textContent = "Network error. Is the server running?";
            registerMessage.className = "error";
        }
    });
});