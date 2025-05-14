<?php
require_once __DIR__ . '/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $itemName  = $_POST['itemName'] ?? '';
    $category  = $_POST['category'] ?? '';
    $quantity  = $_POST['quantity'] ?? '';

    // Basic validation
    if (empty($itemName) || empty($category) || empty($quantity)) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'All fields are required.']);
        exit;
    }

    try {
        $db   = new Database();
        $conn = $db->getConnection();

        $stmt = $conn->prepare("INSERT INTO item (Item_Name, Category, Status, Quantity) VALUES (?, ?, 'Available', ?)");
        $stmt->bind_param("ssi", $itemName, $category, $quantity);

        if ($stmt->execute()) {
            $insertedId = $conn->insert_id;
            echo json_encode(['status' => 'success', 'message' => 'Item added successfully.', 'id' => $insertedId]);
        } else {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => 'Failed to insert item.']);
        }

        $stmt->close();
        $conn->close();
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Server error: ' . $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method.']);
}
