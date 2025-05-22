<?php
require_once 'database.php';

$timedinData = [];

try {
    $db = new Database();
    $conn = $db->getConnection();

    $sql = "SELECT 
                vr.Visit_ID, 
                vr.Time_In, 
                vr.Patient_ID,
                COALESCE(
                    CONCAT(p.Last_Name, ', ', p.First_Name, ' ', COALESCE(p.Middle_Name, '')),
                    CONCAT('Unknown Patient (ID: ', vr.Patient_ID, ')')
                ) AS Full_Name,
                p.Category
            FROM visit_records vr
            LEFT JOIN patient p ON vr.Patient_ID = p.Patient_ID
            WHERE vr.Time_Out IS NULL
            ORDER BY vr.Time_In DESC";

    $result = $conn->query($sql);

    if ($result && $result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $timedinData[] = $row;
        }
    }

    $db->close();

} catch (Exception $e) {
    error_log("Error in get_current_timedin.php: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Failed to fetch timed-in data: ' . $e->getMessage()]);
    exit;
}

?>