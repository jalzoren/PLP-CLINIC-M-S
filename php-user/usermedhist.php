<?php
session_start();
error_reporting(E_ERROR | E_PARSE);
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/php-error.log');

require '../php/database.php';

header('Content-Type: application/json; charset=utf-8');

try {
    $db = new Database();
    $conn = $db->getConnection();
} catch (Exception $e) {
    echo json_encode(["error" => "Database connection failed"]);
    exit;
}

if (!isset($_SESSION['user_id'])) {
    echo json_encode(["error" => "User not logged in"]);
    exit;
}

$user_id = $_SESSION['user_id'];

// Get Patient_ID from users table
$stmt = $conn->prepare("SELECT Patient_ID FROM users WHERE User_ID = ?");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();
$stmt->close();

if (!$user || !$user['Patient_ID']) {
    echo json_encode(["error" => "No associated patient record found"]);
    exit;
}

$patient_id = $user['Patient_ID']; // Now use this for all queries below


// 1. Fetch patient main info (without patient_condition join)
$sqlPatient = "
    SELECT 
        p.*, 
        sp.Student_ID, sp.Department AS student_department, sp.Program, sp.Batch,
        pp.Personnel_ID, pp.Department AS personnel_department,
        e.Last_Name AS eLastName, e.First_Name AS eFirstName, e.Middle_Name AS eMiddleName, 
        e.Relationship, e.Contact_Number AS eContact, e.Address AS eAddress, e.City AS eCity, 
        e.Province AS eProvince, e.Zip_Code AS eZipCode,
        m.No_ofPregnancy, m.No_ofMiscarriage, m.No_TermsofDelevery, 
        m.No_ofPrematureDelivery, m.TotalofChildren,
        ah.ESTperConsumption, ah.Frequency,
        sh.HasSurgicalHistory, sh.Specify,
        u.Email AS user_email

    FROM patient p
    LEFT JOIN student_patient sp ON p.Patient_ID = sp.Patient_ID
    LEFT JOIN personnel_patient pp ON p.Patient_ID = pp.Patient_ID
    LEFT JOIN emergency_contact e ON p.Patient_ID = e.Patient_ID
    LEFT JOIN maternal m ON p.Patient_ID = m.Patient_ID
    LEFT JOIN alcohol_history ah ON p.Patient_ID = ah.Patient_ID
    LEFT JOIN surgical_history sh ON p.Patient_ID = sh.Patient_ID
    LEFT JOIN users u ON p.Patient_ID = u.Patient_ID

    WHERE p.Patient_ID = ?
";

