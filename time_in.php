<?php
require_once 'php/database.php';
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['id_number']) || !isset($data['reason'])) {
    echo json_encode(["status" => "error", "message" => "Missing required fields."]);
    exit;
}

$id_number = trim($data['id_number']);
$reason = trim($data['reason']);

try {
    $db = new Database();
    $conn = $db->getConnection();

    // Step 1: Find Patient_ID using Student_ID
    $stmt = $conn->prepare("SELECT Patient_ID FROM student_patient WHERE Student_ID = ?");
    $stmt->bind_param("s", $id_number);
    $stmt->execute();
    $stmt->bind_result($patient_id);
    $stmt->fetch();
    $stmt->close();

    if ($patient_id) {
        $time_in = date('Y-m-d H:i:s');

        // Step 2: Insert into visit_records using Patient_ID
        $insert = $conn->prepare("INSERT INTO visit_records (Patient_ID, Time_In, Reason) VALUES (?, ?, ?)");
        $insert->bind_param("iss", $patient_id, $time_in, $reason);
        $insert->execute();
        $insert->close();

        echo json_encode(["status" => "success", "message" => "Time in recorded successfully."]);
    } else {
        echo json_encode(["status" => "error", "message" => "Student not found."]);
    }

    $db->close();

} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>