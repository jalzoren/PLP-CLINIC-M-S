const sidebar = document.querySelector(".sidebar");
const logoBtn = document.querySelector("#logo");
const hotlinesPopup = document.getElementById("hotlines_table_popup");
const overlay = document.getElementById("overlay");
const popupTimeout = document.getElementById("popup_timeout");
const timeoutForm = document.getElementById("timeoutForm");
const timeoutName = document.getElementById("timeoutName");
const timeoutVisitId = document.getElementById("timeoutVisitId");
const dateElement = document.getElementById("date");
const timeElement = document.getElementById("time");
const visitChartCanvas = document.getElementById("visitChart");
const timeRangeSelect = document.getElementById("timeRange");
const itemChartCanvas = document.getElementById("itemChart");
const totalElement = document.querySelector(".category_total h2");
const studentElement = document.querySelector(".category_student h2");
const teachingElement = document.querySelector(".category_teaching h2");
const nonTeachingElement = document.querySelector(".category_nonteaching h2");

console.log("DOM Elements:", { visitChartCanvas, timeRangeSelect, itemChartCanvas, totalElement, studentElement, teachingElement, nonTeachingElement });
if (!visitChartCanvas || !itemChartCanvas || !totalElement || !studentElement || !teachingElement || !nonTeachingElement) {
    console.error("Missing DOM elements for charts or patient summary.");
    Swal.fire("Error", "Failed to initialize dashboard: UI elements missing.", "error");
}

// Sidebar toggle
logoBtn?.addEventListener("click", () => {
    sidebar.classList.toggle("active");
});

// Hotline popup
function openForm() {
    hotlinesPopup.classList.add("show");
    overlay.classList.add("show");
}

function closeForm() {
    hotlinesPopup.classList.remove("show");
    overlay.classList.remove("show");
}

// Real-time clock
function updateDateTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const seconds = now.getSeconds().toString().padStart(2, "0");
    const day = now.getDate().toString().padStart(2, "0");
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const year = now.getFullYear();
    const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    dateElement.textContent = `Date: ${month}/${day}/${year}`;
    timeElement.textContent = `${weekdays[now.getDay()]} | ${hours}:${minutes}:${seconds}`;
}
setInterval(updateDateTime, 1000);
updateDateTime();

// Time out popup
function openTimedOutPopup(visitId, fullName) {
    console.log("Opening popup for Visit ID:", visitId, "Name:", fullName);
    popupTimeout.style.display = "block";
    timeoutName.textContent = fullName || "[Name Not Available]";
    timeoutVisitId.value = visitId;
}

function closeTimedOutPopup() {
    popupTimeout.style.display = "none";
    timeoutForm.reset();
}

// Event delegation for timedin table
document.querySelector(".timedin_table")?.addEventListener("click", (e) => {
    const target = e.target;
    if (target.classList.contains("timedout")) {
        e.preventDefault();
        const visitId = target.dataset.visitId;
        const fullName = target.dataset.fullName;
        if (visitId && fullName) {
            openTimedOutPopup(visitId, fullName);
        } else {
            Swal.fire("Error", "Missing visit ID or name.", "error");
        }
    } else if (target.classList.contains("assess")) {
        const patientId = target.dataset.patientId;
        if (patientId && patientId !== 'null') {
            window.location.href = `/PLP-CLINIC-M-S/forms-admin/patientrec.html?patient_id=${patientId}`;
        } else {
            Swal.fire("Error", "Invalid or missing patient ID.", "error");
        }
    }
});

// Time out form submission
timeoutForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = {
        visit_id: timeoutVisitId.value,
        quantity: parseInt(timeoutForm.quantity.value) || 0,
        medicine: timeoutForm.medicine.value.trim(),
        remarks: timeoutForm.remarks.value.trim(),
    };
    console.log("Submitting form data:", formData);
    try {
        const res = await fetch("/PLP-CLINIC-M-S/php/time_out.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });
        const data = await res.json();
        Swal.fire({
            icon: data.status,
            title: data.status === "success" ? "Success" : "Error",
            text: data.message,
        }).then(() => {
            if (data.status === "success") {
                closeTimedOutPopup();
                location.reload();
            }
        });
    } catch (error) {
        console.error("Submission error:", error);
        Swal.fire("Error", "Failed to process time out.", "error");
    }
});

// Dashboard data rendering
let visitChartInstance = null;
let itemChartInstance = null;

