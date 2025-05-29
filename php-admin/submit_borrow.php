<?php
session_start(); // Start session at the beginning
// include the class definition
require_once '../php/database.php';



// instantiate and get the mysqli connection
$db   = new Database();
$conn = $db->getConnection();


if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get and validate required fields
    $patient_id = isset($_SESSION['Patient_ID']) ? $_SESSION['Patient_ID'] : null;
    if (isset($_POST['patient_id'])) {
        $patient_id = $_POST['patient_id'];
    }
    if (isset($_GET['patient_id'])) {
        $patient_id = $_GET['patient_id'];
    }
    if (!$patient_id) {
        echo json_encode(['success' => false, 'items' => [], 'error' => 'No patient ID']);
        exit;
    }
    $item_id = isset($_POST['item_id']) ? (int)$_POST['item_id'] : null;
    $quantity = isset($_POST['quantity']) ? (int)$_POST['quantity'] : null;
    //$due_date = isset($_POST['due_date']) ? $_POST['due_date'] : null;

    // Validate required fields
    if (!$patient_id || !$item_id || !$quantity /*|| !$due_date*/) {
        echo "Error: Missing required fields.";
        exit;
    }

    // Handle photo upload
    $photo_borrowed = 'no-image.png';  // Default fallback
    if (!empty($_POST['photo_borrowed'])) {
        $imgData = $_POST['photo_borrowed'];
        if (strpos($imgData, 'base64,') !== false) {
            // Extract base64 data
            $imgData = explode(',', $imgData)[1];
            $imgData = base64_decode($imgData);

            // Generate unique filename
            $fileName = time() . '_borrowed.png';
            $filePath = __DIR__ . '/../uploads/' . $fileName;

            // Save the image
            if (file_put_contents($filePath, $imgData)) {
                $photo_borrowed = $fileName;
            } else {
                echo "Error: Failed to save photo.";
                exit;
            }
        }
    }

    try {
        // Start transaction
        $conn->begin_transaction();

        // Check if there is enough quantity available
        $sqlCheckQuantity = "SELECT Quantity FROM item WHERE Item_ID = ? FOR UPDATE";
        $stmtCheck = $conn->prepare($sqlCheckQuantity);
        if (!$stmtCheck) {
            throw new Exception("Prepare failed: " . $conn->error);
        }

        $stmtCheck->bind_param('i', $item_id);
        if (!$stmtCheck->execute()) {
            throw new Exception("Execute failed: " . $stmtCheck->error);
        }

        $result = $stmtCheck->get_result();
        $row = $result->fetch_assoc();
        $available_quantity = $row['Quantity'];

        if ($available_quantity < $quantity) {
            throw new Exception("Not enough stock available. Only " . $available_quantity . " items left.");
        }

        // Insert borrow record
        date_default_timezone_set('Asia/Manila');
        $date_borrowed = date('Y-m-d H:i:s');
        $status = 'Borrowed';

        $sql = "INSERT INTO borroweditem_records 
                (Patient_ID, Item_ID, Quantity, Date_Borrowed, Status, Photo_Borrowed) 
                VALUES (?, ?, ?, ?, ?, ?)";
        
        $stmt = $conn->prepare($sql);
        if (!$stmt) {
            throw new Exception("Prepare failed: " . $conn->error);
        }

        $stmt->bind_param("iiisss", 
            $patient_id, 
            $item_id, 
            $quantity, 
            $date_borrowed, 
            $status, 
            $photo_borrowed
        );

        if (!$stmt->execute()) {
            throw new Exception("Execute failed: " . $stmt->error);
        }

        // Update item quantity
        $new_quantity = $available_quantity - $quantity;
        $sqlUpdate = "UPDATE item 
                     SET Quantity = ?, 
                         Status = CASE WHEN ? > 0 THEN 'Available' ELSE 'Unavailable' END 
                     WHERE Item_ID = ?";
        
        $stmtUpdate = $conn->prepare($sqlUpdate);
        if (!$stmtUpdate) {
            throw new Exception("Prepare update failed: " . $conn->error);
        }

        $stmtUpdate->bind_param("iii", $new_quantity, $new_quantity, $item_id);
        if (!$stmtUpdate->execute()) {
            throw new Exception("Execute update failed: " . $stmtUpdate->error);
        }

        // Commit transaction
        $conn->commit();
        echo "Success";

    } catch (Exception $e) {
        // Rollback transaction on error
        $conn->rollback();
        echo "Error: " . $e->getMessage();
    } finally {
        // Close statements
        if (isset($stmtCheck)) $stmtCheck->close();
        if (isset($stmt)) $stmt->close();
        if (isset($stmtUpdate)) $stmtUpdate->close();
    }
} else {
    echo "Error: Invalid request method";
}

// close
$db->close();
?>
