<?php
session_start();
require_once 'user.php';

header('Content-Type: application/json');

function handleLogin() {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        echo json_encode(['status' => 'error', 'message' => 'Invalid request method.']);
        exit;
    }

    // Sanitize and validate input
    $email = filter_var(trim($_POST['email'] ?? ''), FILTER_SANITIZE_EMAIL);
    $password = trim($_POST['password'] ?? '');

    if (empty($email) || empty($password)) {
        echo json_encode(['status' => 'error', 'message' => 'Email and password are required.']);
        exit;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['status' => 'error', 'message' => 'Invalid email format.']);
        exit;
    }

    if (strlen($password) < 7) {
        echo json_encode(['status' => 'error', 'message' => 'Password must be at least 7 characters long.']);
        exit;
    }

    $user = authenticateUser($email, $password);
    if ($user) {
        session_regenerate_id(true);
        $_SESSION['user_id'] = $user['user_id'];
        $_SESSION['role'] = $user['role'];
        $_SESSION['patient_id'] = $user['patient_id'];

        $redirect = match (strtolower($user['role'])) {
            'user' => '../PLP-CLINIC-M-S/forms-user/usernewdashb.html',
            'admin' => '../PLP-CLINIC-M-S/forms-admin/admindashboard.html',
            default => ''
        };

        if ($redirect) {
            echo json_encode(['status' => 'success', 'redirect' => $redirect]);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Unknown role: ' . htmlspecialchars($user['role'])]);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Invalid email or password.']);
    }
    exit;
}

try {
    handleLogin();
} catch (Exception $e) {
    error_log("Error: " . $e->getMessage());
    echo json_encode(['status' => 'error', 'message' => 'Internal server error.']);
    exit;
}
?>