<?php

class PatientDataHandler {
    private $db;
    private $conn;
    private $patientID;

    public function __construct($dbConnection) {
        $this->conn = $dbConnection;
    }


    public function saveStudentOrPersonnel($data, $usercategory) {
        try {
            if ($usercategory === 'student') {
                $stmt = $this->conn->prepare("SELECT Student_ID FROM student_patient WHERE Student_ID = ?");
                $stmt->bind_param("s", $data['identification']);
                $stmt->execute();
                $stmt->store_result();
    
                if ($stmt->num_rows > 0) {
                    $stmt->close();
                    return ['status' => 'error', 'message' => 'duplicate_student_id'];
                }
                $stmt->close();
    
                $stmt = $this->conn->prepare("
                    INSERT INTO student_patient (Student_ID, Patient_ID, Department, Program, Batch)
                    VALUES (?, ?, ?, ?, ?)
                ");
                $stmt->bind_param(
                    "sisss",
                    $data['identification'], $this->patientID,
                    $data['collegeDepartment'], $data['collegeProgram'], $data['batch']
                );
            } else {
                $stmt = $this->conn->prepare("SELECT Personnel_ID FROM personnel_patient WHERE Personnel_ID = ?");
                $stmt->bind_param("s", $data['identification']);
                $stmt->execute();
                $stmt->store_result();
    
                if ($stmt->num_rows > 0) {
                    $stmt->close();
                    return ['status' => 'error', 'message' => 'duplicate_personnel_id'];
                }
                $stmt->close();
    
                $type = isset($data['teaching']) ? 'teaching' :
                        (isset($data['nonTeaching']) ? 'non-teaching' : 'unspecified');
    
                $dept = $data['departmentPersonnel'] ?? '';
    
                $stmt = $this->conn->prepare("
                    INSERT INTO personnel_patient (Personnel_ID, Patient_ID, Department)
                    VALUES (?, ?, ?)
                ");
                $stmt->bind_param("sis", $data['identification'], $this->patientID, $dept);
            }
    
            if (!$stmt->execute()) {
                throw new Exception("Failed to insert student/personnel info: " . $stmt->error);
            }
    
            $stmt->close();
            return ['status' => 'success'];
        } catch (Exception $e) {
            return ['status' => 'error', 'message' => $e->getMessage()];
        }
    }
    
    // Insert patient general data
    public function savePatient($data) {
        $stmt = $this->conn->prepare("
            INSERT INTO patient (Category, First_Name, Middle_Name, Last_Name, Sex, Age, Birthdate,
                                Civil_Status, Religion, Nationality, Contact_Number, Address, City, Province, Zip_Code)
                                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ");
        $stmt->bind_param(
            "sssssisssssssss", $data['category'],
            $data['firstname'], $data['middlename'], $data['lastname'], $data['gender'], $data['age'],
            $data['birthdate'], $data['civilstatus'], $data['religion'], $data['nationality'],
            $data['contact'], $data['address'], $data['city'], $data['province'], $data['zipcode']
        );
        $stmt->execute();
        if ($stmt->error) {
            throw new Exception("Failed to insert patient: " . $stmt->error);
        }
        $this->patientID = $this->conn->insert_id;
        $stmt->close();
    }


    public function saveUserAccount(array $data): void {
        $patientID = $this->patientID;
    
        if (empty($data['email']) || empty($data['identification'])) {
            throw new Exception("Email and Identification number are required.");
        }
    
        $email = trim($data['email']);
        $role = 'user';
        $rawPassword = trim($data['identification']); 
        $password = password_hash($rawPassword, PASSWORD_BCRYPT);
    
        // Insert user record
        $stmt = $this->conn->prepare("INSERT INTO users (Patient_ID, Role, Email, Password) VALUES (?, ?, ?, ?)");

        $stmt->bind_param("isss", $patientID, $role, $email, $password);
    
        if (!$stmt->execute()) {
            throw new Exception("Failed to insert into user table: " . $stmt->error);
        }
    
        $stmt->close();
    }


    // Insert emergency contact
    public function saveEmergencyContact($data) {
        $stmt = $this->conn->prepare("
            INSERT INTO emergency_contact (Patient_ID, Last_Name, First_Name, Middle_Name, Relationship,
                                           Contact_Number, Address, City, Province, Zip_Code)
                                           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ");
        $stmt->bind_param(
            "isssssssss",
            $this->patientID,
            $data['emergencyLastname'], $data['emergencyFirstname'], $data['emergencymiddlename'],
            $data['relationship'], $data['emergencycontact'], $data['emergencyaddress'],
            $data['emergencycity'], $data['emergencyprovince'], $data['emergencyzipcode']
        );
        $stmt->execute();
        $stmt->close();
    }
    
    
    
 
    // Insert personal medical history
    public function savePersonalHistory($conditions, $maintenance) {
        $maintenanceStr = isset($maintenance) ? (string) $maintenance : '';
    
        foreach ($conditions as $conditionJson) {
            $condition = json_decode($conditionJson, true);
            if (!isset($condition['name'])) continue;
    
            $name = $condition['name'];
            $details = $condition['details'] ?? '';
    
            $stmt = $this->conn->prepare("
                INSERT INTO patient_condition (Patient_ID, Medical_Condition, Details, Med_Maintenance)
                VALUES (?, ?, ?, ?)
            ");
    
            $stmt->bind_param("isss", $this->patientID, $name, $details, $maintenanceStr);
            $stmt->execute();
            $stmt->close();
        }
    }
    
     // Insert maternal history
    public function saveMaternalHistory($data) {
        if (
            isset($data['numberOfPreg']) ||
            isset($data['numberOfMiscarriage']) ||
            isset($data['numberOfTermdeliveries']) ||
            isset($data['numberOfPrematureDeliveries']) ||
            isset($data['totalnumberofChildren'])
        ) {
            $stmt = $this->conn->prepare("
                INSERT INTO maternal (
                    Patient_ID, No_ofPregnancy, No_ofMiscarriage, 
                    No_TermsofDelevery, No_ofPrematureDelivery, TotalofChildren
                ) VALUES (?, ?, ?, ?, ?, ?)
            ");
    
            $pregnancies = $this->nullOrInt($data['numberOfPreg'] ?? null);
            $miscarriages = $this->nullOrInt($data['numberOfMiscarriage'] ?? null);
            $termDeliveries = $this->nullOrInt($data['numberOfTermdeliveries'] ?? null);
            $prematureDeliveries = $this->nullOrInt($data['numberOfPrematureDeliveries'] ?? null);
            $totalChildren = $this->nullOrInt($data['totalnumberofChildren'] ?? null);
    
            $stmt->bind_param(
                "iiiiii",
                $this->patientID,$pregnancies,$miscarriages,$termDeliveries,
                $prematureDeliveries,$totalChildren
            );
    
            if (!$stmt->execute()) {
                throw new Exception("Failed to insert maternal history: " . $stmt->error);
            }
    
            $stmt->close();
        }
    }

     // Insert Alcohol history
    public function saveAlcoholHistory($data) {
        $frequencyParts = [];
    
        if (!empty($data['oncePerWeekalcohol'])) {
            $frequencyParts[] = 'Once per week';
        }
    
        if (!empty($data['moreThanonceperweekalcohol'])) {
            $frequencyParts[] = 'More than once per week';
        }
    
        $frequency = implode(', ', $frequencyParts);
        $estPerConsumption = isset($data['totalperconsupAlchoText']) && $data['totalperconsupAlchoText'] !== ''
            ? trim($data['totalperconsupAlchoText'])
            : null;
    
        if (!empty($frequency) || !empty($estPerConsumption)) {
            $stmt = $this->conn->prepare("
                INSERT INTO alcohol_history (Patient_ID, ESTperConsumption, Frequency)
                VALUES (?, ?, ?)
            ");
    
            if (!$stmt) {
                throw new Exception("Prepare failed in saveAlcoholHistory: " . $this->conn->error);
            }
    
            $stmt->bind_param("iss", $this->patientID, $estPerConsumption, $frequency);
    
            if (!$stmt->execute()) {
                throw new Exception("Execute failed in saveAlcoholHistory: " . $stmt->error);
            }
    
            $stmt->close();
        }
    }

    // Insert Surgical history
    public function saveSurgicalHistory($data) {
        $surgicalStatus = $data['surgical'] ?? 'no';
        $surgicalSpecify = ($surgicalStatus === 'yes' && !empty($data['surgicalText']))
            ? trim($data['surgicalText'])
            : null;
    
        $stmt = $this->conn->prepare("
            INSERT INTO surgical_history (Patient_ID, HasSurgicalHistory, Specify)
            VALUES (?, ?, ?)
        ");
    
        if (!$stmt) {
            throw new Exception("Prepare failed in saveSurgicalHistory: " . $this->conn->error);
        }
    
        $stmt->bind_param("iss", $this->patientID, $surgicalStatus, $surgicalSpecify);
    
        if (!$stmt->execute()) {
            throw new Exception("Execute failed in saveSurgicalHistory: " . $stmt->error);
        }
    
        $stmt->close();
    }

    // Insert into smoking_history
    public function saveSmokingHistory($data) {
        $usageStatus = $data['usageStatus'] ?? 'none';
        $stoppedDate = ($usageStatus === 'stopped') ? ($data['stoppedDate'] ?? null) : null;
        $startedSince = ($usageStatus === 'Yes') ? ($data['cigaretteStartedDate'] ?? null) : null;
    
        if ($usageStatus === 'Yes') {
            $smokingTypes = $data['smokingTypes'] ?? [];
    
            if (in_array('Cigarette', $smokingTypes)) {
                if (!$startedSince) {
                    throw new Exception("Start date is required for Cigarette smokers.");
                }
            } else {
                $startedSince = null;
            }
    
            $stoppedDate = null;
        } elseif ($usageStatus === 'stopped') {
            if (!$stoppedDate) {
                throw new Exception("Stop date is required for stopped usage.");
            }
            $startedSince = null;
        } else {
            $startedSince = null;
            $stoppedDate = null;
        }
    
        $stmt = $this->conn->prepare("
            INSERT INTO smoking_history (Patient_ID, Usage_Status, Start_Date, Stop_Date)
            VALUES (?, ?, ?, ?)
        ");
    
        if (!$stmt) {
            throw new Exception("Prepare failed in saveSmokingHistory: " . $this->conn->error);
        }
    
        $stmt->bind_param("isss", $this->patientID, $usageStatus, $startedSince, $stoppedDate);
    
        if (!$stmt->execute()) {
            throw new Exception("Execute failed in saveSmokingHistory: " . $stmt->error);
        }
    
        $smokingHistoryID = $stmt->insert_id;
        $stmt->close();
    
        // If currently smoking, record types
        if ($usageStatus === 'Yes') {
            $smokingTypes = array_unique($data['smokingTypes'] ?? []);
    
            foreach ($smokingTypes as $type) {
                $sticks = ($type === "Cigarette") ? intval($data['sticksperday'] ?? 0) : null;
    
                $stmt = $this->conn->prepare("
                    INSERT INTO smoking_typeused (Smoking_ID, Type, StickperDay)
                    VALUES (?, ?, ?)
                ");
    
                if (!$stmt) {
                    throw new Exception("Prepare failed for smoking_typeused: " . $this->conn->error);
                }
    
                $stmt->bind_param("isi", $smokingHistoryID, $type, $sticks);
    
                if (!$stmt->execute()) {
                    throw new Exception("Execute failed for smoking_typeused: " . $stmt->error);
                }
    
                $stmt->close();
            }
        }
    }

    // Insert into drug_history
    public function saveDrugHistory($data) {
        $usageStatus = $data['drugsStatus'] ?? null;
        $rehabilitation = $data['rehabilitation'] ?? null;
        $substances = isset($data['substances']) && is_array($data['substances']) ? array_unique($data['substances']) : [];
    
        $stmt = $this->conn->prepare("
            INSERT INTO drug_history (Patient_ID, Usage_Status, Rehub_Undergone) 
            VALUES (?, ?, ?)
        ");
    
        if (!$stmt) {
            throw new Exception("Prepare failed for drug_history: " . $this->conn->error);
        }
    
        $stmt->bind_param("iss", $this->patientID, $usageStatus, $rehabilitation);
    
        if (!$stmt->execute()) {
            throw new Exception("Execute failed for drug_history: " . $stmt->error);
        }
    
        $drugID = $stmt->insert_id;
        $stmt->close();
    
        // Insert unique substances into drug_typeused
        if (!empty($substances)) {
            $stmt = $this->conn->prepare("
                INSERT INTO drug_typeused (Drug_ID, Type) 
                VALUES (?, ?)
            ");
    
            if (!$stmt) {
                throw new Exception("Prepare failed for drug_typeused: " . $this->conn->error);
            }
    
            foreach ($substances as $substance) {
                $stmt->bind_param("is", $drugID, $substance);
                if (!$stmt->execute()) {
                    throw new Exception("Execute failed for drug_typeused: " . $stmt->error);
                }
            }
    
            $stmt->close();
        }
    }

    // Insert into Family_history
    public function saveFamilyHistory($data) {
        if (!isset($data['family_history']) || !is_array($data['family_history'])) {
            return;
        }
    
        $familyHistory = array_unique($data['family_history']);
    
        $stmt = $this->conn->prepare("
            INSERT INTO family_history (Patient_ID, Medical_Condition, Details)
            VALUES (?, ?, ?)
        ");
    
        if (!$stmt) {
            throw new Exception("Prepare failed for family_history: " . $this->conn->error);
        }
    
        foreach ($familyHistory as $entry) {
            if (strpos($entry, ':') !== false) {
                list($condition, $details) = explode(':', $entry, 2);
            } else {
                $condition = $entry;
                $details = null;
            }
    
            $stmt->bind_param("iss", $this->patientID, $condition, $details);
            if (!$stmt->execute()) {
                throw new Exception("Execute failed for family_history: " . $stmt->error);
            }
        }
    
        $stmt->close();
    }
    
    
    

    private function nullOrInt($val) {
        if ($val === '' || $val === null) {
            return null;
        }
        return (int)$val;
    }
    
    public function getPatientID() {
        return $this->patientID;
    }
}

?>