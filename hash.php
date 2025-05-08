<?php
// Run this manually (e.g., hashgen.php) ONCE to generate hashes

$adminPass = password_hash("clinicadmin123", PASSWORD_DEFAULT);
$staffPass = password_hash("clinicstaff123", PASSWORD_DEFAULT);

echo "Admin hash: " . $adminPass . "<br>";
echo "Staff hash: " . $staffPass . "<br>";
?>