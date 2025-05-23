<?php
require_once 'database.php';

// Set header to return JSON response
header('Content-Type: application/json');

try {
    $db = new Database();
    $conn = $db->getConnection();

    // Get form data
    $patient_id = $_POST['patient_id'];
    $temperature = $_POST['temperature'];
    $pulse = $_POST['pulse'];
    $respiratory_rate = $_POST['rr'];
    $blood_pressure = $_POST['bp'];
    $height = $_POST['height'];
    $weight = $_POST['weight'];
    $bmi = $_POST['bmi'];
    $physicians_note = $_POST['physician_notes'];
    $nurse_note = $_POST['nurse_notes'];

    // Prepare SQL statement
    $sql = "INSERT INTO patient_assessment (
        Patient_ID, Temperature, Pulse, Respiratory_Rate, 
        Blood_Pressure, Height, Weight, BMI, 
        Physicians_Note, Nurse_Note, Recorded_At
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())";

    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        throw new Exception("Failed to prepare statement: " . $conn->error);
    }

    $stmt->bind_param(
        "idddssddss",
        $patient_id, $temperature, $pulse, $respiratory_rate,
        $blood_pressure, $height, $weight, $bmi,
        $physicians_note, $nurse_note
    );

    if (!$stmt->execute()) {
        throw new Exception("Failed to execute statement: " . $stmt->error);
    }

    // Get the inserted assessment ID
    $assessment_id = $conn->insert_id;

    echo json_encode([
        'success' => true,
        'message' => 'Assessment record added successfully',
        'assessment_id' => $assessment_id
    ]);

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}

if (isset($stmt)) {
    $stmt->close();
}
if (isset($conn)) {
    $conn->close();
}
?>
