<?php
require_once '../php/database.php';

try {
    $database = new Database();
    $conn = $database->getConnection();
} catch (Exception $e) {
    die("Error: " . $e->getMessage());
}

$sql = "
    SELECT p.Patient_ID, p.First_Name, p.Middle_Name, p.Last_Name, p.Category, p.Sex, 
           sp.Student_ID, pp.Personnel_ID, sp.Department AS student_department, pp.Department AS personnel_department
    FROM patient p
    LEFT JOIN student_patient sp ON p.Patient_ID = sp.Patient_ID
    LEFT JOIN personnel_patient pp ON p.Patient_ID = pp.Patient_ID
    ORDER BY p.Patient_ID DESC
";

$result = $conn->query($sql);

if (!$result) {
    die("Query error: " . $conn->error);
}
