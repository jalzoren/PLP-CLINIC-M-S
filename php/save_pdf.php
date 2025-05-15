<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
header('Content-Type: application/json');

require_once 'database.php';

try {
    $data = json_decode(file_get_contents("php://input"), true);

    if (!isset($data['pdfData']) || !isset($data['patientID'])) {
        throw new Exception("Invalid PDF data or missing patient ID.");
    }

    $patientId = intval($data['patientID']);
    if ($patientId <= 0) {
        throw new Exception("Invalid patient ID.");
    }

    $pdfData = $data['pdfData'];

    // Remove base64 prefix if present
    if (strpos($pdfData, 'data:application/pdf;base64,') === 0) {
        $pdfData = substr($pdfData, strlen('data:application/pdf;base64,'));
    }

    $pdfData = base64_decode($pdfData);
    if ($pdfData === false) {
        throw new Exception("Failed to decode PDF data.");
    }

    $db = new Database();
    $conn = $db->getConnection();

    $fileName = "medical_record_" . time() . ".pdf";

    $stmt = $conn->prepare("INSERT INTO patient_pdfs (Patient_ID, pdf_data, pdf_name) VALUES (?, ?, ?)");
    if (!$stmt) {
        throw new Exception("Prepare failed: " . $conn->error);
    }

    // 'b' is used for blobs, but MySQLi requires send_long_data for blobs > 65k.
    // We'll bind a NULL first, then send the blob.
    $null = NULL;
    $stmt->bind_param("ibs", $patientId, $null, $fileName);

    $stmt->send_long_data(1, $pdfData);

    if (!$stmt->execute()) {
        throw new Exception("Execute failed: " . $stmt->error);
    }

    if ($stmt->affected_rows > 0) {
        echo json_encode(["status" => "success", "message" => "PDF saved to database successfully."]);
    } else {
        throw new Exception("Failed to save PDF.");
    }

    $stmt->close();
    $conn->close();

} catch (Exception $e) {
    error_log("PDF save error: " . $e->getMessage());
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
