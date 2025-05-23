<?php
session_start();
header('Content-Type: application/json');
require_once '../php/database.php';

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'error' => 'Not logged in']);
    exit;
}

$db = new Database();
$conn = $db->getConnection();

$user_id = $_SESSION['user_id'];

// Fetch user
$stmt = $conn->prepare("SELECT * FROM users WHERE User_ID = ?");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$user = $stmt->get_result()->fetch_assoc();
$stmt->close();

if ($user && $user['Role'] === 'user' && $user['Patient_ID']) {
    $pid = $user['Patient_ID'];

    // Fetch patient info
    $pstmt = $conn->prepare("SELECT Patient_ID, First_Name, Middle_Name, Last_Name, Sex, Category, Birthdate, Age FROM patient WHERE Patient_ID = ?");
    $pstmt->bind_param("i", $pid);
    $pstmt->execute();
    $patient = $pstmt->get_result()->fetch_assoc();
    $pstmt->close();

    echo json_encode([
        'success' => true,
        'patient' => $patient,
        'age' => $patient['Age'],           // Get age from DB, not calculated
        'email' => $user['Email']
    ]);
} else {
    echo json_encode(['success' => false, 'message' => 'Not authorized or no patient record']);
}

$db->close();
?>
