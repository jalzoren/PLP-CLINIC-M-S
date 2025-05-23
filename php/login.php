<?php
ini_set('session.cookie_httponly', 1); // Prevent JavaScript access to session cookies
ini_set('session.cookie_secure', 1); // HTTPS-only cookies (if using HTTPS)
session_start();
require_once 'database.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method.']);
    exit;
}

// Validate CSRF token
$csrf_token = $_POST['csrf_token'] ?? '';
if (!isset($_SESSION['csrf_token']) || $csrf_token !== $_SESSION['csrf_token']) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid CSRF token.']);
    exit;
}

// Sanitize and validate input
$email = filter_var(trim($_POST['email'] ?? ''), FILTER_SANITIZE_EMAIL);
$password = trim($_POST['password'] ?? '');

if (empty($email) || empty($password)) {
    echo json_encode(['status' => 'error', 'message' => 'Email and password are required.']);
    exit;
}

// Additional email format validation
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid email format.']);
    exit;
}

// Password length validation
if (strlen($password) < 7) {
    echo json_encode(['status' => 'error', 'message' => 'Password must be at least 7 characters long.']);
    exit;
}

// Connect to database
try {
    $db = new Database();
    $conn = $db->getConnection();
} catch (Exception $e) {
    error_log("Database connection failed: " . $e->getMessage());
    echo json_encode(['status' => 'error', 'message' => 'Database connection failed.']);
    exit;
}

// Prepare SQL query
$stmt = $conn->prepare("SELECT u.User_ID, u.Role, u.Password, u.Patient_ID FROM users u WHERE u.Email = ?");
if (!$stmt) {
    error_log("Prepare failed: " . $conn->error);
    echo json_encode(['status' => 'error', 'message' => 'Database query preparation failed.']);
    exit;
}

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
        $_SESSION['Patient_ID'] = $patient_id;
        $_SESSION['admin_email'] = $email;

        $redirect = match (strtolower($role)) {
            'user' => 'forms-user/usernewdashb.html',
            'admin' => 'forms-admin/admindashboard.html',
            default => ''
        };

        if ($redirect) {
            echo json_encode(['status' => 'success', 'redirect' => $redirect]);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Unknown role: ' . htmlspecialchars($role)]);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Incorrect password.']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Account not found.']);
}

$stmt->close();
$db->close();
exit;