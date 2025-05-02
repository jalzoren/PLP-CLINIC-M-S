<?php
include 'database.php';

// Check if request is a JSON POST (fetch)
$contentType = $_SERVER["CONTENT_TYPE"] ?? '';
$isJsonRequest = stripos($contentType, 'application/json') !== false;

if ($_SERVER["REQUEST_METHOD"] === "POST" && $isJsonRequest) {
    $input = json_decode(file_get_contents("php://input"), true);

    $id_number = $input['id_number'] ?? '';
    $category = $input['category'] ?? '';
    $department = $input['department'] ?? '';
    $reason = $input['reason'] ?? '';

    if (empty($id_number) || empty($category) || empty($department) || empty($reason)) {
        echo "❌ All fields are required.";
        exit;
    }

    // Check if student exists
    $stmt = $mysqli->prepare("SELECT Patient_ID FROM student_patient WHERE Student_ID = ?");
    $stmt->bind_param("s", $id_number);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        echo "❌ Student ID not found in the system.";
        exit;
    }

    $row = $result->fetch_assoc();
    $patient_id = $row['Patient_ID'];
    $time_in = date("Y-m-d H:i:s");

    $stmt = $mysqli->prepare("INSERT INTO visit_records (Patient_ID, Time_In, Reason) VALUES (?, ?, ?)");
    $stmt->bind_param("iss", $patient_id, $time_in, $reason);

    if ($stmt->execute()) {
        echo "✅ Time In recorded successfully!";
    } else {
        echo "❌ Error: " . $stmt->error;
    }

    $stmt->close();
    exit; // VERY IMPORTANT: prevents HTML from rendering
}
?>



<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="css/user_interfacestyle.css">
  <link rel="icon" type="image/png" href="pictures/logo.png">

</head>
<body>
  <div class="background"></div>
  <img src="pictures/logo_user.png" alt="Logo" class="logo_img">
  <div class="time">
    <p class="clock" id="clock"></p>
    <p class="weekday" id="weekday"></p>
    <p class="date" id="date"></p>
  </div>

  <div class="time_in">
    <h2>TIME IN</h2>
    <form action="#" class="transition-link" id="timeInForm" method="post">
      <div class="row1">
        <div class="row_id">
          <label>ID Number:</label> <br>
          <input type="text" name="id_number" placeholder="Enter your ID Number" required ><br>
        </div>
        <div class="row_department">
          <label>Department:</label><br> 
          <select name="department" id="department" required>
            <option value="" disabled selected>Select Department</option>
            <option value="College of Nursing">College of Nursing</option>
            <option value="College of International Hospitality Management">College of International Hospitality Management </option>
            <option value="College of Business Administration">College of Business Administration</option>
            <option value="College of Computer Studies">College of Computer Studies</option>
            <option value="College of Engineering">College of Engineering</option>
            <option value="College of Education">College of Education </option>
            <option value="College of Arts and Sciences">College of Arts and Sciences</option>
        </select>
        </div>
        
      </div>

      <div class="row2">
        <div class="row_category">
          <label>Category:</label><br>
          <select name="category" id="category" required>
            <option value="" disabled selected>Select Category</option>
            <option value="Student">Student</option>
            <option value="Teaching">Teaching</option>
            <option value="Non-Teaching">Non-Teaching</option>
          </select>
        </div>
        
        <div class="row_reason">
          <label>Reason for Visit:</label><br>
          <select name="reason" id="reason" required>
            <option value="" disabled selected>Select Reason</option>
            <option value="Headache">Headache</option>
            <option value="Toothache">Toothache</option>
            <option value="Menstrual cramps">Menstrual cramps</option>
            <option value="Asthma">Asthma attack or difficulty breathing</option>
            <option value="Borrow">Borrow</option>
            <option value="Return">Return</option>
            <option value="Other Reason">Other Reason</option>
          </select>
        </div>
      </div>
      
      <div class="other">
        <label>Other Reason:</label><br>
        <textarea id="remarks" name="other_reason" placeholder="Other Reason"></textarea>
      </div>
      
      <button type="submit">Submit</button>
    </form>
  </div>

  <div id="responseMessage" style="color: red; margin-top: 10px;"></div>

    <script src="js/time_in.js"></script>
    <script src="js/time.js"></script>
    <script>
   // Fade-in on page load
  window.addEventListener("DOMContentLoaded", () => {
    document.body.classList.add("loaded");
  });

  // Fade-out when clicking links with class 'transition-link'
  document.querySelectorAll('a.transition-link').forEach(link => {
    link.addEventListener("click", function (e) {
      e.preventDefault(); // stop the default behavior
      const target = this.href;

      document.body.classList.remove("loaded");
      document.body.classList.add("fade-out");

      setTimeout(() => {
        window.location.href = target;
      }, 500); // match the CSS transition time
    });
  });
    </script>
    
</body>
</html>
