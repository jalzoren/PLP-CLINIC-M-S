<?php
session_start(); // Start session at the beginning
require_once __DIR__ . '/database.php';

$db = new Database();
$conn = $db->getConnection();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $item_id = isset($_POST['item_id']) ? (int)$_POST['item_id'] : null;
    $item_status = $_POST['item_status'] ?? '';
    $patient_id = isset($_POST['patient_id']) ? (int)$_POST['patient_id'] : null;
    $photo_returned = 'no-image.png';

    // Log the received POST data
    error_log("Received POST data: item_id=$item_id, patient_id=$patient_id, item_status=$item_status");

    // Validate inputs
    if (!$patient_id || !$item_id || empty($item_status)) {
        error_log("Validation failed: patient_id=" . var_export($patient_id, true) . ", item_id=" . var_export($item_id, true) . ", item_status=" . var_export($item_status, true));
        echo json_encode(['success' => false, 'error' => 'Missing required fields: patient_id, item_id, or item_status']);
        exit;
    }

    // Handle photo upload (base64)
    if (!empty($_POST['photo_returned'])) {
        $imgData = $_POST['photo_returned'];
        error_log("Received photo data: " . substr($imgData, 0, 50) . "..."); // Log first 50 chars
        if (strpos($imgData, 'base64,') !== false) {
            $imgData = explode(',', $imgData)[1];
            $imgData = base64_decode($imgData);
            $fileName = time() . '_returned.png';
            $filePath = __DIR__ . '/../Uploads/' . $fileName;
            error_log("Attempting to save photo to: $filePath");

            if ($imgData === false) {
                error_log("Base64 decode failed");
                echo json_encode(['success' => false, 'error' => 'Invalid base64 photo data']);
                exit;
            }

            if (!file_put_contents($filePath, $imgData)) {
                error_log("Failed to save photo to $filePath");
                echo json_encode(['success' => false, 'error' => 'Error saving photo']);
                exit;
            }
            $photo_returned = $fileName;
        } else {
            error_log("Invalid photo data format");
            echo json_encode(['success' => false, 'error' => 'Invalid photo data format']);
            exit;
        }
    }

    date_default_timezone_set('Asia/Manila');
    $date_returned = date('Y-m-d H:i:s');

    // Get the quantity borrowed
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
    } else {
        echo json_encode(['success' => false, 'error' => 'No matching borrowed record found']);
        $qty_stmt->close();
        exit;
    }
    $qty_stmt->close();

    // Update the borrowed record
    $update_sql = "UPDATE borroweditem_records
                   SET Status = ?, Photo_Returned = ?, Date_Returned = ?
                   WHERE Patient_ID = ? AND Item_ID = ? AND Status = 'Borrowed'
                   ORDER BY Date_Borrowed DESC
                   LIMIT 1";
    $stmt = $conn->prepare($update_sql);
    $stmt->bind_param('sssii', $item_status, $photo_returned, $date_returned, $patient_id, $item_id);

    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            // Only update inventory if the item is not marked as lost
            if ($item_status !== 'Lost') {
                // Add returned quantity back to stock and update item status
                $update_qty_sql = "UPDATE item 
                                   SET Quantity = Quantity + ?, 
                                       Status = CASE WHEN Quantity + ? > 0 THEN 'Available' ELSE 'Unavailable' END 
                                   WHERE Item_ID = ?";
                $update_qty_stmt = $conn->prepare($update_qty_sql);
                $update_qty_stmt->bind_param('iii', $borrowed_qty, $borrowed_qty, $item_id);
                
                if ($update_qty_stmt->execute()) {
                    $update_qty_stmt->close();
                    echo json_encode(['success' => true]);
                } else {
                    echo json_encode(['success' => false, 'error' => 'Failed to update item quantity: ' . $update_qty_stmt->error]);
                    $update_qty_stmt->close();
                }
            } else {
                // If item is lost, just return success without updating inventory
                echo json_encode(['success' => true]);
            }
        } else {
            echo json_encode(['success' => false, 'error' => 'No matching borrowed record found']);
        }
    } else {
        echo json_encode(['success' => false, 'error' => 'Failed to update borrowed record: ' . $stmt->error]);
    }
    $stmt->close();
} else {
    echo json_encode(['success' => false, 'error' => 'Invalid request method']);
}

$db->close();
?>