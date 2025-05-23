<?php
session_start();
require_once __DIR__ . '../php/database.php';

// Set timezone to Asia/Manila for all date operations
date_default_timezone_set('Asia/Manila');

$db = new Database();
$conn = $db->getConnection();

if ($conn->connect_error) {
    error_log("Connection failed: " . $conn->connect_error);
    echo json_encode(['success' => false, 'error' => 'Database connection failed: ' . $conn->connect_error]);
    exit;
}

// Query to fetch borrowed item records with user details
$sql = "SELECT 
    br.Item_ID,              -- Added Item_ID for data-item-id
    br.BorrowedItem_ID,
    p.Patient_ID,            -- Included for data-patient-id
    CONCAT(p.First_Name, ' ', COALESCE(p.Middle_Name, ''), ' ', p.Last_Name) as FullName,
    p.Category,
    CASE 
        WHEN p.Category = 'student' THEN (
            SELECT CONCAT(sp.Student_ID, ' - ', sp.Department, ' - ', sp.Program, ' ', sp.Batch)
            FROM student_patient sp 
            WHERE sp.Patient_ID = p.Patient_ID
        )
        WHEN p.Category IN ('teaching', 'non-teaching') THEN (
            SELECT CONCAT(pp.Personnel_ID, ' - ', pp.Department)
            FROM personnel_patient pp 
            WHERE pp.Patient_ID = p.Patient_ID
        )
    END as DepartmentInfo,
    i.Item_Name,
    br.Quantity,
    br.Date_Borrowed,
    br.Date_Returned,
    br.Status,
    br.Photo_Borrowed,
    br.Photo_Returned
FROM borroweditem_records br
JOIN patient p ON br.Patient_ID = p.Patient_ID
JOIN item i ON br.Item_ID = i.Item_ID
ORDER BY br.Date_Borrowed DESC";

$result = $conn->query($sql);

$records = array();
if ($result) {
    while ($row = $result->fetch_assoc()) {
        // Format dates
        $row['Date_Borrowed'] = date('Y-m-d H:i:s', strtotime($row['Date_Borrowed']));
        if ($row['Date_Returned']) {
            $row['Date_Returned'] = date('Y-m-d H:i:s', strtotime($row['Date_Returned']));
        }
        
        // Split DepartmentInfo into ID_Number and other details
        $departmentInfo = explode(' - ', $row['DepartmentInfo']);
        $row['ID_Number'] = isset($departmentInfo[0]) ? $departmentInfo[0] : '';
        $row['DepartmentInfo'] = implode(' - ', array_slice($departmentInfo, 1));
        
        // Handle photo paths
        $row['Photo_Borrowed'] = $row['Photo_Borrowed'] ? '../Uploads/' . $row['Photo_Borrowed'] : null; // Match case with return_item.php
        $row['Photo_Returned'] = $row['Photo_Returned'] ? '../Uploads/' . $row['Photo_Returned'] : null; // Match case with return_item.php
        
        $records[] = $row;
        error_log("Fetched record: Item_ID={$row['Item_ID']}, Patient_ID={$row['Patient_ID']}, ID_Number={$row['ID_Number']}"); // Debug log
    }
} else {
    error_log("Query failed: " . $conn->error);
    echo json_encode(['success' => false, 'error' => 'Failed to fetch borrowed records: ' . $conn->error]);
    exit;
}

header('Content-Type: application/json');
echo json_encode($records);
$conn->close();
?>