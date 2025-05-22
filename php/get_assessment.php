<?php
require_once 'database.php';

header('Content-Type: application/json');

try {
    $database = new Database();
    $conn = $database->getConnection();

    // Get patient_id from URL
    $patient_id = isset($_GET['patient_id']) ? (int)$_GET['patient_id'] : null;

    if (!$patient_id) {
        throw new Exception("Patient ID is required");
    }

    // Query to get the latest assessment for the patient
    $sql = "SELECT 
                pa.*,
                p.Patient_Type,
                p.Student_ID,
                p.Personnel_ID,
                p.First_Name,
                p.Middle_Name,
                p.Last_Name,
                p.Sex,
                p.Age,
                p.Department
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

    // Format the data
    $response = array(
        'success' => true,
        'patient_id' => $data['Patient_ID'],
        'patient_type' => $data['Patient_Type'],
        'student_id' => $data['Student_ID'],
        'personnel_id' => $data['Personnel_ID'],
        'patient_name' => trim($data['First_Name'] . ' ' . $data['Middle_Name'] . ' ' . $data['Last_Name']),
        'sex' => $data['Sex'],
        'age' => $data['Age'],
        'department' => $data['Department'],
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