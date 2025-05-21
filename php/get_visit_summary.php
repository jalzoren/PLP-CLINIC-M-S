<?php
require_once 'database.php';

header('Content-Type: application/json');

// Instantiate database connection
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

// Get time range (default: 7 days)
$days = isset($_GET['days']) && is_numeric($_GET['days']) ? (int)$_GET['days'] : 7;
$days = max(1, min($days, 365)); // Limit between 1 and 365 days

// Prepare query to fetch detailed visit records
$stmt = $conn->prepare(
    "SELECT id, DATE(Time_In) AS visit_date, TIME(Time_In) AS time_in, 
            full_name, category, department, reason, medication, quantity, remarks
     FROM visit_records
     WHERE Time_In >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
     ORDER BY Time_In ASC"
);

if (!$stmt) {
    error_log("Prepare failed: " . $conn->error);
    exit(json_encode([
        'status' => 'error',
        'message' => 'Database query preparation failed.'
    ]));
}

$stmt->bind_param("i", $days);

if (!$stmt->execute()) {
    error_log("Execute failed: " . $stmt->error);
    exit(json_encode([
        'status' => 'error',
        'message' => 'Failed to fetch visit data.'
    ]));
}

// Fetch results
$result = $stmt->get_result();
$data = [];
while ($row = $result->fetch_assoc()) {
    $data[] = [
        'id' => (int)$row['id'],
        'date' => $row['visit_date'],
        'time_in' => $row['time_in'],
        'full_name' => $row['full_name'],
        'category' => $row['category'],
        'department' => $row['department'],
        'reason' => $row['reason'],
        'medication' => $row['medication'],
        'quantity' => (int)$row['quantity'],
        'remarks' => $row['remarks']
    ];
}

$stmt->close();
$db->close();

// Return JSON response
echo json_encode([
    'status' => 'success',
    'data' => $data
]);
?>