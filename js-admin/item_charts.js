fetch('../php/item_summary.php')
.then(response => {
    if (!response.ok) throw new Error("HTTP error! status: " + response.status);
    return response.json();
})
.then(data => {
    if (data.error) {
        console.error("PHP Error:", data);
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

    const borderColors = [
        'rgba(173, 216, 230, 1.0)',
        'rgba(255, 182, 193, 1.0)',
        'rgba(144, 238, 144, 1.0)',
        'rgba(255, 255, 224, 1.0)',
        'rgba(221, 160, 221, 1.0)',
        'rgba(240, 230, 140, 1.0)',
        'rgba(176, 224, 230, 1.0)',
        'rgba(255, 228, 196, 1.0)',
        'rgba(230, 230, 250, 1.0)'
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
                borderColor: borderColors,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false, // Allows better scaling
            layout: {
                padding: 20
            },
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        color: 'black',
                        font: function(context) {
                        const width = context.chart.width;
                        let size = 12; // default

                        if (width < 400) size = 8;
                        else if (width < 600) size = 10;
                        else if (width < 800) size = 12;
                        else size = 14;

                        return {
                            size: size,
                            weight: 'normal'
                        };
                        },
                        boxWidth: 15,
                        padding: 10
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            return `${label}: ${value} available`;
                        }
                    }
                }
            }
          }
    });
    
  })
.catch(err => {
    console.error("Error loading item summary chart:", err);
    alert("Failed to load item summary chart. See console for details.");
});
