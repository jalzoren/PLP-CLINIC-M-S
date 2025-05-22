<?php
// Include database class
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

try {
    // Query to count patients by category
    $query = "SELECT Category, COUNT(*) as count 
              FROM patient 
              WHERE Category IN ('student', 'teaching', 'non-teaching') 
              GROUP BY Category";
    $result = $conn->query($query);

    if ($result === false) {
        throw new Exception("Database query failed: " . $conn->error);
    }

    // Initialize data array
    $data = [
        'Student' => 0,
        'Teaching' => 0,
        'Non-Teaching' => 0,
        'Total' => 0
    ];

    // Populate counts with proper case mapping
    while ($row = $result->fetch_assoc()) {
        $category = $row['Category'];
        if ($category === 'student') {
            $data['Student'] = (int)$row['count'];
        } elseif ($category === 'teaching') {
            $data['Teaching'] = (int)$row['count'];
        } elseif ($category === 'non-teaching') {
            $data['Non-Teaching'] = (int)$row['count'];
        }
    }
    $data['Total'] = array_sum([$data['Student'], $data['Teaching'], $data['Non-Teaching']]);

    // Return JSON response
    echo json_encode([
        'status' => 'success',
        'data' => $data
    ]);

    // Close connection
    $db->close();
} catch (Exception $e) {
    error_log("Query error: " . $e->getMessage());
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}
?>