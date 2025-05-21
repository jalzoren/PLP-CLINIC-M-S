<?php
header('Content-Type: application/json');
require_once '../php/database.php';

try {
    $database = new Database();
    $conn = $database->getConnection();

    $sql = "SELECT Item_ID, Item_Name, Category, Quantity, Description FROM item";
    $result = $conn->query($sql);

    $items = [];

    if ($result && $result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $row['Status'] = ($row['Quantity'] > 0) ? 'Available' : 'Unavailable';
            $items[] = $row;
        }
    }

    echo json_encode($items);

    $database->close();
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>