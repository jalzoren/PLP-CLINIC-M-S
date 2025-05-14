<?php
require 'database.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['visit_id'])) {
    $visit_id = $_POST['visit_id'];
    $stmt = $conn->prepare("UPDATE visit_records SET Time_Out = NOW() WHERE Visit_ID = ?");
    $stmt->bind_param("i", $visit_id);

    if ($stmt->execute()) {
        echo "success";
    } else {
        echo "Error updating time out.";
    }
    $stmt->close();
}
?>