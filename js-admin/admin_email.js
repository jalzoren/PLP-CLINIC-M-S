document.addEventListener('DOMContentLoaded', () => {
    console.log("admin_email.js is running");

    const emailElement = document.querySelector('#admin-email');
    if (!emailElement) {
        console.error("Admin email element not found.");
        Swal.fire({
            title: 'Error',
            text: 'Failed to update admin email: UI element missing.',
            icon: 'error',
            confirmButtonText: 'Go to Login'
        }).then(() => {
            window.location.href = '../login.html';
        });
        return;
    }

    // Show loading state immediately
    emailElement.innerHTML = `<span><i class="material-icons" style="font-size: tiny;">account_circle</i></span> Loading...`;

    fetch('../php/admin.php')
    .then(response => {
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        return response.json();
    })
    .then(response => {
        console.log("API response:", response);
        if (response.status !== 'success') {
            console.error('API error:', response.message);
            Swal.fire({
                title: 'Session Expired',
                text: 'Please log in again.',
                icon: 'error',
                confirmButtonText: 'Go to Login'
            }).then(() => {
                window.location.href = '../login.html';
            });
            return;
        }
        const email = response.email;
        emailElement.innerHTML = `<span><i class="material-icons" style="font-size: tiny;">account_circle</i></span> ${email}`;
    })
    .catch(error => {
        console.error('Error fetching admin email:', error);
        Swal.fire({
            title: 'Error',
            text: 'Failed to fetch admin email. Please log in again.',
            icon: 'error',
            confirmButtonText: 'Go to Login'
        }).then(() => {
            window.location.href = '../login.html';
        });
    });
});