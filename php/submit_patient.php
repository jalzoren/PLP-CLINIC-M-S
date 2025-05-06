<?php
ob_start();
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
header('Content-Type: application/json');

require_once 'database.php';
require_once 'popup-medicalrec.php';


try {
    $category = isset($_POST['user']) ? $_POST['user'] : '';
    if (!in_array($category, ['student', 'personnel'])) {
        throw new Exception("Invalid category.");
    }

    $db = new Database();
    $conn = $db->getConnection();
    $handler = new PatientDataHandler($conn);

    if (empty($_POST['firstname']) || empty($_POST['lastname'])) {
        throw new Exception("First Name and Last Name are required.");
    }

    $handler->savePatient($_POST);
    
    if (isset($_POST['emergencyLastname'], $_POST['emergencyFirstname'])) {
        $handler->saveEmergencyContact($_POST);
    } else {
        throw new Exception("Emergency contact information is incomplete.");
    }

    $handler->saveStudentOrPersonnel($_POST, $category);

    $conditions = [];
    if (isset($_POST['conditions'])) {
        $conditions = $_POST['conditions'];
    } elseif (!empty($_FILES) || strpos($_SERVER['CONTENT_TYPE'], 'multipart/form-data') !== false) {
        foreach ($_POST as $key => $value) {
            if (str_starts_with($key, 'conditions')) {
                $conditions[] = $value;
            }
        }
    }

    $maintenance = $_POST['maintenanceMedications'] ?? '';
    $handler->savePersonalHistory($conditions, $maintenance);


    if (isset($_POST['numberOfPreg'])) {
        $handler->saveMaternalHistory($_POST);
    }

    $handler->saveAlcoholHistory($_POST);
    $handler->saveSurgicalHistory($_POST);
    $handler->saveSmokingHistory($_POST);
    $handler->saveDrugHistory($_POST);
    $handler->saveFamilyHistory($_POST);




    $db->close();
    ob_clean();
    echo json_encode([
        "status" => "success",
        "message" => "Data successfully saved",
        "patientID" => $handler->getPatientID()
    ]);
} catch (Exception $e) {
    ob_clean();
    error_log("Exception: " . $e->getMessage());
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}
?>
