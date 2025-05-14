<?php
require '../php/database.php'; // adjust as needed
header('Content-Type: application/json');

$sql = "SELECT s.Name, v.Visit_ID, v.Time_In 
        FROM visit_records v 
        JOIN students s ON v.Patient_ID = s.Student_ID 
        WHERE v.Time_Out IS NULL 
        ORDER BY v.Time_In DESC";

$result = $conn->query($sql);

$data = [];
while ($row = $result->fetch_assoc()) {
    $data[] = [
        'name' => htmlspecialchars($row['Name']),
        'time_in' => date("m/d/Y h:i A", strtotime($row['Time_In'])),
        'visit_id' => $row['Visit_ID']
    ];
}

echo json_encode($data);
?>
