<?php
date_default_timezone_set('Asia/Manila');
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/php_errors.log');
error_reporting(E_ALL);
ob_start();

require_once 'php/database.php';
header("Content-Type: application/json");

function sendError($msg) {
    echo json_encode(["status" => "error", "message" => $msg]);
    ob_end_flush();
    exit;
}

$raw_input = file_get_contents("php://input");
error_log("Raw input received.");

$data = json_decode($raw_input, true);
if (json_last_error() !== JSON_ERROR_NONE) {
    error_log("JSON decode error: " . json_last_error_msg());
    sendError("Invalid JSON data.");
}

if (!isset($data['id_number']) || !isset($data['reason'])) {
    error_log("Missing fields: " . print_r($data, true));
    sendError("Missing required fields.");
}

$id_number = trim($data['id_number']);
$reason = trim($data['reason']);

if (!is_numeric($id_number) || $id_number <= 0) {
    error_log("Invalid ID number: " . $id_number);
    sendError("Invalid ID number.");
}

if (empty($reason)) {
    error_log("Empty reason");
    sendError("Reason cannot be empty.");
}

try {
    $db = new Database();
    $conn = $db->getConnection();

    if ($conn->connect_error) {
        error_log("Connection failed: " . $conn->connect_error);
        sendError("Database connection failed.");
    }

    error_log("Database connected successfully");

    // First check student_patient table
    $stmt = $conn->prepare("SELECT Patient_ID FROM student_patient WHERE Student_ID = ?");
    if (!$stmt) {
        error_log("Prepare failed: " . $conn->error);
        sendError("Database query preparation failed.");
    }

    $stmt->bind_param("s", $id_number);
    $stmt->execute();
    $stmt->bind_result($patient_id);
    $stmt->fetch();
    $stmt->close();

    // If not found in student_patient, check personnel_patient table
    if (!$patient_id) {
        $stmt = $conn->prepare("SELECT Patient_ID FROM personnel_patient WHERE Personnel_ID = ?");
        if (!$stmt) {
            error_log("Prepare failed: " . $conn->error);
            sendError("Database query preparation failed.");
        }

        $stmt->bind_param("s", $id_number);
        $stmt->execute();
        $stmt->bind_result($patient_id);
        $stmt->fetch();
        $stmt->close();
    }

    error_log("Patient_ID query result: " . ($patient_id ? $patient_id : "none"));

    if ($patient_id) {
        $time_in = date('Y-m-d H:i:s');
        $insert = $conn->prepare("INSERT INTO visit_records (Patient_ID, Time_In, Reason) VALUES (?, ?, ?)");
        if (!$insert) {
            error_log("Insert prepare failed: " . $conn->error);
            sendError("Database insert preparation failed.");
        }

        $insert->bind_param("iss", $patient_id, $time_in, $reason);
        $insert->execute();
        $insert->close();
        error_log("Visit recorded for Patient_ID: " . $patient_id);

        echo json_encode(["status" => "success", "message" => "Time in recorded successfully."]);
    } else {
        error_log("ID not found: " . $id_number);
        sendError("ID number not found in our records.");
    }

    $db->close();
} catch (Exception $e) {
    error_log("Time-in error: " . $e->getMessage());
    sendError("An error occurred while processing your time-in.");
}

ob_end_flush();
?>
