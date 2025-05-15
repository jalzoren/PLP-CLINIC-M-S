<?php
ob_start();
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
header('Content-Type: application/json');

require_once 'database.php';

if (!isset($_GET['patient_id'])) {
    http_response_code(400);
    echo json_encode(["error" => "Missing patient_id"]);
    exit;
}

$patientId = $_GET['patient_id'];

try {
    $database = new Database();
    $conn = $database->getConnection();

    $stmt = $conn->prepare("
        SELECT 
        p.First_Name, p.Middle_Name, p.Last_Name, p.Category,
        sp.Student_ID, sp.Department AS student_dept,
        pp.Personnel_ID, pp.Department AS personnel_dept
        FROM patient p
        LEFT JOIN student_patient sp ON p.Patient_ID = sp.Patient_ID
        LEFT JOIN personnel_patient pp ON p.Patient_ID = pp.Patient_ID
        WHERE p.Patient_ID = ?
    ");
    $stmt->bind_param("i", $patientId);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($row = $result->fetch_assoc()) {
        $fullName = trim("{$row['First_Name']} {$row['Middle_Name']} {$row['Last_Name']}");
        $category = strtolower($row['Category']);
        $roleMap = [
            'student' => 'Student',
            'personnel' => 'Personnel',
            'teaching' => 'Personnel (Teaching)',
            'non-teaching' => 'Personnel (Non-Teaching)'
        ];
        $role = $roleMap[$category] ?? ucfirst($category);
    
        $idNumber = null;
        $department = null;
    
        if ($category === 'student') {
            $idNumber = $row['Student_ID'];
            $department = $row['student_dept'];
        } elseif (in_array($category, ['personnel', 'teaching', 'non-teaching'])) {
            $idNumber = $row['Personnel_ID'];
            $department = $row['personnel_dept'];
        }
    
        echo json_encode([
            'full_name' => $fullName,
            'role' => $role,
            'id_number' => $idNumber,
            'department' => $department
        ]);
    }else {
        http_response_code(404);
        echo json_encode(['error' => 'Patient not found']);
    }

    $stmt->close();
    $conn->close();
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Server error: ' . $e->getMessage()]);
}
?>
