<?php
require_once __DIR__ . '/database.php';

$db = new Database();
$conn = $db->getConnection();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $item_id = isset($_POST['item_id']) ? (int)$_POST['item_id'] : null;
    $item_status = $_POST['item_status'] ?? '';
    $photo_returned = 'no-image.png';
    $patient_id = 1; // HARDCODED as requested

    // Handle photo upload (base64)
    if (!empty($_POST['photo_returned'])) {
        $imgData = $_POST['photo_returned'];
        if (strpos($imgData, 'base64,') !== false) {
            $imgData = explode(',', $imgData)[1];
            $imgData = base64_decode($imgData);
            $fileName = time() . '_returned.png';
            $filePath = __DIR__ . '/../uploads/' . $fileName;

            if (file_put_contents($filePath, $imgData)) {
                $photo_returned = $fileName;
            } else {
                echo "Error saving photo.";
                exit;
            }
        }
    }

    date_default_timezone_set('Asia/Manila');
    $date_returned = date('Y-m-d H:i:s');

    // First, get the quantity borrowed for that item
    $qty_sql = "SELECT Quantity FROM borroweditem_records 
                WHERE Patient_ID = ? AND Item_ID = ? AND Status = 'Borrowed'
                ORDER BY Date_Borrowed DESC
                LIMIT 1";

    $qty_stmt = $conn->prepare($qty_sql);
    $qty_stmt->bind_param('ii', $patient_id, $item_id);
    $qty_stmt->execute();
    $qty_result = $qty_stmt->get_result();
    $borrowed_qty = 0;

    if ($qty_row = $qty_result->fetch_assoc()) {
        $borrowed_qty = (int)$qty_row['Quantity'];
    }
    $qty_stmt->close();

    // Update the borrowed record with return details
    $update_sql = "UPDATE borroweditem_records
                   SET Status = ?, Photo_Returned = ?, Date_Returned = ?
                   WHERE Patient_ID = ? AND Item_ID = ? AND Status = 'Borrowed'
                   ORDER BY Date_Borrowed DESC
                   LIMIT 1";

    $stmt = $conn->prepare($update_sql);
    $stmt->bind_param('sssii', $item_status, $photo_returned, $date_returned, $patient_id, $item_id);

    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            // Add returned quantity back to stock
            $update_qty_sql = "UPDATE item SET Quantity = Quantity + ? WHERE Item_ID = ?";
            $update_qty_stmt = $conn->prepare($update_qty_sql);
            $update_qty_stmt->bind_param('ii', $borrowed_qty, $item_id);
            $update_qty_stmt->execute();
            $update_qty_stmt->close();

            header("Location: ../forms-user/userdashboard.html");
            exit;
        } else {
            echo "No matching borrowed record found.";
        }
    } else {
        echo "Error updating return: " . $stmt->error;
    }

    $stmt->close();
}

$db->close();
