<?php
date_default_timezone_set('Asia/Manila');
ini_set('display_errors', 1);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/php_errors.log');
error_reporting(E_ALL);

require_once __DIR__ . '/../php/database.php';
header("Content-Type: application/json");

function sendError($msg) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => $msg]);
    exit;
}

try {
    $raw_input = file_get_contents("php://input");
    if (!$raw_input) {
        sendError("No input data received");
    }

    $data = json_decode($raw_input, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        sendError("Invalid JSON data: " . json_last_error_msg());
    }

    if (!isset($data['id_number']) || !isset($data['reason'])) {
        sendError("Missing required fields");
    }

    $id_number = trim($data['id_number']);
    $reason = trim($data['reason']);
    $other_reason = isset($data['other_reason']) ? trim($data['other_reason']) : '';

    if (!is_numeric($id_number) || $id_number <= 0) {
        sendError("Invalid ID number");
    }

    if (empty($reason)) {
        sendError("Reason cannot be empty");
    }

    // If reason is "Other Reason", use the other_reason field
    if ($reason === 'Other Reason' && !empty($other_reason)) {
        $reason = $other_reason;
    }

    $db = new Database();
    $conn = $db->getConnection();

    if (!$conn) {
        throw new Exception("Database connection failed");
    }

    // First check student_patient table
    $stmt = $conn->prepare("SELECT Patient_ID FROM student_patient WHERE Student_ID = ?");
    if (!$stmt) {
        throw new Exception("Failed to prepare student query: " . $conn->error);
    }

    $stmt->bind_param("s", $id_number);
    $stmt->execute();
    $result = $stmt->get_result();
    $patient_data = $result->fetch_assoc();
    $stmt->close();

    // If not found in student_patient, check personnel_patient table
    if (!$patient_data) {
        $stmt = $conn->prepare("SELECT Patient_ID FROM personnel_patient WHERE Personnel_ID = ?");
        if (!$stmt) {
            throw new Exception("Failed to prepare personnel query: " . $conn->error);
        }

        $stmt->bind_param("s", $id_number);
        $stmt->execute();
        $result = $stmt->get_result();
        $patient_data = $result->fetch_assoc();
        $stmt->close();
    }

    if ($patient_data) {
        $patient_id = $patient_data['Patient_ID'];
        $time_in = date('Y-m-d H:i:s');
        
        $insert = $conn->prepare("INSERT INTO visit_records (Patient_ID, Time_In, Reason) VALUES (?, ?, ?)");
        if (!$insert) {
            throw new Exception("Failed to prepare insert query: " . $conn->error);
        }

        $insert->bind_param("iss", $patient_id, $time_in, $reason);
        if (!$insert->execute()) {
            throw new Exception("Failed to insert visit record: " . $insert->error);
        }
        $insert->close();

        http_response_code(200);
        echo json_encode([
            "status" => "success",
            "message" => "Time in recorded successfully"
        ]);
    } else {
        sendError("ID number not found in our records");
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Server error: " . $e->getMessage()
    ]);
}

$db->close();
?>
