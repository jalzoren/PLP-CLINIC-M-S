<?php
require_once 'database.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $database = new Database();
        $conn = $database->getConnection();

        // Collect POST data
        $patient_id = $_POST['patient_id'] ?? null;
        $temperature = $_POST['temperature'] ?? null;
        $rr = $_POST['rr'] ?? null; // Respiratory Rate
        $height = $_POST['height'] ?? null;
        $weight = $_POST['weight'] ?? null;
        $bmi = $_POST['bmi'] ?? null;
        $pulse = $_POST['pulse'] ?? null;
        $bp = $_POST['bp'] ?? null; // Blood Pressure
        $physician_notes = $_POST['physician_notes'] ?? null;
        $nurse_notes = $_POST['nurse_notes'] ?? null;

        // Prepare the SQL INSERT statement
        $sql = "INSERT INTO patient_assessment (
                    Patient_ID, Temperature, Respiratory_Rate, Height, Weight, BMI, Pulse,
                    Blood_Pressure, Physician_Notes, Nurse_Notes, Recorded_At
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())";

        $stmt = $conn->prepare($sql);

        if (!$stmt) {
            throw new Exception("Failed to prepare statement: " . $conn->error);
        }

        // Bind parameters to the statement
        $stmt->bind_param(
            "idddddddss",
            $patient_id,
            $temperature,
            $rr,
            $height,
            $weight,
            $bmi,
            $pulse,
            $bp,
            $physician_notes,
            $nurse_notes
        );

        // Execute and check for success
        if ($stmt->execute()) {
            echo "Assessment record saved successfully.";
        } else {
            echo "Error saving record: " . $stmt->error;
        }

        $stmt->close();
        $conn->close();

    } catch (Exception $e) {
        echo "Error: " . $e->getMessage();
    }
} else {
    echo "Invalid request method.";
}
?>
