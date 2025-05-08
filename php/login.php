<?php
session_start();
require_once '/php/database.php';

// Check if the form was submitted
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Sanitize and validate input data to avoid XSS attacks
    $email = filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL);
    $password = trim($_POST['password']);
    
    // Basic validation for required fields
    if (empty($email) || empty($password)) {
        die("Email and password are required.");
    }

    // Initialize the database connection
    $db = new Database();
    $conn = $db->getConnection();

    // Prepare SQL query to prevent SQL injection
    $stmt = $conn->prepare("SELECT User_ID, Role, Password FROM users WHERE Email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $stmt->store_result();

    // Check if the user exists in the database
    if ($stmt->num_rows === 1) {
        // Bind result to variables
        $stmt->bind_result($user_id, $role, $hashed_password);
        $stmt->fetch();

        // Verify the hashed password
        if (password_verify($password, $hashed_password)) {
            // Start session and store user role
            $_SESSION['user_id'] = $user_id;
            $_SESSION['role'] = $role;

            // Redirect to the appropriate dashboard based on the user role
            switch (strtolower($role)) {
                case 'user':
                    header("Location: /forms-user/userdashboard.html");
                    break;
                case 'clinic staff':
                    header("Location: /forms/staffdashboard.html");
                    break;
                case 'admin':
                    header("Location: /forms-admin/admindashboard.html");
                    break;
                default:
                    echo "Unknown role.";
            }
            exit;  // Ensure no further code is executed after redirect
        } else {
            echo "Invalid password.";
        }
    } else {
        echo "Account not found.";
    }

    // Close the statement and database connection
    $stmt->close();
    $db->close();
} else {
    // Redirect to the login page if the form is not submitted via POST
    header("Location: login.html");
    exit;
}
?>
