fetch('../php-admin/item_summary.php')
.then(response => {
    if (!response.ok) throw new Error("HTTP error! status: " + response.status);
    return response.json();
})
.then(data => {
    if (data.error) {
        console.error("PHP Error:", data);
        Swal.fire("Error", "Failed to load item summary.", "error");
        return;
    }

    const labels = data.map(item => item.label);
    const values = data.map(item => item.value);

    const backgroundColors = [
        'rgba(173, 216, 230, 1)', // Light Blue
        'rgba(255, 182, 193, 1)', // Light Pink
        'rgba(144, 238, 144, 1)', // Light Green
        'rgba(255, 255, 224, 1)', // Light Yellow
        'rgba(221, 160, 221, 1)', // Plum
        'rgba(240, 230, 140, 1)', // Khaki
        'rgba(176, 224, 230, 1)', // Powder Blue
        'rgba(255, 228, 196, 1)', // Bisque
        'rgba(230, 230, 250, 1)'  // Lavender
    ];

    const ctx = document.getElementById('itemChart').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                label: 'Available Items',
                data: values,
                backgroundColor: backgroundColors,
                borderColor: '#2e266d', // Match clinic branding
                borderWidth: 2,
                hoverOffset: 20 // Subtle hover effect
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: {
                padding: 10
            },
            plugins: {
                legend: {
                    display: false // Hide legend
                },
                tooltip: {
                    backgroundColor: '#2e266d',
                    titleFont: { family: 'Poppins', size: 14 },
                    bodyFont: { family: 'Poppins', size: 12 },
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            return `${label}: ${value} available`;
                        }
                    }
                }
            },
            animation: {
                animateScale: true,
                animateRotate: true
            }
        }
    });
})
.catch(err => {
    console.error("Error loading item summary chart:", err);
    Swal.fire("Error", "Failed to load item summary chart.", "error");
});