<?php
require_once 'database.php';
header('Content-Type: application/json');

try {
    $db = new Database();
    $conn = $db->getConnection();
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Database connection failed: ' . $e->getMessage()
    ]);
    exit;
}

$days = isset($_GET['days']) && is_numeric($_GET['days']) ? intval($_GET['days']) : 7;

$sql = "
    SELECT 
        DATE(Time_In) AS date,
        TIME(Time_In) AS time_in,
        TIME(Time_Out) AS time_out,
        COALESCE(CONCAT(p.Last_Name, ', ', p.First_Name, ' ', COALESCE(p.Middle_Name, '')), 'Unknown') AS full_name,
        p.Category AS category,
        p.Department_Course AS department,
        vr.Reason AS reason,
        vr.Medicine AS medication,
        vr.Quantity AS quantity,
        vr.Remarks AS remarks
    FROM visit_records vr
    LEFT JOIN patient p ON vr.Patient_ID = p.Patient_ID
    WHERE Time_In >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
    ORDER BY Time_In DESC
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $days);
$stmt->execute();
$result = $stmt->get_result();

$visitData = [];
while ($row = $result->fetch_assoc()) {
    $visitData[] = $row;
}

$stmt->close();
$db->close();

echo json_encode([
    'status' => 'success',
    'data' => [
        'details' => $visitData
    ]
]);
