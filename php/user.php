<?php
require_once 'database.php';

function authenticateUser($email, $password) {
    try {
        $db = new Database();
        $conn = $db->getConnection();

        $stmt = $conn->prepare("SELECT User_ID, Role, Password, Patient_ID FROM users WHERE Email = ? LIMIT 1");
        if (!$stmt) {
            error_log("Prepare failed: " . $conn->error);
            return false;
        }

        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();
        $user = $result->fetch_assoc();
        $stmt->close();
        $db->close();

        if ($user && password_verify($password, $user['Password'])) {
            return [
                'user_id' => $user['User_ID'],
                'role' => $user['Role'],
                'patient_id' => $user['Patient_ID']
            ];
        }
        return false;
    } catch (Exception $e) {
        error_log("Authentication error: " . $e->getMessage());
        return false;
    }
}
?>