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

// Prepare query
$stmt = $conn->prepare(
    "SELECT DATE(Time_In) AS visit_date, COUNT(*) AS visit_count
     FROM visit_records
     WHERE Time_In >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
     GROUP BY DATE(Time_In)
     ORDER BY visit_date ASC"
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
        'date' => $row['visit_date'],
        'count' => (int)$row['visit_count']
    ];
}

$stmt->close();
$db->close();

// Return JSON response
echo json_encode([
    'status' => 'success',
    'data' => $data
]);