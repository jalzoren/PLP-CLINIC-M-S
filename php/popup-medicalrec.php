<?php
header('Content-Type: application/json');
include 'database.php';

try {
    // Validate category
    $userCategory = $_POST['user'] ?? '';
    if (!in_array($userCategory, ['student', 'personnel'])) {
        throw new Exception("Invalid user category.");
    }

    // Insert patient general data
    $stmt = $mysqli->prepare("
        INSERT INTO patient (
            First_Name, Middle_Name, Last_Name, Sex, Age, Birthdate,
            Civil_Status, Religion, Nationality, Contact_Number, Address, City, Province, Zip_Code
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");

    $stmt->bind_param(
        "ssssssssssssss",
        $_POST['firstname'],
        $_POST['middlename'],
        $_POST['lastname'],
        $_POST['gender'],
        $_POST['age'],
        $_POST['birthdate'],
        $_POST['civilstatus'],
        $_POST['religion'],
        $_POST['nationality'],
        $_POST['contact'],
        $_POST['address'],
        $_POST['city'],
        $_POST['province'],
        $_POST['zipcode']
    );

    if (!$stmt->execute()) {
        throw new Exception("Failed to insert patient: " . $stmt->error);
    }

    $patientID = $stmt->insert_id;
    $stmt->close();

    // Insert emergency contact
    $stmt = $mysqli->prepare("
    INSERT INTO emergency_contact (
        Patient_ID, Last_Name, First_Name, Middle_Name,
        Relationship, Contact_Number, Address, City, Province, Zip_Code
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");
    $stmt->bind_param(
    "isssssssss",
    $patientID,
    $_POST['emergencyLastname'],
    $_POST['emergencyFirstname'],
    $_POST['emergencymiddlename'],
    $_POST['relationship'],
    $_POST['emergencycontact'],
    $_POST['emergencyaddress'],
    $_POST['emergencycity'],
    $_POST['emergencyprovince'],
    $_POST['emergencyzipcode']
    );

    if (!$stmt->execute()) {
    throw new Exception("Failed to insert emergency contact: " . $stmt->error);
    }
    $stmt->close();

    // Insert student or personnel specific data
    $identification = $_POST['identification'];

    if ($userCategory === 'student') {
        $stmt = $mysqli->prepare("
            INSERT INTO student_patient (Student_ID, Patient_ID, Department, Program, Batch)
            VALUES (?, ?, ?, ?, ?)
        ");
        $stmt->bind_param(
            "sisss",
            $identification,
            $patientID,
            $_POST['collegeDepartment'],
            $_POST['collegeProgram'],
            $_POST['batch']
        );
    } else {
        $isTeaching = isset($_POST['teaching']);
        $isNonTeaching = isset($_POST['nonTeaching']);

        $category = ($isTeaching && $isNonTeaching) ? "both" :
                    ($isTeaching ? "teaching" :
                    ($isNonTeaching ? "non-teaching" : "unspecified"));

        $stmt = $mysqli->prepare("
            INSERT INTO personnel_patient (Personnel_ID, Patient_ID, category, department, DeptSection)
            VALUES (?, ?, ?, ?, ?)
        ");
        $stmt->bind_param(
            "sisss",
            $identification,
            $patientID,
            $category,
            $_POST['departmentPersonnel'],
            $_POST['departmentSection']
        );
    }

    if (!$stmt->execute()) {
        throw new Exception("Failed to insert category-specific data: " . $stmt->error);
    }

    $stmt->close();

    // Insert personal medical history
    if (!empty($_POST['conditions'])) {
        $conditions = $_POST['conditions']; 
    
        $stmt = $mysqli->prepare("
            INSERT INTO patient_condition (Patient_ID, Medical_Condition, Details, Med_Maintenance)
            VALUES (?, ?, ?, ?)
        ");
    
        foreach ($conditions as $conditionJson) {
            $condition = json_decode($conditionJson, true);
            $condName = $condition['name'];
            $condDetails = $condition['details'] ?? '';
            $stmt->bind_param("isss", $patientID, $condName, $condDetails, $_POST['maintenanceMedications']);
            $stmt->execute();
        }
    
        $stmt->close();
    }
    
    $mysqli->close();

    echo json_encode([
        "status" => "success",
        "message" => "Data successfully saved",
        "patientID" => $patientID
    ]);
} catch (Exception $e) {
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
    

}
?>
