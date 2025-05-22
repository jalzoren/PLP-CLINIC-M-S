document.addEventListener('DOMContentLoaded', function() {
    // Get patient_id from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const patientId = urlParams.get('patient_id');

    if (!patientId) {
        console.error('No patient ID provided');
        return;
    }

    // Fetch assessment data from the server
    fetch(`../php/get_assessment.php?patient_id=${patientId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.error) {
                console.error('Error:', data.error);
                return;
            }

            // Populate the form fields with the fetched data
            document.getElementById('temperature').value = data.temperature || '';
            document.getElementById('rr').value = data.respiratory_rate || '';
            document.getElementById('height').value = data.height || '';
            document.getElementById('weight').value = data.weight || '';
            document.getElementById('bmi').value = data.bmi || '';
            document.getElementById('pulse').value = data.pulse || '';
            document.getElementById('bp').value = data.blood_pressure || '';
            document.getElementById('physician_notes').value = data.physicians_note || '';
            document.getElementById('nurse_notes').value = data.nurse_note || '';

            // Set hidden fields
            document.getElementById('patient_id').value = data.patient_id || '';
            document.getElementById('patient_type').value = data.patient_type || '';
            document.getElementById('student_id').value = data.student_id || '';
            document.getElementById('personnel_id').value = data.personnel_id || '';
            document.getElementById('patient_name').value = data.patient_name || '';
            document.getElementById('sex').value = data.sex || '';
            document.getElementById('age').value = data.age || '';
            document.getElementById('department').value = data.department || '';

            // Log success
            console.log('Assessment data loaded successfully');
        })
        .catch(error => {
            console.error('Error fetching assessment data:', error);
            // Show error message to user
            alert('Error loading assessment data. Please try again.');
        });
}); 