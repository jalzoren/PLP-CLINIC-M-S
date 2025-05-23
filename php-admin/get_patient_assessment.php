<?php
require '../php/database.php';  // adjust path if needed

header('Content-Type: application/json');

try {
    $db = new Database();
    $conn = $db->getConnection();

    if (isset($_GET['patient_id']) && is_numeric($_GET['patient_id'])) {
        $patient_id = intval($_GET['patient_id']);
        
        // Query to get both patient and assessment data in one go
        $sql = "SELECT 
                    pa.*,
                    p.First_Name,
                    p.Middle_Name,
                    p.Last_Name
                FROM patient_assessment pa
                JOIN patient p ON pa.Patient_ID = p.Patient_ID
                WHERE pa.Patient_ID = ?
                ORDER BY pa.Recorded_At DESC
                LIMIT 1";

        $stmt = $conn->prepare($sql);
        if (!$stmt) {
            throw new Exception("Failed to prepare statement: " . $conn->error);
        }

        $stmt->bind_param("i", $patient_id);
        
        if (!$stmt->execute()) {
            throw new Exception("Failed to execute statement: " . $stmt->error);
        }
        
        $result = $stmt->get_result();

        if ($result->num_rows === 0) {
            throw new Exception("No assessment found for this patient");
        }

        $data = $result->fetch_assoc();

        // Format the response
        $response = array(
            'success' => true,
            // Patient Information
            'patient_name' => trim($data['First_Name'] . ' ' . $data['Middle_Name'] . ' ' . $data['Last_Name']),
            // Assessment Information
            'temperature' => $data['Temperature'],
            'respiratory_rate' => $data['Respiratory_Rate'],
            'height' => $data['Height'],
            'weight' => $data['Weight'],
            'bmi' => $data['BMI'],
            'pulse' => $data['Pulse'],
            'blood_pressure' => $data['Blood_Pressure'],
            'physicians_note' => $data['Physicians_Note'],
            'nurse_note' => $data['Nurse_Note']
        );

        echo json_encode($response);

    } else {
        throw new Exception("Invalid or missing patient_id");
    }
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(array(
        'success' => false,
        'error' => $e->getMessage()
    ));
}

if (isset($stmt)) {
    $stmt->close();
}
if (isset($conn)) {
    $conn->close();
}
?>
