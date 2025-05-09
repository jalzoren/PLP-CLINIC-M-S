<?php
// Turn on full error reporting for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json');

require_once __DIR__ . '/database.php';

try {
    $conn = (new Database())->getConnection();

    $sql = "SELECT 
                SUM(CASE WHEN Quantity > 0 THEN 1 ELSE 0 END) AS available_count,
                SUM(CASE WHEN Quantity = 0 THEN 1 ELSE 0 END) AS not_available_count
            FROM item";

    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $result = $stmt->get_result()->fetch_assoc();

    if (!$result) {
        throw new Exception("No result returned from query.");
    }

    $data = [
        ["label" => "Available", "value" => (int)$result['available_count']],
        ["label" => "Not Available", "value" => (int)$result['not_available_count']]
    ];

    echo json_encode($data);

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Server error',
        'message' => $e->getMessage(),
        'file' => $e->getFile(),
        'line' => $e->getLine()
    ]);
}
