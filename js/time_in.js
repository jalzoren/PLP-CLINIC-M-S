// Clock and date functionality
function updateClock() {
  const now = new Date();
  const hours = now.getHours() % 12 || 12;
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
  const ampm = now.getHours() >= 12 ? 'PM' : 'AM';
  document.getElementById('clock').textContent = `${hours}:${minutes}:${seconds} ${ampm}`;

  // Update date and weekday only if they’ve changed
  const dateKey = now.toDateString();
  if (document.body.dataset.lastDate !== dateKey) {
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    document.getElementById('weekday').textContent = weekdays[now.getDay()];
    document.getElementById('date').textContent = `${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;
    document.body.dataset.lastDate = dateKey;
  }
}
updateClock();
setInterval(updateClock, 1000);



// Toggle Other Reason textarea
document.getElementById('reason').addEventListener('change', function () {
  const otherDiv = document.querySelector('.other');
  const remarks = document.getElementById('remarks');
  otherDiv.style.display = this.value === 'Other Reason' ? 'block' : 'none';
  if (this.value !== 'Other Reason') remarks.value = '';
});

// Form validation and submission
document.getElementById('timeInForm').addEventListener('submit', async e => {
  e.preventDefault();
  const idNumber = document.getElementById('id_number').value;
  const reason = document.getElementById('reason').value;
  const otherReason = document.getElementById('remarks').value;

  // Client-side validation
  if (!idNumber || isNaN(idNumber) || idNumber <= 0) {
    Swal.fire('Error', 'Please enter a valid ID number.', 'error');
    return;
  }
  if (!reason) {
    Swal.fire('Error', 'Please select a reason.', 'error');
    return;
  }
  if (reason === 'Other Reason' && !otherReason.trim()) {
    Swal.fire('Error', 'Please specify the other reason.', 'error');
    return;
  }

  try {
    const response = await fetch('time_in.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_number: idNumber, reason, other_reason: otherReason })
    });
    const data = await response.json();
    Swal.fire({
      icon: data.status,
      title: data.status === 'success' ? 'Success' : 'Error',
      text: data.message
    });
    if (data.status === 'success') {
      document.getElementById('timeInForm').reset();
      document.querySelector('.other').style.display = 'none';
    }
  } catch (error) {
    console.error('Submission error:', error);
    Swal.fire('Error', 'Failed to submit. Please try again.', 'error');
  }
});

// QR Scanner functionality
let stream = null;
function startQRScanner() {
  const video = document.getElementById('qr-video');
  const qrContainer = document.getElementById('qr-video-container');
  
  navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
    .then(mediaStream => {
      stream = mediaStream;
      video.srcObject = stream;
      qrContainer.style.display = 'block';
      scanQRCode(video);
    })
    .catch(err => {
      console.error('Camera access error:', err);
      Swal.fire('Error', 'Unable to access camera. Please check permissions.', 'error');
    });
}

function stopQRScanner() {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
    stream = null;
  }
  document.getElementById('qr-video-container').style.display = 'none';
}

function scanQRCode(video) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  
  function tick() {
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.height = video.videoHeight;
      canvas.width = video.videoWidth;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height);
      if (code) {
        document.getElementById('id_number').value = code.data;
        stopQRScanner();
        Swal.fire('Success', 'QR Code scanned successfully!', 'success');
        return;
      }
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}