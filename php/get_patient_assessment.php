<?php
require 'database.php';  // adjust path if needed

header('Content-Type: application/json');

try {
    $db = new Database();
    $conn = $db->getConnection();

    if (isset($_GET['patient_id']) && is_numeric($_GET['patient_id'])) {
        $patient_id = intval($_GET['patient_id']);
        $stmt = $conn->prepare("SELECT * FROM patient_assessment WHERE Patient_ID = ?");
        if (!$stmt) {
            http_response_code(500);
            echo json_encode(['error' => 'Database prepare failed: ' . $conn->error]);
            exit;
        }
        $stmt->bind_param("i", $patient_id);
        $stmt->execute();
        $result = $stmt->get_result();

        $data = $result->fetch_all(MYSQLI_ASSOC);
        echo json_encode($data);
    } else {
        echo json_encode(['error' => 'Invalid or missing patient_id']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
