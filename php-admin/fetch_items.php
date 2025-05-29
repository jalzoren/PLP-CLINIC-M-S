<?php
header('Content-Type: application/json');
require_once '../php/database.php';

try {
    $database = new Database();
    $conn = $database->getConnection();

    // Get search and filter parameters
    $search = isset($_GET['search']) ? $_GET['search'] : '';
    $category = isset($_GET['category']) ? $_GET['category'] : '';

    // Base SQL query
    $sql = "SELECT Item_ID, Item_Name, Category, Status, Quantity FROM item WHERE 1=1";
    
    if (!empty($search)) {
        $search = "%{$search}%";
        $sql .= " AND Item_Name LIKE ?";
    }

    // Add category filter if category parameter is provided
    if (!empty($category)) {
        $sql .= " AND Category = ?";
    }

    // Prepare and execute the statement
    $stmt = $conn->prepare($sql);

    // Bind parameters based on which filters are active
    if (!empty($search) && !empty($category)) {
        $stmt->bind_param("ss", $search, $category);
    } elseif (!empty($search)) {
        $stmt->bind_param("s", $search);
    } elseif (!empty($category)) {
        $stmt->bind_param("s", $category);
    }

    $stmt->execute();
    $result = $stmt->get_result();
    $items = [];

    if ($result && $result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            if ($row['Quantity'] > 0) {
                $row['Status'] = 'Available';
            } else {
                $row['Status'] = 'Unavailable';
            }
            $items[] = $row;
        }
    }

    echo json_encode($items);

    $stmt->close();
    $database->close();
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>
