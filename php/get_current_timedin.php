<?php
require_once 'database.php';

$timedinData = [];

try {
    $db = new Database();
    $conn = $db->getConnection();

    $sql = "SELECT vr.Visit_ID, vr.Time_In, 
                CONCAT(p.Last_Name, ', ', p.First_Name, ' ', p.Middle_Name) AS Full_Name
            FROM visit_records vr
            JOIN patient p ON vr.Patient_ID = p.Patient_ID
            WHERE vr.Time_Out IS NULL
            ORDER BY vr.Time_In DESC";

    $result = $conn->query($sql);

    if ($result && $result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $timedinData[] = $row;
        }
    }

    $db->close(); // Clean up

} catch (Exception $e) {
    die("Error: " . $e->getMessage());
}
?>
