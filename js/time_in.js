let stream = null; // Store camera stream for cleanup

// Start QR Scanner
function startQRScanner() {
  const video = document.getElementById("qr-video");
  const videoContainer = document.getElementById("qr-video-container");
  const canvasElement = document.createElement("canvas");
  const canvas = canvasElement.getContext("2d");

  // Show video container
  videoContainer.style.display = "flex";

  // Request camera access
  navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
    .then(mediaStream => {
      stream = mediaStream;
      video.srcObject = stream;
      video.play();
      console.log("QR scanner started.");

      // Process video frames
      function tick() {
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
          canvasElement.height = video.videoHeight;
          canvasElement.width = video.videoWidth;
          canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
          const imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: "dontInvert",
          });

          if (code) {
            const qrData = code.data; // e.g., "BITANCOR, JEREMIAH A.\n[23-00298\n]BSIT"
            console.log("QR code raw data:", qrData);
            
            // Clean QR data: remove extra whitespace and normalize line breaks
            const cleanedQrData = qrData.replace(/\s+/g, ' ').trim();
            console.log("Cleaned QR data:", cleanedQrData);
            
            // Extract ID number inside square brackets, allowing for internal whitespace
            const idMatch = cleanedQrData.match(/\[(\d{2}-\d{5})\s*\]/);
            if (idMatch && idMatch[1]) {
              let idNumber = idMatch[1].replace("-", ""); // e.g., "23-00298" → "2300298"
              const idInput = document.getElementById("id_number");
              console.log("Input element:", idInput);
              idInput.value = idNumber; // Set input value
              console.log("Set input value to:", idInput.value);
              idInput.focus(); // Focus input for UX
              console.log("QR code scanned, ID:", idNumber);
              Swal.fire({
                icon: "success",
                title: "QR Code Scanned",
                text: `ID Number: ${idNumber}`,
                timer: 1500,
                showConfirmButton: false
              });
              stopQRScanner();
            } else {
              console.log("Invalid QR code format:", cleanedQrData);
              Swal.fire({
                icon: "error",
                title: "Invalid QR Code",
                text: "The QR code does not contain a valid ID number in the format [XX-XXXXX].",
              });
            }
          }
        }
        if (video.srcObject) {
          requestAnimationFrame(tick);
        }
      }
      requestAnimationFrame(tick);
    })
    .catch(err => {
      console.error("QR scanner error:", err);
      Swal.fire({
        icon: "error",
        title: "Camera Error",
        text: "Unable to access camera. Please ensure camera permissions are granted.",
      });
      videoContainer.style.display = "none";
    });
}

// Stop QR Scanner
function stopQRScanner() {
  const video = document.getElementById("qr-video");
  const videoContainer = document.getElementById("qr-video-container");
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
    stream = null;
  }
  video.srcObject = null;
  videoContainer.style.display = "none";
  console.log("QR scanner stopped.");
}

// Form submission
document.getElementById("timeInForm").addEventListener("submit", function (e) {
  e.preventDefault();
  console.log("Time In form submitted.");

  const form = e.target;
  const reason = form.reason.value;
  const otherReason = form.other_reason.value.trim();
  const idNumber = form.id_number.value.trim();

  // Validation: ID number must not be empty and match XXXXXXX format
  if (idNumber === "" || !/^\d{7}$/.test(idNumber)) {
    Swal.fire({
      icon: "warning",
      title: "Invalid ID",
      text: "Please enter or scan a valid Identification Number (format: XXXXXXX).",
    });
    console.log("Client validation failed: Invalid ID number.");
    return;
  }

  // Validation: Either a standard reason or a filled out other reason is required
  if (!reason || (reason === "Other Reason" && otherReason === "")) {
    Swal.fire({
      icon: "warning",
      title: "Missing Reason",
      text: "Please select a reason or fill out the 'Other Reason' field.",
    });
    console.log("Client validation failed: No reason selected or other reason empty.");
    return;
  }

  const final_reason = (reason === "Other Reason") ? otherReason : reason;

  const data = {
    id_number: idNumber,
    reason: final_reason
  };
  console.log("Sending time-in data:", data);

  fetch("time_in.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.text();
  })
  .then(text => {
    console.log("Raw response:", text);
    try {
      const result = JSON.parse(text);
      console.log("Time-in response:", result);
      if (result.status === "success") {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Nakapag Timed In ka na",
        }).then(() => {
          console.log("Resetting form after successful time-in.");
          form.reset();
          document.querySelector(".other").style.display = "none";
        });
      } else if (result.message === "Student not found.") {
        Swal.fire({
          icon: "error",
          title: "ID Not Found",
          text: "Walang record ng ID Number na ito.",
        });
        console.log("Server validation failed: Student not found.");
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: result.message,
        });
        console.log("Server validation failed:", result.message);
      }
    } catch (parseError) {
      console.error("Parse error:", parseError, "Response text:", text);
      Swal.fire({
        icon: "error",
        title: "Server Error",
        text: "Invalid server response. Please try again.",
      });
    }
  })
  .catch(err => {
    console.error("Network error:", err);
    Swal.fire({
      icon: "error",
      title: "Network Error",
      text: "Failed to connect to the server. Please check your connection.",
    });
  });
});