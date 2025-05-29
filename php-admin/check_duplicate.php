<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header('Content-Type: application/json');

require_once '../php/database.php';

try {
    $db = new Database();
    $conn = $db->getConnection();
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);
$id_number = $data["id_number"] ?? null;
$category = $data["category"] ?? null;

if (!$id_number || !$category) {
    echo json_encode(["status" => "error", "message" => "Missing ID or category"]);
    exit;
}

if ($category === "student") {
    $query = "SELECT COUNT(*) FROM student_patient WHERE Student_ID = ?";
} elseif ($category === "personnel") {
    $query = "SELECT COUNT(*) FROM personnel_patient WHERE Personnel_ID = ?";
} else {
    echo json_encode(["status" => "invalid_category"]);
    exit;
}

$stmt = $conn->prepare($query);

if (!$stmt) {
    echo json_encode(["status" => "error", "message" => "Prepare failed: " . $conn->error]);
    exit;
}

$stmt->bind_param("s", $id_number); 
$stmt->execute();
$stmt->bind_result($count);
$stmt->fetch();
$stmt->close();

if ($count > 0) {
    echo json_encode(["status" => "duplicate"]);
} else {
    echo json_encode(["status" => "ok"]);
}

$db->close();
exit;
