<?php
session_start();
require_once __DIR__ . '../php/database.php';

if (!isset($_SESSION['Patient_ID'])) {
    echo json_encode(['status' => 'error', 'message' => 'User not logged in']);
    exit;
}

$db = new Database();
$conn = $db->getConnection();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $item_id = isset($_POST['item_id']) ? (int)$_POST['item_id'] : null;
    $item_status = $_POST['item_status'] ?? '';
    $photo_returned = 'no-image.png';
    $patient_id = $_SESSION['Patient_ID'];

    if (!empty($_POST['photo_returned'])) {
        $imgData = $_POST['photo_returned'];
        if (strpos($imgData, 'base64,') !== false) {
            $imgData = explode(',', $imgData)[1];
            $imgData = base64_decode($imgData);
            $fileName = time() . '_returned.png';
            $filePath = __DIR__ . '/../Uploads/' . $fileName;

            if (file_put_contents($filePath, $imgData)) {
                $photo_returned = $fileName;
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Error saving photo']);
                exit;
            }
        }
    }

    date_default_timezone_set('Asia/Manila');
    $date_returned = date('Y-m-d H:i:s');

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

    $update_sql = "UPDATE borroweditem_records
                   SET Status = ?, Photo_Returned = ?, Date_Returned = ?
                   WHERE Patient_ID = ? AND Item_ID = ? AND Status = 'Borrowed'
                   ORDER BY Date_Borrowed DESC
                   LIMIT 1";

    $stmt = $conn->prepare($update_sql);
    $stmt->bind_param('sssii', $item_status, $photo_returned, $date_returned, $patient_id, $item_id);

    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            $update_qty_sql = "UPDATE item SET Quantity = Quantity + ? WHERE Item_ID = ?";
            $update_qty_stmt = $conn->prepare($update_qty_sql);
            $update_qty_stmt->bind_param('ii', $borrowed_qty, $item_id);
            $update_qty_stmt->execute();

            $check_qty_sql = "SELECT Quantity, Item_Name FROM item WHERE Item_ID = ?";
            $check_qty_stmt = $conn->prepare($check_qty_sql);
            $check_qty_stmt->bind_param('i', $item_id);
            $check_qty_stmt->execute();
            $check_qty_result = $check_qty_stmt->get_result();
            $is_unavailable = false;
            $item_name = '';

            if ($check_qty_row = $check_qty_result->fetch_assoc()) {
                if ($check_qty_row['Quantity'] <= 0) {
                    $is_unavailable = true;
                    $item_name = $check_qty_row['Item_Name'];
                }
            }
            $check_qty_stmt->close();
            $update_qty_stmt->close();

            echo json_encode([
                'status' => 'success',
                'redirect' => '../forms-user/userdashboard.html',
                'unavailable' => $is_unavailable,
                'item_name' => $item_name
            ]);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'No matching borrowed record found']);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Error updating return: ' . $stmt->error]);
    }

    $stmt->close();
    $db->close();
}
?>