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

// Debug: Check if elements are found
console.log("visitChartCanvas:", visitChartCanvas);
console.log("timeRangeSelect:", timeRangeSelect);
if (!visitChartCanvas) console.error("Error: <canvas id='visitChart'> not found.");
if (!timeRangeSelect) console.warn("timeRangeSelect not found.");

// Sidebar toggle
logoBtn?.addEventListener("click", () => {
    sidebar.classList.toggle("active");
});

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
    console.log("Opening popup for Visit ID:", visitId, "Name:", fullName); // Debug
    popupTimeout.style.display = "block";
    timeoutName.textContent = fullName || "[Name Not Available]";
    timeoutVisitId.value = visitId;
}

function closeTimedOutPopup() {
    popupTimeout.style.display = "none";
    timeoutForm.reset(); // Clear form inputs
}

// Event delegation for timedin table
document.querySelector(".timedin_table")?.addEventListener("click", (e) => {
    const target = e.target;
    if (target.classList.contains("timedout")) {
        e.preventDefault();
        const visitId = target.dataset.visitId;
        const fullName = target.dataset.fullName;
        console.log("Time Out clicked - Visit ID:", visitId, "Full Name:", fullName); // Debug
        if (visitId && fullName) {
            openTimedOutPopup(visitId, fullName);
        } else {
            Swal.fire("Error", "Missing visit ID or name.", "error");
        }
    } else if (target.classList.contains("assess")) {
        const patientId = target.dataset.patientId;
        if (patientId && patientId !== 'null') {
            window.location.href = `../forms-admin/patientrec.html?patient_id=${patientId}`;
        } else {
            Swal.fire("Error", "Invalid or missing patient ID.", "error");
        }
    }
});

// Form submission (no validation for medicine/quantity)
timeoutForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = {
        visit_id: timeoutVisitId.value,
        quantity: parseInt(timeoutForm.quantity.value) || 0,
        medicine: timeoutForm.medicine.value.trim(),
        remarks: timeoutForm.remarks.value.trim(),
    };
    console.log("Submitting form data:", formData); // Debug

    try {
        const res = await fetch("../php/time_out.php", {
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

// Visit Summary Line Graph
let chartInstance = null;

async function renderVisitChart(days = 7) {
    if (!visitChartCanvas) {
        console.error("Cannot render chart: visitChartCanvas is undefined.");
        Swal.fire("Error", "Chart canvas not found.", "error");
        return;
    }

    try {
        const res = await fetch(`../php/get_visit_summary.php?days=${days}`);
        const response = await res.json();
        console.log("Visit summary response:", response);

        if (response.status !== "success") {
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

        if (chartInstance) chartInstance.destroy();
        
        // Create chart using Chart.js
        chartInstance = new Chart(visitChartCanvas, {
            type: "line",
            data: {
                labels,
                datasets: [{
                    label: "Daily Visits",
                    data: counts,
                    borderColor: "#4CAF50",
                    backgroundColor: "rgba(76, 175, 80, 0.2)",
                    fill: true,
                    tension: 0.4,
                    pointRadius: 4,
                }],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: "top" },
                    title: {
                        display: true,
                        text: `Visit Summary (Last ${days} Days)`,
                    },
                },
                scales: {
                    x: { title: { display: true, text: "Date" } },
                    y: {
                        beginAtZero: true,
                        title: { display: true, text: "Number of Visits" },
                        ticks: { stepSize: 1 },
                    },
                },
            },
        });
    } catch (error) {
        console.error("Error rendering visit chart:", error);
        Swal.fire("Error", "Failed to load visit summary chart.", "error");
    }
}

// Time range selector
timeRangeSelect?.addEventListener("change", (e) => {
    renderVisitChart(parseInt(e.target.value));
});

// Initialize chart
document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM fully loaded, initializing chart...");
    renderVisitChart(7);
});