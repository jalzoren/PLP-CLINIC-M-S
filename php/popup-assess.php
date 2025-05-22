<?php
require_once 'database.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $database = new Database();
        $conn = $database->getConnection();

        // Collect and sanitize POST data
        $patient_id = $_POST['patient_id'] ?? null;
        $patient_type = $_POST['patient_type'] ?? null;
        $student_id = $_POST['student_id'] ?? null;
        $personnel_id = $_POST['personnel_id'] ?? null;
        $patient_name = $_POST['patient_name'] ?? null;
        $sex = $_POST['sex'] ?? null;
        $age = $_POST['age'] ?? null;
        $department = $_POST['department'] ?? null;
        $temperature = $_POST['temperature'] ?? null;
        $rr = $_POST['rr'] ?? null;
        $height = $_POST['height'] ?? null;
        $weight = $_POST['weight'] ?? null;
        $bmi = $_POST['bmi'] ?? null;
        $pulse = $_POST['pulse'] ?? null;
        $bp = $_POST['bp'] ?? null;
        $physician_notes = $_POST['physician_notes'] ?? null;
        $nurse_notes = $_POST['nurse_notes'] ?? null;

        // Prepare and execute SQL insert
        $sql = "INSERT INTO patient_assessment (
                    Assessment_ID, Patient_ID, Temperature, Pulse,  Respiratory_Rate,
                    Blood_Pressure, Height, Weight, BMI, 
                    Physician_Notes, Nurse_Notes, Recorded_At
                ) VALUES (
                    ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW()
                )";

        $stmt = $conn->prepare($sql);
        $stmt->bind_param(
            "issssssddddddssss",
            $patient_id,
            $patient_type,
            $student_id,
            $personnel_id,
            $patient_name,
            $sex,
            $age,
            $department,
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
