<?php
session_start();
require_once '../php/database.php';

header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'error' => 'User not logged in']);
    exit;
}

$db = new Database();
$conn = $db->getConnection();

$user_id = $_SESSION['user_id'];

// Get Patient_ID from users table
$stmt = $conn->prepare("SELECT Patient_ID FROM users WHERE User_ID = ?");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();
$stmt->close();

if (!$user || !$user['Patient_ID']) {
    echo json_encode(['success' => false, 'error' => 'No associated patient record found']);
    exit;
}

$patient_id = $user['Patient_ID'];
error_log('Patient_ID: ' . $patient_id);

$sql = "SELECT 
    br.BorrowedItem_ID,
    br.Item_ID,
    br.Date_Borrowed,
    br.Date_Returned,
    br.Quantity,
    br.Status,
    br.Photo_Borrowed,
    br.Photo_Returned,
    i.Item_Name,
    p.Patient_ID,
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
    END as DepartmentInfo
FROM borroweditem_records br
JOIN item i ON br.Item_ID = i.Item_ID
JOIN patient p ON br.Patient_ID = p.Patient_ID
WHERE br.Patient_ID = ?
ORDER BY br.Date_Borrowed DESC";

$stmt = $conn->prepare($sql);
if (!$stmt) {
    error_log("Prepare failed: " . $conn->error);
    echo json_encode(['success' => false, 'error' => 'Failed to prepare query: ' . $conn->error]);
    exit;
}

$stmt->bind_param("i", $patient_id);
if (!$stmt->execute()) {
    error_log("Execute failed: " . $stmt->error);
    echo json_encode(['success' => false, 'error' => 'Query execution failed: ' . $stmt->error]);
    $stmt->close();
    exit;
}

$result = $stmt->get_result();
$records = [];

while ($row = $result->fetch_assoc()) {
    date_default_timezone_set('Asia/Manila');
    $row['Date_Borrowed'] = date('Y-m-d H:i:s', strtotime($row['Date_Borrowed']));
    if ($row['Date_Returned']) {
        $dt = new DateTime($row['Date_Returned']);
        $row['Date_Returned'] = $dt->format('m/d/Y, h:i A');
    }
    
    $departmentInfo = explode(' - ', $row['DepartmentInfo'] ?? '');
    $row['ID_Number'] = isset($departmentInfo[0]) ? $departmentInfo[0] : '';
    $row['DepartmentInfo'] = implode(' - ', array_slice($departmentInfo, 1));
    
    $row['Photo_Borrowed'] = $row['Photo_Borrowed'] ? '../Uploads/' . $row['Photo_Borrowed'] : null;
    $row['Photo_Returned'] = $row['Photo_Returned'] ? '../Uploads/' . $row['Photo_Returned'] : null;
    
    $records[] = $row;
}

echo json_encode(['success' => true, 'items' => $records]);

$stmt->close();
$db->close();
?>