async function renderDashboard(days = 7) {
    // Check cache
    const cacheKey = `dashboard_data_${days}`;
    const cachedData = localStorage.getItem(cacheKey);
    if (cachedData) {
        const data = JSON.parse(cachedData);
        if (data.timestamp > Date.now() - 5 * 60 * 1000) { // 5-minute cache
            console.log("Using cached dashboard data");
            renderChartsAndSummary(data.data);
            return;
        }
    }

    try {
        const res = await fetch(`/PLP-CLINIC-M-S/php-admin/dashboard_data.php?days=${days}`);
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        const response = await res.json();
        console.log("Dashboard data response:", response);
        if (response.status !== "success") {
            Swal.fire("Error", response.message, "error");
            return;
        }
        // Cache data
        localStorage.setItem(cacheKey, JSON.stringify({ data: response.data, timestamp: Date.now() }));
        renderChartsAndSummary(response.data);
    } catch (error) {
        console.error("Error loading dashboard data:", error);
        Swal.fire("Error", "Failed to load dashboard data.", "error");
    }
}

function renderChartsAndSummary(data) {
    // Patient Summary
    if (totalElement && studentElement && teachingElement && nonTeachingElement) {
        totalElement.textContent = data.patients.Total.toLocaleString();
        studentElement.textContent = data.patients.Student.toLocaleString();
        teachingElement.textContent = data.patients.Teaching.toLocaleString();
        nonTeachingElement.textContent = data.patients['Non-Teaching'].toLocaleString();
    }

    // Visit Chart
    if (visitChartCanvas) {
        const labels = data.visits.map(item => item.date);
        const counts = data.visits.map(item => item.count);
        if (visitChartInstance) visitChartInstance.destroy();
        const ctxVisit = visitChartCanvas.getContext('2d');
        const gradient = ctxVisit.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, 'rgba(46, 38, 109, 0.4)');
        gradient.addColorStop(1, 'rgba(46, 38, 109, 0)');
        visitChartInstance = new Chart(visitChartCanvas, {
            type: "line",
            data: {
                labels,
                datasets: [{
                    label: "Daily Visits",
                    data: counts,
                    borderColor: "#2e266d",
                    backgroundColor: gradient,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 5,
                    pointHoverRadius: 8,
                    pointBackgroundColor: "#fff",
                    pointBorderColor: "#2e266d",
                    pointBorderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: "top", labels: { font: { family: 'Poppins', size: 14 }, color: '#2e266d' } },
                    title: { display: true, text: `(Last ${data.visits.length} Days)`, font: { family: 'Poppins', size: 16, weight: '600' }, color: '#2e266d' },
                    tooltip: {
                        backgroundColor: '#2e266d',
                        titleFont: { family: 'Poppins', size: 14 },
                        bodyFont: { family: 'Poppins', size: 12 },
                        callbacks: { label: context => `Visits: ${context.raw}` }
                    }
                },
                scales: {
                    x: { title: { display: true, text: "Date", font: { family: 'Poppins', size: 14 }, color: '#2e266d' }, grid: { display: false }, ticks: { color: '#2e266d' } },
                    y: { beginAtZero: true, title: { display: true, text: "No. of Visits", font: { family: 'Poppins', size: 14 }, color: '#2e266d' }, grid: { color: 'rgba(46, 38, 109, 0.1)' }, ticks: { stepSize: 1, color: '#2e266d' } }
                },
                animation: { duration: 1000, easing: 'easeOutQuart' }
            }
        });
    }

    // Item Chart
    if (itemChartCanvas) {
        const labels = data.items.map(item => item.label);
        const values = data.items.map(item => item.value);
        const backgroundColors = [
            'rgba(173, 216, 230, 1)', 'rgba(255, 182, 193, 1)', 'rgba(144, 238, 144, 1)',
            'rgba(255, 255, 224, 1)', 'rgba(221, 160, 221, 1)', 'rgba(240, 230, 140, 1)',
            'rgba(176, 224, 230, 1)', 'rgba(255, 228, 196, 1)', 'rgba(230, 230, 250, 1)'
        ];
        if (itemChartInstance) itemChartInstance.destroy();
        const ctxItem = itemChartCanvas.getContext('2d');
        itemChartInstance = new Chart(ctxItem, {
            type: 'doughnut',
            data: {
                labels,
                datasets: [{
                    label: 'Available Items',
                    data: values,
                    backgroundColor: backgroundColors,
                    borderColor: '#2e266d',
                    borderWidth: 2,
                    hoverOffset: 20
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                layout: { padding: 10 },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: '#2e266d',
                        titleFont: { family: 'Poppins', size: 14 },
                        bodyFont: { family: 'Poppins', size: 12 },
                        callbacks: { label: context => `${context.label}: ${context.raw} available` }
                    }
                },
                animation: { animateScale: true, animateRotate: true }
            }
        });
    }
}

// Time range selector
timeRangeSelect?.addEventListener("change", (e) => {
    renderDashboard(parseInt(e.target.value));
});

// Initialize dashboard
document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM fully loaded, initializing dashboard...");
    renderDashboard(7);
});