<?php
session_start();

$db   = new Database();
$conn = $db->getConnection();

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Get the patient ID from the session
$patient_id = isset($_SESSION['Patient_ID']) ? $_SESSION['Patient_ID'] : null;

// Debug information
error_log("Session data: " . print_r($_SESSION, true));
error_log("Patient ID from session: " . $patient_id);

if (!$patient_id) {
    echo json_encode(['error' => 'No patient ID found in session']);
    exit;
}

// Query to fetch borrowed items for the specific patient
$sql = "SELECT 
    br.BorrowedItem_ID,
    br.Date_Borrowed,
    br.Date_Returned,
    i.Item_Name,
    br.Quantity,
    br.Status,
    br.Photo_Borrowed,
    br.Photo_Returned
FROM borroweditem_records br
JOIN item i ON br.Item_ID = i.Item_ID
WHERE br.Patient_ID = ?
ORDER BY br.Date_Borrowed DESC";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $patient_id);
$stmt->execute();
$result = $stmt->get_result();

error_log("Number of records found for patient {$patient_id}: " . $result->num_rows);

$records = array();
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        // Format dates
        $row['Date_Borrowed'] = date('Y-m-d H:i:s', strtotime($row['Date_Borrowed']));
        if ($row['Date_Returned']) {
            $row['Date_Returned'] = date('Y-m-d H:i:s', strtotime($row['Date_Returned']));
        }
        
        $records[] = $row;
    }
}

echo json_encode($records);
$stmt->close();
$conn->close();
?>
