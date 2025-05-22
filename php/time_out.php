<?php
date_default_timezone_set('Asia/Manila'); // Set your local timezone
require_once 'database.php';

header('Content-Type: application/json');

try {
    $db = new Database();
    $conn = $db->getConnection();
} catch (Exception $e) {
    error_log("Database connection failed: " . $e->getMessage());
    exit(json_encode([
        'status' => 'error',
        'message' => 'Unable to connect to the database.'
    ]));
}

$data = json_decode(file_get_contents('php://input'), true);
if (!$data) {
    error_log("Invalid JSON input: " . file_get_contents('php://input'));
    exit(json_encode([
        'status' => 'error',
        'message' => 'Invalid request data.'
    ]));
}

$visit_id = $data['visit_id'] ?? null;
$medicine = trim($data['medicine'] ?? '');
$quantity = isset($data['quantity']) ? (int)$data['quantity'] : 0;
$remarks = trim($data['remarks'] ?? '');

if (!$visit_id || !is_numeric($visit_id)) {
    error_log("Invalid visit ID: " . $visit_id);
    exit(json_encode([
        'status' => 'error',
        'message' => 'Invalid visit ID.'
    ]));
}

$stmt = $conn->prepare(
    "UPDATE visit_records
    SET Time_Out = NOW(),
        Medicine = ?,
        Quantity = ?,
        Remarks = ?
    WHERE Visit_ID = ?"
);

if (!$stmt) {
    error_log("Prepare failed: " . $conn->error);
    exit(json_encode([
        'status' => 'error',
        'message' => 'Database query preparation failed.'
    ]));
}

$stmt->bind_param("sisi", $medicine, $quantity, $remarks, $visit_id);

if ($stmt->execute()) {
    $response = [
        'status' => 'success',
        'message' => 'Visitor has been timed out successfully.'
    ];
} else {
    error_log("Execute failed: " . $stmt->error);
    $response = [
        'status' => 'error',
        'message' => 'Failed to update visitor record.'
    ];
}

$stmt->close();
$db->close();

echo json_encode($response);