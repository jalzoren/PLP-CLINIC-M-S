<?php
session_start();
require_once '../php/database.php';

// Check if user is logged in
if (!isset($_SESSION['Patient_ID'])) {
    header("Location: ../php/login.php");
    exit();
}

// Fetch patient information
$patient_id = $_SESSION['Patient_ID'];
$query = "SELECT p.*, u.Email 
          FROM patient p 
          LEFT JOIN users u ON p.Patient_ID = u.Patient_ID 
          WHERE p.Patient_ID = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("i", $patient_id);
$stmt->execute();
$result = $stmt->get_result();
$patient = $result->fetch_assoc();

// Calculate age
$birthdate = new DateTime($patient['Birthdate']);
$today = new DateTime();
$age = $birthdate->diff($today)->y;

// Fetch borrowed items
$query = "SELECT * FROM borrowed_items WHERE Patient_ID = ? ORDER BY Date_Borrowed DESC";
$stmt = $conn->prepare($query);
$stmt->bind_param("i", $patient_id);
$stmt->execute();
$borrowedItems = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);

// Prepare response data
$response = [
    'success' => true,
    'patient' => $patient,
    'age' => $age,
    'email' => $patient['Email'],
    'borrowedItems' => $borrowedItems
];

// Include the HTML template
include 'userdashboard.html';
?> 