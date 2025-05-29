function updateTime() {
  const now = new Date();
  const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const day = days[now.getDay()];
  const date = now.getDate().toString().padStart(2, '0');
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const year = now.getFullYear();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');

  document.getElementById('live-time').textContent = `${hours} : ${minutes} : ${seconds}`;
  document.getElementById('live-date').textContent = `${day} ${date} / ${month} / ${year}`;
}
setInterval(updateTime, 1000);
updateTime();

// Fetch patient data from your database
async function fetchPatientData(patientId) {
  try {
    // Replace this with your actual API endpoint that connects to your database
    const response = await fetch(`/api/patients/${patientId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch patient data');
    }
    
    const data = await response.json();
    
    // Format the full name based on your database fields
    if (data) {
      // Create full name from your specific database fields
      let fullName = data.First_Name || '';
      
      // Add middle initial if available
      if (data.Middle_Name) {
        const middleInitial = data.Middle_Name.charAt(0);
        fullName += ` ${middleInitial}.`;
      }
      
      // Add last name
      if (data.Last_Name) {
        fullName += ` ${data.Last_Name}`;
      }
      
      // Add formatted full name to the data object
      data.fullName = fullName.trim();
      
      // Add category information if needed
      data.category = data.Category;
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching patient data:', error);
    return null;
  }
}

// Close popup (placeholder)
function closePopup() {
  document.getElementById('popupContainer').style.display = 'none';
}

// Generate PDF
async function generatePDF() {
  try {
    console.log("Starting PDF generation...");
    if (!window.jspdf) {
      throw new Error("jsPDF library not loaded. Please check your internet connection or try again.");
    }

    // Get patient ID from input field
    const patientId = document.getElementById('patient_id').value || 'unknown';
    
    // Try to fetch patient data for the filename
    let studentName = 'unknown';
    let patientCategory = '';
    try {
      const patientData = await fetchPatientData(patientId);
      if (patientData && patientData.fullName) {
        studentName = patientData.fullName.replace(/\s+/g, '_');
        patientCategory = patientData.Category || '';
      }
    } catch (error) {
      console.warn('Could not fetch student name, using default filename', error);
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
      unit: 'mm',
      format: 'a4',
      orientation: 'portrait'
    });

    doc.setFont("helvetica", "normal");

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    const boxWidth = pageWidth - (2 * margin);
    let y = 20;

    const getText = id => document.getElementById(id)?.value || document.getElementById(id)?.textContent || 'N/A';
    const writeLine = (value, xPos, yPos, maxWidth) => {
      if (value && value !== 'N/A') {
        const lines = doc.splitTextToSize(value, maxWidth);
        doc.text(lines, xPos, yPos);
        return doc.getTextDimensions(lines, { maxWidth }).h;
      }
      return 0;
    };

    // Header with Logo
    const img = document.getElementById('myImage');
    if (img && img.complete && img.naturalWidth > 0) {
      console.log("Image loaded successfully");
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      ctx.drawImage(img, 0, 0);
      const imgData = canvas.toDataURL('image/png');

      const imgWidth = 15;
      const imgHeight = 15;
      doc.addImage(imgData, 'PNG', margin, y, imgWidth, imgHeight);

      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("PAMANTASAN NG LUNGSOD NG PASIG", margin + imgWidth + 5, y + 4);
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.text("Alkalde Jose St., Kapasigan, Pasig City", margin + imgWidth + 5, y + 8);
      doc.setFont("helvetica", "bold");
      doc.text("HEALTH SERVICES SECTION", margin + imgWidth + 5, y + 12);
      y += 20;
    } else {
      console.warn("Image not loaded or invalid; proceeding without logo");
    }

    // Title
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("ASSESSMENT OF PATIENT", pageWidth / 2, y, { align: "center" });
    y += 8;

    // Time and Date
    const timeBoxHeight = 15;
    doc.setLineWidth(0.5);
    doc.rect(margin, y, boxWidth, timeBoxHeight);
    doc.setFontSize(10);
    doc.text("Time: " + getText("live-time"), margin + 5, y + 5);
    doc.setFontSize(8);
    doc.text("Date: " + getText("live-date"), margin + 5, y + 12);
    y += timeBoxHeight + 5;

    // Vital Signs Section
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Vital Signs", margin, y);
    y += 5;

    const vitalBoxHeight = 45;
    doc.rect(margin, y, boxWidth, vitalBoxHeight);

    doc.setFontSize(7);
    doc.text("Patient ID: " + getText("patient_id"), margin + 5, y + 5);
    
    // Add student name and category if available
    if (studentName !== 'unknown') {
      doc.text("Name: " + studentName.replace(/_/g, ' '), margin + 80, y + 5);
      
      if (patientCategory) {
        doc.text("Category: " + patientCategory, margin + 80, y + 10);
      }
    }

    const vitalFields = [
      { label: "Temperature (°C)", id: "temperature", x: 5, y: 12 },
      { label: "Respiratory Rate (breaths/min)", id: "rr", x: 5, y: 20 },
      { label: "Height (cm)", id: "height", x: 5, y: 28 },
      { label: "Weight (kg)", id: "weight", x: 5, y: 36 },
      { label: "BMI", id: "bmi", x: 90, y: 12 },
      { label: "Pulse (beats/min)", id: "pulse", x: 90, y: 20 },
      { label: "Blood Pressure (mmHg)", id: "bp", x: 90, y: 28 }
    ];

    vitalFields.forEach(field => {
      doc.setFontSize(7);
      doc.text(field.label, margin + field.x, y + field.y);
      doc.line(margin + field.x + 50, y + field.y, margin + field.x + 80, y + field.y);
      writeLine(getText(field.id), margin + field.x + 60, y + field.y, 30);
    });

    y += vitalBoxHeight + 5;

    // Additional Notes Section
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Additional Notes", margin, y);
    y += 5;

    const notesBoxHeight = 60;
    doc.rect(margin, y, boxWidth, notesBoxHeight);
    doc.line(margin + (boxWidth / 2), y, margin + (boxWidth / 2), y + notesBoxHeight);

    doc.setFontSize(8);
    doc.text("Physician's Notes", margin + 5, y + 5);
    doc.setFontSize(7);
    writeLine(getText("physician_notes"), margin + 5, y + 12, boxWidth / 2 - 10);

    doc.setFontSize(8);
    doc.text("Nurse Notes", margin + (boxWidth / 2) + 5, y + 5);
    doc.setFontSize(7);
    writeLine(getText("nurse_notes"), margin + (boxWidth / 2) + 5, y + 12, boxWidth / 2 - 10);

    y += notesBoxHeight + 5;

    // Page Number
    doc.setFontSize(7);
    doc.text("1 of 1", margin, pageHeight - 10);

    // Create filename with date, time, patient ID and student name
    const dateStr = new Date().toISOString().slice(0, 10);
    const timeStr = new Date().toTimeString().slice(0, 8).replace(/:/g, '-');
    const categoryStr = patientCategory ? `_${patientCategory}` : '';
    const filename = `assessment_${dateStr}_${patientId}${categoryStr}_${studentName}.pdf`;

    console.log("Saving PDF as:", filename);
    doc.save(filename);
    console.log("PDF generated successfully");
  } catch (error) {
    console.error("Error generating PDF:", error.message);
    alert("Failed to generate PDF: " + error.message);
  }
}