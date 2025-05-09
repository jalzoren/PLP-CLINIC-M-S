<?php
require_once __DIR__ . '/database.php';

$db   = new Database();
$conn = $db->getConnection();

$patient_id = 1; // match return_item.php


$sql = "
  SELECT 
    r.BorrowedItem_ID   AS Borrow_ID,
    r.Date_Borrowed     AS Date_Borrowed,
    r.Date_Returned     AS Date_Returned,
    i.Item_Name         AS Item_Name,
    r.Quantity          AS Quantity,
    r.Status            AS Status,
    r.Photo_Borrowed    AS Photo_Borrowed,
    r.Photo_Returned    AS Photo_Returned
  FROM borroweditem_records r
  JOIN item i ON r.Item_ID = i.Item_ID
";

if ($patient_id !== null) {
  $sql .= " WHERE r.Patient_ID = ?";
  $stmt = $conn->prepare($sql);
  $stmt->bind_param('i', $patient_id);
} else {
  $stmt = $conn->prepare($sql);
}

$stmt->execute();
$result = $stmt->get_result();

$rows = [];
while ($row = $result->fetch_assoc()) {
  $rows[] = $row;
}

$stmt->close();
$db->close();

header('Content-Type: application/json');
echo json_encode($rows);
