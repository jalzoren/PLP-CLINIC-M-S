<?php
// Database connection
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "clinic_system";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Query to fetch borrowed item records with user details
$sql = "SELECT 
    br.BorrowedItem_ID,
    p.Patient_ID,
    CONCAT(p.First_Name, ' ', COALESCE(p.Middle_Name, ''), ' ', p.Last_Name) as FullName,
    p.Category,
    CASE 
        WHEN p.Category = 'student' THEN (
            SELECT CONCAT(sp.Student_ID, ' - ', sp.Department, ' - ', sp.Program, ' ', sp.Batch)
            FROM student_patient sp 
            WHERE sp.Patient_ID = p.Patient_ID
        )
        WHEN p.Category = 'personnel' THEN (
            SELECT CONCAT(pp.Personnel_ID, ' - ', pp.Department)
            FROM personnel_patient pp 
            WHERE pp.Patient_ID = p.Patient_ID
        )
        ELSE 'N/A'
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
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        // Format dates
        $row['Date_Borrowed'] = date('Y-m-d H:i:s', strtotime($row['Date_Borrowed']));
        if ($row['Date_Returned']) {
            $row['Date_Returned'] = date('Y-m-d H:i:s', strtotime($row['Date_Returned']));
        }
        
        // Split DepartmentInfo into ID and other details
        $departmentInfo = explode(' - ', $row['DepartmentInfo']);
        $row['ID_Number'] = $departmentInfo[0];
        $row['DepartmentInfo'] = implode(' - ', array_slice($departmentInfo, 1));
        
        // Handle photo paths
        $row['Photo_Borrowed'] = $row['Photo_Borrowed'] ? '../uploads/' . $row['Photo_Borrowed'] : null;
        $row['Photo_Returned'] = $row['Photo_Returned'] ? '../uploads/' . $row['Photo_Returned'] : null;
        
        $records[] = $row;
    }
}

echo json_encode($records);
$conn->close();
?> 