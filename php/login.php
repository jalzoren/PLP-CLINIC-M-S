<?php
session_start();
require_once '../php/database.php';

// Only run if form is submitted via POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Sanitize input
    $email = filter_var(trim($_POST['email'] ?? ''), FILTER_SANITIZE_EMAIL);
    $password = trim($_POST['password'] ?? '');

    // Validate input
    if (empty($email) || empty($password)) {
        die("Email and password are required.");
    }

    // Connect to database
    $db = new Database();
    $conn = $db->getConnection();

    // Prepare SQL query to get user info including Patient_ID
    $stmt = $conn->prepare("SELECT u.User_ID, u.Role, u.Password, u.Patient_ID FROM users u WHERE u.Email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows === 1) {
        $stmt->bind_result($user_id, $role, $hashed_password, $patient_id);
        $stmt->fetch();

        if (password_verify($password, $hashed_password)) {
            session_regenerate_id(true);
            $_SESSION['user_id'] = $user_id;
            $_SESSION['role'] = $role;
            $_SESSION['Patient_ID'] = $patient_id; // Store Patient_ID in session

            // Redirect based on role
            switch (strtolower($role)) {
                case 'user':
                    header("Location: ../forms-user/userdashboard.html");
                    break;
                case 'staff':
                    header("Location: ../forms/staffdashboard.html");
                    break;
                case 'admin':
                    header("Location: ../forms-admin/admindashboard.html");
                    break;
                default:
                    echo "Unknown role: " . htmlspecialchars($role);
            }

            exit;
        } else {
            echo "Invalid password.";
        }
    } else {
        echo "Account not found.";
    }

    $stmt->close();
    $db->close();

} else {
    // Redirect if not a POST request
    header("Location: login.html");
    exit;
}
