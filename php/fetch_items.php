<?php
header('Content-Type: application/json');
require_once 'Database.php'; // Include the class

try {
    $database = new Database();
    $conn = $database->getConnection();

    // Update the query to get the status dynamically based on quantity
    $sql = "
        SELECT 
            Item_ID, 
            Item_Name, 
            Category, 
            Status, 
            Quantity 
        FROM item
    ";

    $result = $conn->query($sql);

    $items = [];

    if ($result && $result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            // Update the status dynamically based on quantity
            if ($row['Quantity'] > 0) {
                $row['Status'] = 'Available';
            } else {
                $row['Status'] = 'Unavailable';
            }
            $items[] = $row;
        }
    }

    echo json_encode($items);
    $database->close();
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>