if ($stmt = $conn->prepare($sqlPatient)) {
    $stmt->bind_param("i", $patient_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $patient = $result->fetch_assoc();
    $stmt->close();

    if (!$patient) {
        echo json_encode(null);
        exit;
    }
} else {
    echo json_encode(["error" => "Failed to prepare SQL statement for patient"]);
    exit;
}

// 2. Fetch all medical conditions separately
$sqlConditions = "SELECT Medical_Condition, Details, Med_Maintenance FROM patient_condition WHERE Patient_ID = ?";
$conditions = [];

if ($stmt2 = $conn->prepare($sqlConditions)) {
    $stmt2->bind_param("i", $patient_id);
    $stmt2->execute();
    $result2 = $stmt2->get_result();
    while ($row = $result2->fetch_assoc()) {
        $conditions[] = $row;
    }
    $stmt2->close();
} else {
    echo json_encode(["error" => "Failed to prepare SQL statement for conditions"]);
    exit;
}

// 3. Fetch smoking_history for this patient
$sqlSmokingHistory = "SELECT Smoking_ID, Usage_Status, Start_Date, Stop_Date FROM smoking_history WHERE Patient_ID = ?";
$smokingHistory = null;
$smokingTypes = [];

if ($stmtSmoking = $conn->prepare($sqlSmokingHistory)) {
    $stmtSmoking->bind_param("i", $patient_id);
    $stmtSmoking->execute();
    $resultSmoking = $stmtSmoking->get_result();
    $smokingHistory = $resultSmoking->fetch_assoc();
    $stmtSmoking->close();

    if ($smokingHistory) {
        // Fetch smoking_typeused entries by Smoking_ID
        $sqlSmokingTypes = "SELECT Type, StickperDay FROM smoking_typeused WHERE Smoking_ID = ?";
        if ($stmtTypes = $conn->prepare($sqlSmokingTypes)) {
            $stmtTypes->bind_param("i", $smokingHistory['Smoking_ID']);
            $stmtTypes->execute();
            $resultTypes = $stmtTypes->get_result();
            while ($row = $resultTypes->fetch_assoc()) {
                $smokingTypes[] = [
                    "type" => $row['Type'],
                    "sticks_per_day" => $row['StickperDay']
                ];
            }
            $stmtTypes->close();
        } else {
            echo json_encode(["error" => "Failed to prepare SQL for smoking types"]);
            exit;
        }
    }
} else {
    echo json_encode(["error" => "Failed to prepare SQL for smoking history"]);
    exit;
}


// 5. Fetch drug_history for this patient
$sqlDrugHistory = "SELECT Drug_ID, Usage_Status, Rehub_Undergone FROM drug_history WHERE Patient_ID = ?";
$drugHistory = null;
$drugTypes = [];

if ($stmtDrug = $conn->prepare($sqlDrugHistory)) {
    $stmtDrug->bind_param("i", $patient_id);
    $stmtDrug->execute();
    $resultDrug = $stmtDrug->get_result();
    $drugHistory = $resultDrug->fetch_assoc();
    $stmtDrug->close();

    if ($drugHistory) {
        // Fetch drug_typeused entries by Drug_ID
        $sqlDrugTypes = "SELECT Type FROM drug_typeused WHERE Drug_ID = ?";
        if ($stmtDrugTypes = $conn->prepare($sqlDrugTypes)) {
            $stmtDrugTypes->bind_param( "i", $drugHistory['Drug_ID']);
            $stmtDrugTypes->execute();
            $resultDrugTypes = $stmtDrugTypes->get_result();
            while ($row = $resultDrugTypes->fetch_assoc()) {
                $drugTypes[] = $row['Type'];
            }
            $stmtDrugTypes->close();
        } else {
            echo json_encode(["error" => "Failed to prepare SQL for drug types"]);
            exit;
        }
    }
} else {
    echo json_encode(["error" => "Failed to prepare SQL for drug history"]);
    exit;
}

// 6. Fetch family_history for this patient
$sqlFamilyHistory = "SELECT Medical_Condition, Details FROM family_history WHERE Patient_ID = ?";
$familyHistory = [];

if ($stmtFam = $conn->prepare($sqlFamilyHistory)) {
    $stmtFam->bind_param("i", $patient_id);
    $stmtFam->execute();
    $resultFam = $stmtFam->get_result();
    while ($row = $resultFam->fetch_assoc()) {
        $familyHistory[] = [
            "Medical_Condition" => $row['Medical_Condition'],
            "details" => $row['Details'] ?? ""
        ];
    }
    $stmtFam->close();
} else {
    echo json_encode(["error" => "Failed to prepare SQL for family history"]);
    exit;
}



// 4. Build and output JSON response
$response = [
    "identification"        => !empty($patient['Student_ID']) ? $patient['Student_ID'] : 
                               (!empty($patient['Personnel_ID']) ? $patient['Personnel_ID'] : ""),
    "lastname"              => $patient['Last_Name'],
    "firstname"             => $patient['First_Name'],
    "middlename"            => $patient['Middle_Name'],
    "gender"                => $patient['Sex'],
    "age"                   => $patient['Age'],
    "birthdate"             => $patient['Birthdate'],
    "religion"              => $patient['Religion'],
    "nationality"           => $patient['Nationality'],
    "contact"               => $patient['Contact_Number'],
    "civilstatus"           => $patient['Civil_Status'],
    "address"               => $patient['Address'],
    "city"                  => $patient['City'],
    "province"              => $patient['Province'],
    "zipcode"               => $patient['Zip_Code'],
    "email"                 => $patient['user_email'] ?? "",
    "category"              => $patient['Category'],
    "personnel_type" => in_array($patient['Category'], ['teaching', 'non-teaching']) ? $patient['Category'] : "",


    // Student info
    "student_department"    => $patient['student_department'] ?? "",
    "program"               => $patient['Program'] ?? "",
    "batch"                 => $patient['Batch'] ?? "",

    // Personnel info
    "personnel_department"  => $patient['personnel_department'] ?? "",

    // Emergency contact
    "emergencyLastname"     => $patient['eLastName'] ?? "",
    "emergencyFirstname"    => $patient['eFirstName'] ?? "",
    "emergencymiddlename"   => $patient['eMiddleName'] ?? "",
    "relationship"          => $patient['Relationship'] ?? "",
    "emergencycontact"      => $patient['eContact'] ?? "",
    "emergencyaddress"      => $patient['eAddress'] ?? "",
    "emergencycity"         => $patient['eCity'] ?? "",
    "emergencyprovince"     => $patient['eProvince'] ?? "",
    "emergencyzipcode"      => $patient['eZipCode'] ?? "",

    // Maternal history
    "no_of_pregnancy"           => $patient['No_ofPregnancy'] ?? "",
    "no_of_miscarriage"         => $patient['No_ofMiscarriage'] ?? "",
    "no_terms_of_delivery"      => $patient['No_TermsofDelevery'] ?? "",
    "no_of_premature_delivery"  => $patient['No_ofPrematureDelivery'] ?? "",
    "total_children"            => $patient['TotalofChildren'] ?? "",

    // Alcohol history
    "estimated_per_consumption" => $patient['ESTperConsumption'] ?? "",
    "alcohol_frequency"         => $patient['Frequency'] ?? "",

    // Surgical history
    "has_surgical_history"  => $patient['HasSurgicalHistory'] ?? "",
    "surgical_specify"      => $patient['Specify'] ?? "",

    // Medical conditions array
    "medical_conditions"    => $conditions,

    // Smoking history fields (or empty strings if null)
    "smoking_usage_status"  => $smokingHistory['Usage_Status'] ?? "",
    "smoking_start_date"    => $smokingHistory['Start_Date'] ?? "",
    "smoking_stop_date"     => $smokingHistory['Stop_Date'] ?? "",

    // Smoking types array (each has type and sticks_per_day)
    "smoking_types_used"    => $smokingTypes,

      // Drug history fields (or empty strings if null)
    "drugs_usage_status"     => $drugHistory['Usage_Status'] ?? "",
    "drugs_start_date"       => $drugHistory['Start_Date'] ?? "",
    "drugs_stop_date"        => $drugHistory['Stop_Date'] ?? "",
    "rehabilitation_status"  => $drugHistory['Rehub_Undergone'] ?? "",

    // Drug types used array (each element is a drug type string)
    "drugs_substances_used"  => $drugTypes,
    "family_history" => $familyHistory

];

echo json_encode($response);

$conn->close();
exit;
?>
