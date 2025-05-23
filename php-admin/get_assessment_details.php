<?php
// Prevent any HTML errors from being output
error_reporting(0);
ini_set('display_errors', 0);

require_once '../php/database.php';

// Ensure we're sending JSON response
header('Content-Type: application/json');

try {
    $db = new Database();
    $conn = $db->getConnection();

    if (!isset($_GET['assessment_id']) || !is_numeric($_GET['assessment_id'])) {
        throw new Exception("Invalid or missing assessment ID");
    }

    $assessment_id = intval($_GET['assessment_id']);

    // Query to get assessment details with patient information
    $sql = "SELECT 
                pa.*,
                p.First_Name,
                p.Middle_Name,
                p.Last_Name,
                p.Category,
                COALESCE(sp.Student_ID, pp.Personnel_ID) as id_number,
                COALESCE(sp.Department, pp.Department) as department
            FROM patient_assessment pa
            JOIN patient p ON pa.Patient_ID = p.Patient_ID
            LEFT JOIN student_patient sp ON p.Patient_ID = sp.Patient_ID
            LEFT JOIN personnel_patient pp ON p.Patient_ID = pp.Patient_ID
            WHERE pa.Assessment_ID = ?";

    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        throw new Exception("Failed to prepare statement: " . $conn->error);
    }

    $stmt->bind_param("i", $assessment_id);
    
    if (!$stmt->execute()) {
        throw new Exception("Failed to execute statement: " . $stmt->error);
    }

    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        throw new Exception("No assessment found with the provided ID");
    }

    $data = $result->fetch_assoc();

    // Format the response
    $response = array(
        'success' => true,
        'assessment' => array(
            'patient_name' => trim($data['First_Name'] . ' ' . $data['Middle_Name'] . ' ' . $data['Last_Name']),
            'id_number' => $data['id_number'],
            'department' => $data['department'],
            'temperature' => $data['Temperature'],
            'pulse' => $data['Pulse'],
            'respiratory_rate' => $data['Respiratory_Rate'],
            'blood_pressure' => $data['Blood_Pressure'],
            'height' => $data['Height'],
            'weight' => $data['Weight'],
            'bmi' => $data['BMI'],
            'recorded_at' => $data['Recorded_At'],
            'physicians_note' => $data['Physicians_Note'],
            'nurse_note' => $data['Nurse_Note']
        )
    );

    echo json_encode($response);

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(array(
        'success' => false,
        'error' => $e->getMessage()
    ));
} catch (Error $e) {
    http_response_code(500);
    echo json_encode(array(
        'success' => false,
        'error' => 'Internal server error'
    ));
}

if (isset($stmt)) {
    $stmt->close();
}
if (isset($conn)) {
    $conn->close();
}
?> 