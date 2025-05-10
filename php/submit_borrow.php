<?php
// include the class definition
require_once __DIR__ . '/database.php';

// instantiate and get the mysqli connection
$db   = new Database();
$conn = $db->getConnection();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $item_id        = isset($_POST['item_id'])  ? (int)$_POST['item_id']   : null;
    $quantity       = isset($_POST['quantity']) ? (int)$_POST['quantity']  : null;
    $reason         = $_POST['reason']           ?? '';
    $photo_borrowed = 'no-image.png';  // Default fallback

    if (!empty($_POST['photo_borrowed'])) {
        $imgData = $_POST['photo_borrowed'];

        if (strpos($imgData, 'base64,') !== false) {
            // Extract base64
            $imgData = explode(',', $imgData)[1];
            $imgData = base64_decode($imgData);

            // Generate a unique filename
            $fileName = time() . '_borrowed.png';
            $filePath = __DIR__ . '/../uploads/' . $fileName;

            // Save the image
            if (file_put_contents($filePath, $imgData)) {
                $photo_borrowed = $fileName;
            } else {
                echo "Error saving photo.";
                exit;
            }
        }
    }

    // Check if there is enough quantity in the item table
    $sqlCheckQuantity = "SELECT Quantity FROM item WHERE Item_ID = ?";
    $stmtCheck = $conn->prepare($sqlCheckQuantity);
    $stmtCheck->bind_param('i', $item_id);
    $stmtCheck->execute();
    $stmtCheck->bind_result($available_quantity);
    $stmtCheck->fetch();
    $stmtCheck->close();

    date_default_timezone_set('Asia/Manila');
    
    if ($available_quantity >= $quantity) {
        // Proceed with insert if enough stock
        // Insert into borroweditem_records table
        $patient_id    = 1;
        $date_borrowed = date('Y-m-d H:i:s');
        $date_returned = null;
        $status        = 'Borrowed';
        $photo_returned= null;

        $sql = "
          INSERT INTO borroweditem_records
            (Patient_ID, Item_ID, Quantity, Date_Borrowed, Date_Returned, Status, Photo_Borrowed, Photo_Returned)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ";

        $stmt = $conn->prepare($sql);
        if (!$stmt) {
            die("Prepare failed: " . $conn->error);
        }

        $stmt->bind_param(
          "iiisssss",
          $patient_id,
          $item_id,
          $quantity,
          $date_borrowed,
          $date_returned,
          $status,
          $photo_borrowed,
          $photo_returned
        );

        if ($stmt->execute()) {
            // Update the quantity in the item table
            $new_quantity = $available_quantity - $quantity;
            $sqlUpdateQuantity = "UPDATE item SET Quantity = ?, Status = CASE WHEN Quantity - ? > 0 THEN 'Available' ELSE 'Unavailable' END WHERE Item_ID = ?";
            $stmtUpdate = $conn->prepare($sqlUpdateQuantity);
            $stmtUpdate->bind_param('iii', $new_quantity, $new_quantity, $item_id);

            if ($stmtUpdate->execute()) {
                header("Location: ../forms-user/userdashboard.html");
                exit;
            } else {
                echo "Error updating item quantity: " . $stmtUpdate->error;
            }
        } else {
            echo "Error inserting borrow record: " . $stmt->error;
        }
    } else {
        echo "Not enough stock available for the item.";
    }
}

// close
$db->close();
?>
