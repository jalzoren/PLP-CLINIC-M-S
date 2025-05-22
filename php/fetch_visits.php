<?php
require_once 'database.php';

header('Content-Type: application/json');

// ==============================
// ==============================
// CREATE INDEX idx_time_in ON visit_records(Time_In);
// CREATE INDEX idx_patient_id ON patient(Patient_ID);
// CREATE INDEX idx_student_patient_id ON student_patient(Patient_ID);
// CREATE INDEX idx_personnel_patient_id ON personnel_patient(Patient_ID);
// CREATE INDEX idx_patient_category ON patient(Category);
// Optional:
// CREATE INDEX idx_timein_patient ON visit_records(Time_In, Patient_ID);
// ==============================

$days = isset($_GET['days']) ? intval($_GET['days']) : 7;

try {
    $db = new Database();
    $conn = $db->getConnection();

    $stmt = $conn->prepare("
        SELECT 
            vr.Visit_ID AS id,
            DATE(vr.Time_In) AS date,
            TIME_FORMAT(vr.Time_In, '%h:%i %p') AS time_in,
            TIME_FORMAT(vr.Time_Out, '%h:%i %p') AS time_out,
            COALESCE(CONCAT(p.Last_Name, ', ', p.First_Name), 'Unknown') AS full_name,
            p.Category AS category,
            COALESCE(sp.Department, pp.Department, 'N/A') AS department,
            vr.Reason AS reason,
            vr.Medicine AS medication,
            vr.Quantity AS quantity,
            vr.Remarks AS remarks
        FROM visit_records vr
        LEFT JOIN patient p ON vr.Patient_ID = p.Patient_ID
        LEFT JOIN student_patient sp ON p.Patient_ID = sp.Patient_ID AND p.Category = 'Student'
        LEFT JOIN personnel_patient pp ON p.Patient_ID = pp.Patient_ID AND p.Category = 'Personnel'
        WHERE vr.Time_In >= DATE_SUB(NOW(), INTERVAL ? DAY)
        ORDER BY vr.Time_In DESC
    ");

    $stmt->bind_param("i", $days);
    $stmt->execute();
    $result = $stmt->get_result();

    $visits = [];
    while ($row = $result->fetch_assoc()) {
        $visits[] = [
            'id' => $row['id'],
            'date' => $row['date'],
            'time_in' => $row['time_in'],
            'time_out' => $row['time_out'] ?? '',
            'full_name' => $row['full_name'] ?? '',
            'category' => $row['category'] ?? '',
            'department' => $row['department'] ?? '',
            'reason' => $row['reason'] ?? '',
            'medication' => $row['medication'] ?? '',
            'quantity' => $row['quantity'] ?? 0,
            'remarks' => $row['remarks'] ?? ''
        ];
    }

    echo json_encode([
        'status' => 'success',
        'data' => [
            'details' => $visits
        ]
    ]);

    $stmt->close();
    $db->close();

} catch (Exception $e) {
    error_log("Error in fetch_visits.php: " . $e->getMessage());
    echo json_encode([
        'status' => 'error',
        'message' => 'Failed to fetch visits: ' . $e->getMessage()
    ]);
}
?>
