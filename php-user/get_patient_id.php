<?php
include '../php/database.php';

$db = new Database();
$conn = $db->getConnection();

if (isset($_GET['id_number'])) {
    $id_number = trim($_GET['id_number']);
    error_log("Looking up ID_Number: $id_number"); // Debug log

    // Try student_patient first
    $stmt = $conn->prepare('SELECT Patient_ID FROM student_patient WHERE Student_ID = ?');
    $stmt->bind_param('s', $id_number);
    if (!$stmt->execute()) {
        error_log("student_patient query failed: " . $stmt->error);
        echo json_encode(['success' => false, 'error' => 'Database error']);
        $stmt->close();
        exit;
    }
    $stmt->bind_result($patient_id);
    
    if ($stmt->fetch()) {
        error_log("Found Patient_ID in student_patient: $patient_id");
        echo json_encode(['success' => true, 'patient_id' => $patient_id]);
        $stmt->close();
        exit;
    }
    $stmt->close();
    
    // Try personnel_patient
    $stmt = $conn->prepare('SELECT Patient_ID FROM personnel_patient WHERE Personnel_ID = ?');
    $stmt->bind_param('s', $id_number);
    if (!$stmt->execute()) {
        error_log("personnel_patient query failed: " . $stmt->error);
        echo json_encode(['success' => false, 'error' => 'Database error']);
        $stmt->close();
        exit;
    }
    $stmt->bind_result($patient_id);
    
    if ($stmt->fetch()) {
        error_log("Found Patient_ID in personnel_patient: $patient_id");
        echo json_encode(['success' => true, 'patient_id' => $patient_id]);
        $stmt->close();
        exit;
    }
    $stmt->close();
    
    echo json_encode(['success' => false, 'error' => 'No patient found with ID number: ' . $id_number]);
} else {
    echo json_encode(['success' => false, 'error' => 'No ID number provided']);
}

$db->close();
?>