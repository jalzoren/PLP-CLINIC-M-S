<?php
require_once 'database.php';

header('Content-Type: application/json');

$days = isset($_GET['days']) ? intval($_GET['days']) : 7;

try {
    $db = new Database();
    $conn = $db->getConnection();

    $stmt = $conn->prepare("
        SELECT 
            vr.Visit_ID,
            DATE(vr.Time_In) AS date,
            TIME(vr.Time_In) AS time_in,
            TIME(vr.Time_Out) AS time_out,
            COALESCE(CONCAT(p.Last_Name, ', ', p.First_Name, ' ', COALESCE(p.Middle_Name, '')), 'Unknown') AS full_name,
            p.Category AS category,
            p.Department AS department,
            vr.Reason AS reason,
            vr.Medicine AS medication,
            vr.Quantity AS quantity,
            vr.Remarks AS remarks
        FROM visit_records vr
        LEFT JOIN patient p ON vr.Patient_ID = p.Patient_ID
        WHERE vr.Time_In >= DATE_SUB(NOW(), INTERVAL ? DAY)
        ORDER BY vr.Time_In DESC
    ");
    $stmt->bind_param("i", $days);
    $stmt->execute();
    $result = $stmt->get_result();

    $visits = [];
    while ($row = $result->fetch_assoc()) {
        $visits[] = $row;
    }

    echo json_encode([
        'status' => 'success',
        'data' => [
            'details' => $visits
        ]
    ]);

    $stmt->close();
    $db->close();
} catch (Exception $e) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Failed to fetch visits: ' . $e->getMessage()
    ]);
}
