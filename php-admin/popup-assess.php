<?php
require_once '../php/database.php';

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

    // Check for existing assessments today for this patient
    $check_sql = "SELECT COUNT(*) as count FROM patient_assessment 
                  WHERE Patient_ID = ? 
                  AND DATE(Recorded_At) = CURDATE()";
    $check_stmt = $conn->prepare($check_sql);
    $check_stmt->bind_param("i", $patient_id);
    $check_stmt->execute();
    $result = $check_stmt->get_result();
    $row = $result->fetch_assoc();
    $assessment_count = $row['count'] + 1; // Add 1 for the new assessment

    // Prepare SQL statement for new assessment
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
        'assessment_id' => $assessment_id,
        'assessment_count' => $assessment_count
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
if (isset($check_stmt)) {
    $check_stmt->close();
}
if (isset($conn)) {
    $conn->close();
}
?>
