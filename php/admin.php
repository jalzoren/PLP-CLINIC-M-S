<?php
session_start();
header('Content-Type: application/json');

try {
    if (isset($_SESSION['admin_email']) && !empty($_SESSION['admin_email'])) {
        echo json_encode([
            'status' => 'success',
            'email' => $_SESSION['admin_email']
        ]);
    } else {
        throw new Exception('Admin email not found in session.');
    }
} catch (Exception $e) {
    error_log("Error fetching admin email: " . $e->getMessage());
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}
?>