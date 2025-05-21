<?php
header('Content-Type: application/json');
require_once __DIR__ . '/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $itemName = $_POST['itemName'] ?? '';
    $category = $_POST['category'] ?? '';
    $quantity = isset($_POST['quantity']) ? (int)$_POST['quantity'] : 0;

    if (empty($itemName) || empty($category) || $quantity < 0) {
        echo json_encode(['status' => 'error', 'message' => 'Invalid input']);
        exit;
    }

    try {
        $db = new Database();
        $conn = $db->getConnection();

        $stmt = $conn->prepare("INSERT INTO item (Item_Name, Category, Quantity) VALUES (?, ?, ?)");
        $stmt->bind_param("ssi", $itemName, $category, $quantity);

        if ($stmt->execute()) {
            $itemId = $conn->insert_id;
            echo json_encode(['status' => 'success', 'id' => $itemId]);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Failed to add item']);
        }

        $stmt->close();
        $conn->close();
    } catch (Exception $e) {
        echo json_encode(['status' => 'error', 'message' => 'Server error: ' . $e->getMessage()]);
    }
}
?>