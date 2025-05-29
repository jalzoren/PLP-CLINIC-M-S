<?php
require_once '../php/database.php';

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
$stmt->bind_param("i", $id_number);
$stmt->execute();
$stmt->bind_result($count);
$stmt->fetch();
$stmt->close();

if ($count > 0) {
    echo json_encode(["status" => "duplicate"]);
} else {
    echo json_encode(["status" => "ok"]);
}
?>
