<?php
include('../php/database.php');

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
    die("Error with the SQL query: " . $conn->error);
}

$i = 1;
$output = "";

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $output .= "<tr>
            <td>{$i}</td>
            <td>";

        if ($row['Student_ID']) {
            $output .= "{$row['Student_ID']} (Student)";
        } elseif ($row['Personnel_ID']) {
            $output .= "{$row['Personnel_ID']} (Personnel)";
        } else {
            $output .= "N/A"; 
        }

        $output .= "</td>
            <td>{$row['First_Name']} {$row['Middle_Name']} {$row['Last_Name']}</td>
            <td>{$row['Category']}</td>
            <td>{$row['Sex']}</td>
            <td>";

        if ($row['student_department']) {
            $output .= "Student Department: {$row['student_department']}";
        }
        if ($row['personnel_department']) {
            if ($row['student_department']) {
                $output .= "<br>";
            }
            $output .= "Personnel Department: {$row['personnel_department']}";
        }

        $output .= "</td>
            <td class='action-cell'>
              <a href='../forms/patientrec.html?patient_id={$row['Patient_ID']}'>
                <button type='button'>View</button>
              </a>
            </td>
        </tr>";
        $i++;
    }
} else {
    $output = "<tr><td colspan='7'>No records found.</td></tr>";
}

echo $output;

$database->close();
?>
