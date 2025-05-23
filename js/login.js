// Clock and date
function updateClock() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    document.getElementById('clock').textContent = `${hours}:${minutes}:${seconds} ${ampm}`;
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    document.getElementById('weekday').textContent = weekdays[now.getDay()];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    document.getElementById('date').textContent = `${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;
}
updateClock();
setInterval(updateClock, 1000);

// Fade-in
window.addEventListener("DOMContentLoaded", () => {
    document.body.classList.add("loaded");
    console.log("Login page DOM loaded.");
});

// Transition links
document.querySelectorAll('a.transition-link').forEach(link => {
    link.addEventListener("click", e => {
        e.preventDefault();
        const target = link.href;
        document.body.classList.remove("loaded");
        document.body.classList.add("fade-out");
        setTimeout(() => {
            window.location.href = target;
        }, 500);
    });
});

// Show/hide password
document.getElementById('show-password').addEventListener('change', function() {
    const passwordField = document.getElementById('password');
    if (this.checked) {
        passwordField.type = 'text';
        passwordField.classList.add('password-field');
    } else {
        passwordField.type = 'password';
        passwordField.classList.remove('password-field');
    }
});

// Client-side validation
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePassword(password) {
    return password.length >= 7;
}

// Handle form submission
document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    if (!validateEmail(email)) {
        Swal.fire('Error', 'Please enter a valid email address.', 'error');
        return;
    }

    if (!validatePassword(password)) {
        Swal.fire('Error', 'Password must be at least 7 characters long.', 'error');
        return;
    }

    const formData = new FormData(this);
    try {
        console.log("Submitting login form to /PLP-CLINIC-M-S/php/login.php");
        const response = await fetch('/PLP-CLINIC-M-S/php/login.php', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        console.log("Login response:", data);
        if (data.status === 'success') {
            console.log("Redirecting to:", data.redirect);
            window.location.href = data.redirect;
        } else {
            Swal.fire('Error', data.message, 'error');
        }
    } catch (error) {
        console.error("Fetch error:", error);
        Swal.fire('Error', 'An error occurred while logging in.', 'error');
    }
});