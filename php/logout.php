<?php
session_start();
session_unset(); // clear all session variables
session_destroy(); // destroy the session

// Redirect to login page
header("Location: ../login.html");
exit;
?>