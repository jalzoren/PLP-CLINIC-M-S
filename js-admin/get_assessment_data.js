document.addEventListener('DOMContentLoaded', function() {
    // Get patient_id from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const patientId = urlParams.get('patient_id');

    if (!patientId) {
        console.error('No patient ID provided');
        return;
    }

    // Fetch combined patient and assessment data
    fetch(`../php/get_patient_assessment.php?patient_id=${patientId}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Set patient information display fields
                document.getElementById('display_patient_name').textContent = data.patient_name;

                // Set vital signs
                document.getElementById('temperature').value = data.temperature;
                document.getElementById('rr').value = data.respiratory_rate;
                document.getElementById('height').value = data.height;
                document.getElementById('weight').value = data.weight;
                document.getElementById('bmi').value = data.bmi;
                document.getElementById('pulse').value = data.pulse;
                document.getElementById('bp').value = data.blood_pressure;

                // Set notes
                document.getElementById('physician_notes').value = data.physicians_note;
                document.getElementById('nurse_notes').value = data.nurse_note;
            } else {
                throw new Error(data.error || 'Failed to load data');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error loading data: ' + error.message);
        });
}); 