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

        // Validate required fields
        if (!$patient_id) {
            throw new Exception("Patient ID is required");
        }

        $query = "SELECT Patient_ID FROM patient WHERE Patient_ID = ?";
        $stmt_check = $conn->prepare($query);
        $stmt_check->bind_param("i", $patient_id);
        $stmt_check->execute();
        $result = $stmt_check->get_result();

        if ($result->num_rows === 0) {
            throw new Exception("Patient ID not found in the database.");
        }

        $stmt_check->close();

        // Validate numeric fields
        if ($temperature !== null && !is_numeric($temperature)) {
            throw new Exception("Temperature must be a number");
        }
        if ($rr !== null && !is_numeric($rr)) {
            throw new Exception("Respiratory Rate must be a number");
        }
        if ($height !== null && !is_numeric($height)) {
            throw new Exception("Height must be a number");
        }
        if ($weight !== null && !is_numeric($weight)) {
            throw new Exception("Weight must be a number");
        }
        if ($bmi !== null && !is_numeric($bmi)) {
            throw new Exception("BMI must be a number");
        }
        if ($pulse !== null && !is_numeric($pulse)) {
            throw new Exception("Pulse must be a number");
        }

        // Insert into patient_assessment table
        $sql = "INSERT INTO patient_assessment (
                    Patient_ID, Temperature, Respiratory_Rate, Height, Weight, BMI, Pulse,
                    Blood_Pressure, Physician_Note, Nurse_Note, Recorded_At
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())";

        $stmt = $conn->prepare($sql);

        if (!$stmt) {
            throw new Exception("Failed to prepare statement: " . $conn->error);
        }

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
