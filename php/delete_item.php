<?php
require_once __DIR__ . '/database.php';

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['id'])) {
    echo 'error';
    exit;
}

try {
    $db = new Database();
    $conn = $db->getConnection();

    $stmt = $conn->prepare("DELETE FROM item WHERE Item_ID = ?");
    $stmt->bind_param("i", $data['id']);

    if ($stmt->execute()) {
        echo 'success';
    } else {
        echo 'error';
    }

    $stmt->close();
    $conn->close();
} catch (Exception $e) {
    echo 'error';
}
?>