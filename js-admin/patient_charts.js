document.addEventListener('DOMContentLoaded', () => {
    console.log("patient_charts.js is running");

    // Verify DOM elements
    const totalElement = document.querySelector('.category_total h2');
    const studentElement = document.querySelector('.category_student h2');
    const teachingElement = document.querySelector('.category_teaching h2');
    const nonTeachingElement = document.querySelector('.category_nonteaching h2');

    console.log("DOM Elements:", {
        totalElement,
        studentElement,
        teachingElement,
        nonTeachingElement
    });

    if (!totalElement || !studentElement || !teachingElement || !nonTeachingElement) {
        console.error("One or more DOM elements not found.");
        Swal.fire('Error', 'Failed to update patient summary: UI elements missing.', 'error');
        return;
    }

    fetch('../php-admin/get_patient_summary.php')
    .then(response => {
        console.log("Fetch response received:", response);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        return response.json();
    })
    .then(response => {
        console.log("API response:", response);
        if (response.status !== 'success') {
            console.error('API error:', response.message);
            Swal.fire('Error', response.message, 'error');
            return;
        }
        const data = response.data;
        console.log("Data to display:", data);
        totalElement.textContent = data.Total.toLocaleString();
        studentElement.textContent = data.Student.toLocaleString();
        teachingElement.textContent = data.Teaching.toLocaleString();
        nonTeachingElement.textContent = data['Non-Teaching'].toLocaleString();
    })
    .catch(error => {
        console.error('Error loading patient summary:', error);
        Swal.fire('Error', 'Failed to load patient summary.', 'error');
    });
});