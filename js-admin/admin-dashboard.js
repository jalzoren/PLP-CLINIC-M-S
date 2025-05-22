// Cached DOM elements
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

// Debug: Check if visitChartCanvas is found
console.log("visitChartCanvas:", visitChartCanvas);
if (!visitChartCanvas) {
    console.error("Error: <canvas id='visitChart'> not found in the DOM.");
}

// Sidebar toggle
logoBtn.addEventListener("click", () => {
    sidebar.classList.toggle("active");
});

// Emergency hotlines popup
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
    const timeString = `${hours}:${minutes}:${seconds}`;
    const day = now.getDate().toString().padStart(2, "0");
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const year = now.getFullYear();
    const dateString = `${month}/${day}/${year}`;
    const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const weekday = weekdays[now.getDay()];

    dateElement.textContent = `Date: ${dateString}`;
    timeElement.textContent = `${weekday} | ${timeString}`;
}

setInterval(updateDateTime, 1000);
updateDateTime();

// Time out popup
function closeTimedOutPopup() {
    popupTimeout.style.display = "none";
}

function openTimedOutPopup(visitId, fullName) {
    popupTimeout.style.display = "block";
    timeoutName.textContent = fullName;
    timeoutVisitId.value = visitId;
}

// Event delegation for time out buttons
document.querySelector(".timedin_table").addEventListener("click", (e) => {
    if (e.target.classList.contains("timedout")) {
        e.preventDefault();
        const id = e.target.dataset.visitId;
        const name = e.target.dataset.fullName;
        openTimedOutPopup(id, name);
    } else if (e.target.classList.contains("assess")) {
        const patientId = e.target.dataset.patientId;
        const category = e.target.dataset.category;
        if (patientId && patientId !== 'null') {
            window.location.href = `../forms-admin/patientrec.html?patient_id=${patientId}`;
        } else {
            Swal.fire("Error", "Invalid or missing patient ID.", "error");
        }
    }
});

// Form submission with validation
timeoutForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const quantity = timeoutForm.quantity.value;
    const medicine = timeoutForm.medicine.value.trim();
    const remarks = timeoutForm.remarks.value.trim();

    if (!quantity || quantity < 1) {
        Swal.fire("Error", "Please enter a valid quantity.", "error");
        return;
    }
    if (!medicine) {
        Swal.fire("Error", "Please enter the medication given.", "error");
        return;
    }

    const formData = {
        visit_id: timeoutVisitId.value,
        quantity: parseInt(quantity),
        medicine,
        remarks,
    };

    try {
        const res = await fetch("../php/time_out.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });
        const data = await res.json();

        if (data.status === "success") {
            Swal.fire("Success", data.message, "success").then(() => {
                location.reload();
            });
        } else {
            Swal.fire("Error", data.message, "error");
        }
    } catch (error) {
        Swal.fire("Error", "An error occurred while processing the request.", "error");
    }
});

// Visit Summary Line Graph
let chartInstance = null; // Store chart instance to prevent multiple instances

async function renderVisitChart(days = 7) {
    // Check if canvas exists
    if (!visitChartCanvas) {
        console.error("Cannot render chart: visitChartCanvas is undefined.");
        Swal.fire("Error", "Chart canvas not found.", "error");
        return;
    }

    try {
        const res = await fetch(`../php/get_visit_summary.php?days=${days}`);
        const response = await res.json();

        console.log("Visit summary response:", response); // Debug: Log response

        if (response.status !== "success") {
            console.error("Failed to fetch visit data:", response.message);
            Swal.fire("Error", response.message, "error");
            return;
        }

        const data = response.data;
        if (data.length === 0) {
            Swal.fire("Info", "No visits found for the selected period.", "info");
            return;
        }

        const labels = data.map(item => item.date);
        const counts = data.map(item => item.count);

        // Destroy existing chart if it exists
        if (chartInstance) {
            chartInstance.destroy();
        }

        chartInstance = new Chart(visitChartCanvas, {
            type: "line",
            data: {
                labels: labels,
                datasets: [{
                    label: "Daily Visits",
                    data: counts,
                    borderColor: "#4CAF50",
                    backgroundColor: "rgba(76, 175, 80, 0.2)",
                    fill: true,
                    tension: 0.4,
                    pointRadius: 4,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: "top",
                    },
                    title: {
                        display: true,
                        text: `Visit Summary (Last ${days} Days)`,
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: "Date",
                        }
                    },
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: "Number of Visits",
                        },
                        ticks: {
                            stepSize: 1,
                        }
                    }
                }
            }
        });
    } catch (error) {
        console.error("Error rendering visit chart:", error);
        Swal.fire("Error", "Failed to load visit summary chart.", "error");
    }
}

// Time range selector
if (timeRangeSelect) {
    timeRangeSelect.addEventListener("change", (e) => {
        renderVisitChart(parseInt(e.target.value));
    });
} else {
    console.warn("timeRangeSelect not found in the DOM.");
}

// Initialize chart on page load
document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM fully loaded, initializing chart...");
    renderVisitChart(7);
});