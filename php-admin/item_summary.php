<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../php/database.php';

try {
    $conn = (new Database())->getConnection();

    $sql = "SELECT Item_Name, Quantity FROM item";
    $stmt = $conn->prepare($sql);
    $stmt->execute();

    $result = $stmt->get_result();

    $data = [];

    while ($row = $result->fetch_assoc()) {
        $status = ($row['Quantity'] > 0) ? 'Available' : 'Not Available';
        $data[] = [
            "label" => $row['Item_Name'] . " (" . $status . ")",
            "value" => (int)$row['Quantity']
        ];
    }

    echo json_encode($data);

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Database error: ' . $e->getMessage()
    ]);
}
?>
