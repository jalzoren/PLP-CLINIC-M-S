<?php
require_once 'database.php';

$data = json_decode(file_get_contents('php://input'), true);
$visit_id = $data['visit_id'];
$response = [];

if ($visit_id) {
    $stmt = $conn->prepare("UPDATE visit_records SET Time_Out = NOW() WHERE Visit_ID = ?");
    $stmt->bind_param("i", $visit_id);
    
    if ($stmt->execute()) {
        $response = ['status' => 'success', 'message' => 'Visitor has been timed out successfully.'];
    } else {
        $response = ['status' => 'error', 'message' => 'Failed to time out the visitor.'];
    }

    $stmt->close();
} else {
    $response = ['status' => 'error', 'message' => 'Invalid visit ID.'];
}

header('Content-Type: application/json');
echo json_encode($response);
$conn->close();
?>