<?php
    ini_set('display_errors', 1);
error_reporting(E_ALL);
// ============================================================
//  submit.php — CuriosityCorner Form Handler
//  Flow: Validate → Save to MySQL → Forward to Formspree → Redirect
// ============================================================

require_once 'db_connect.php';

// ── Only accept POST requests ────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: contact.html');
    exit;
}

// ── 1. Sanitize & Validate Inputs ───────────────────────────
$name     = trim($_POST['name']     ?? '');
$email    = trim($_POST['email']    ?? '');
$topic    = trim($_POST['topic']    ?? '');
$category = trim($_POST['category'] ?? '');
$message  = trim($_POST['message']  ?? '');

$errors = [];

if (empty($name) || !preg_match('/^[A-Za-z\s]+$/', $name)) {
    $errors[] = "Invalid name.";
}

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = "Invalid email address.";
}

if (strlen($topic) < 3) {
    $errors[] = "Topic must be at least 3 characters.";
}

$allowed_categories = ['science', 'technology', 'nature', 'space', 'other'];
if (!in_array($category, $allowed_categories)) {
    $errors[] = "Invalid category selected.";
}

// If validation fails, go back with an error message
if (!empty($errors)) {
    $error_msg = urlencode(implode(' ', $errors));
    header("Location: contact.html?status=error&msg=$error_msg");
    exit;
}

// ── 2. Save to MySQL Database ────────────────────────────────
$stmt = $conn->prepare(
    "INSERT INTO submissions (name, email, topic, category, message)
     VALUES (?, ?, ?, ?, ?)"
);

$stmt->bind_param("sssss", $name, $email, $topic, $category, $message);

$db_saved = $stmt->execute(); // true = success, false = failed

$stmt->close();
$conn->close();

// ── 3. Forward to Formspree via cURL (keeps your email working) ──
//  Replace the URL below with YOUR Formspree endpoint
$formspree_url = 'https://formspree.io/f/mlgnrylp';

$post_data = http_build_query([
    'name'     => $name,
    'email'    => $email,
    'topic'    => $topic,
    'category' => $category,
    'message'  => $message,
]);

$ch = curl_init($formspree_url);
curl_setopt_array($ch, [
    CURLOPT_POST           => true,
    CURLOPT_POSTFIELDS     => $post_data,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER     => [
        'Accept: application/json',
        'Content-Type: application/x-www-form-urlencoded',
    ],
    CURLOPT_TIMEOUT        => 10,
]);

$response    = curl_exec($ch);
$http_status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

$email_sent = ($http_status === 200);

// ── 4. Redirect back with status ────────────────────────────
if ($db_saved || $email_sent) {
    // At least one succeeded — treat as success
    header('Location: contact.html?status=success');
} else {
    header('Location: contact.html?status=error&msg=Submission+failed.+Please+try+again.');
}
exit;
?>
