<?php
// Include your database connection
include 'database.php';

$patient = null;

if (isset($_GET['patient_id'])) {
    $patient_id = $_GET['patient_id'];

    // Fetch patient data from the database
    $sql = "SELECT * FROM patient WHERE Patient_ID = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('i', $patient_id); 
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        // Fetch the patient data as an associative array
        $patient = $result->fetch_assoc();
    }

    $stmt->close();
    $conn->close();
}

// Return the patient data as JSON
echo json_encode($patient);
?>
