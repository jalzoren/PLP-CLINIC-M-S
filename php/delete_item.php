<?php
require_once __DIR__ . '/database.php';

// Get the raw POST data
$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['id'])) {
    echo "Missing ID";
    exit;
}

$itemId = intval($data['id']); // sanitize

try {
    $db = new Database();
    $conn = $db->getConnection();

    $stmt = $conn->prepare("DELETE FROM item WHERE Item_ID = ?");
    $stmt->bind_param("i", $itemId);

    if ($stmt->execute()) {
        echo "success";
    } else {
        echo "Failed to delete";
    }

    $stmt->close();
    $conn->close();
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
