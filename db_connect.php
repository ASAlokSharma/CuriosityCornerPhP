<?php
// ============================================================
//  db_connect.php — CuriosityCorner Database Configuration
//  Fill in your InfinityFree MySQL credentials here.
//  Get these from: InfinityFree Panel → MySQL Databases
// ============================================================

define('DB_HOST', 'sql307.infinityfree.com');   // Always this for InfinityFree
define('DB_USER', 'if0_41342055');        // e.g. if123456_curiosity
define('DB_PASS', 'Prince0998');        // Password you set in panel
define('DB_NAME', 'if0_41342055_form');            // e.g. if123456_corner

// Create connection
$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

// Check connection
if ($conn->connect_error) {
    // Don't expose DB errors to the user — log silently
    error_log("DB Connection failed: " . $conn->connect_error);
    die("Something went wrong. Please try again later.");
}

// Set charset to UTF-8 for safety
$conn->set_charset("utf8mb4");
?>
