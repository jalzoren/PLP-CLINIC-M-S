<?php
// Run this manually (e.g., hashgen.php) ONCE to generate hashes

$adminPass = password_hash("clinicadmin123", PASSWORD_DEFAULT);
$staffPass = password_hash("clinicstaff123", PASSWORD_DEFAULT);

echo "Admin hash: " . $adminPass . "<br>";
echo "Staff hash: " . $staffPass . "<br>";

//$plain_password = "clinicstaff123";
//$stored_hash = '$2y$10$Vf7AcrHOEEcXyJQTu9Zd4uFjm0brazUu1rZnoGNU0XW...'; // Your hash from the DB
//
//if (password_verify($plain_password, $stored_hash)) {
//    echo "Password is correct!";
//} else {
//    echo "Password is wrong.";
//}
?>