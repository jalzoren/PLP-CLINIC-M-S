function closeSuccessPopup() {
            try {
            console.log("Starting PDF generation...");

          
            if (!window.jspdf) {
                throw new Error("jsPDF library not loaded. Please check your internet connection or try again.");
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

            const getText = id => {
                const value = document.getElementById(id)?.value || 'N/A';
                console.log(`Value of ${id}: ${value}`);  
                return value;
            };
            
            const getCheck = id => document.getElementById(id)?.checked ? 'X' : '';
            const writeLine = (value, xPos, yPos, maxWidth) => {
                if (value) {
                const lines = doc.splitTextToSize(value, maxWidth);
                doc.text(lines, xPos, yPos);
                return doc.getTextDimensions(lines, { maxWidth }).h;
                }
                return 0;
            };

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

            doc.setFontSize(14);
            doc.setFont("helvetica", "bold");
            doc.text("HEALTH SERVICES MEDICAL RECORD FORM", pageWidth / 2, y, { align: "center" });
            y += 8;

            // USER TYPE SECTION
            const boxHeight = 40;
            doc.setLineWidth(0.5);
            doc.rect(margin, y, boxWidth, boxHeight);
            doc.line(margin + (boxWidth / 2), y, margin + (boxWidth / 2), y + boxHeight);

            doc.setFontSize(9);
            doc.text(getCheck("studentCheckbox") + " Student", margin + 10, y + 5);

            doc.text("College/Dept.", margin + 5, y + 10);
            const deptX = margin + 10;
            const deptY = y + 15;
            const selectedDept = getText("collegeDepartment");
            doc.setFontSize(7);
            [
                { label: "CAS", x: 0, y: 0 },
                { label: "CCS", x: 0, y: 4 },  
                { label: "COE", x: 0, y: 8 },
                { label: "CBA", x: 0, y: 12 },
                { label: "COED", x: 0, y: 16 },
                { label: "CIHM", x: 0, y: 20 },
                { label: "CON", x: 0, y: 24 }
            ].forEach(dept => {
                const isChecked = selectedDept === dept.label ? 'X' : '';
                doc.text(isChecked + " " + dept.label, deptX + dept.x + 5, deptY + dept.y + 2);
            });

            doc.setFontSize(8);
            doc.text("Degree Program", margin + 5, y + 32);
            doc.line(margin + 35, y + 32, margin + (boxWidth / 2) - 5, y + 32);
            writeLine(getText("collegeProgram"), margin + 35, y + 32, boxWidth / 2 - 35);

            doc.text("Batch", margin + 5, y + 37);
            doc.line(margin + 20, y + 37, margin + (boxWidth / 2) - 5, y + 37);
            writeLine(getText("batch"), margin + 20, y + 37, boxWidth / 2 - 20);

            const persX = margin + (boxWidth / 2) + 5;
            doc.setFontSize(9);
            doc.text(getCheck("personnelCheckbox") + " Personnel", persX + 5, y + 5);

            doc.setFontSize(7);
            doc.text(getCheck("teaching") + " Teaching", persX + 10, y + 15);
            doc.text(getCheck("nonTeaching") + " Non-teaching", persX + 45, y + 15);

            doc.setFontSize(8);
            doc.text("College/Dept.", persX + 5, y + 20);
            const persDeptX = persX + 10;
            const persDeptY = y + 25;
            const selectedPersDept = getText("departmentPersonnel");
            doc.setFontSize(7);
            [
                { label: "HR", x: 0, y: 0 },
                { label: "Finance", x: 0, y: 4 },
                { label: "Maintenance", x: 0, y: 8 },
                { label: "IT", x: 35, y: 0 }
            ].forEach(dept => {
                const isChecked = selectedPersDept === dept.label ? 'X' : '';
                doc.text(isChecked + " " + dept.label, persDeptX + dept.x + 5, persDeptY + dept.y + 2);
            });

            y += boxHeight + 5;

            // PATIENT DATA SECTION
            doc.setFontSize(10);
            doc.setFont("helvetica", "bold");
            doc.text("Patient's Data", margin, y);
            y += 5;

            const createPatientTable = () => {
                const nameRowHeight = 14;
                doc.rect(margin, y, boxWidth, nameRowHeight);
                doc.line(margin + (boxWidth * 0.4), y, margin + (boxWidth * 0.4), y + nameRowHeight);
                doc.line(margin + (boxWidth * 0.7), y, margin + (boxWidth * 0.7), y + nameRowHeight);

                doc.setFontSize(7);
                doc.text("SURNAME", margin + 2, y + 3);
                doc.text("GIVEN NAME", margin + (boxWidth * 0.4) + 2, y + 3);
                doc.text("M.I.", margin + (boxWidth * 0.7) + 2, y + 3);
                doc.text("BIRTHDAY", margin + (boxWidth * 0.76) + 2, y + 3);

                writeLine(getText("lastname"), margin + 2, y + 10, boxWidth * 0.4 - 4);
                writeLine(getText("firstname"), margin + (boxWidth * 0.4) + 2, y + 10, boxWidth * 0.3 - 4);
                writeLine(getText("middlename").charAt(0), margin + (boxWidth * 0.7) + 2, y + 10, boxWidth * 0.06 - 4);

                const birthdayX = margin + (boxWidth * 0.76);
                doc.line(birthdayX, y + 5, margin + boxWidth, y + 5);
                doc.line(birthdayX + 12, y + 5, birthdayX + 12, y + nameRowHeight);
                doc.line(birthdayX + 24, y + 5, birthdayX + 24, y + nameRowHeight);

                doc.setFontSize(5);
                doc.text("DD", birthdayX + 3, y + 8);
                doc.text("MM", birthdayX + 15, y + 8);
                doc.text("YYYY", birthdayX + 27, y + 8);

                const birthday = getText("birthdate");
                if (birthday) {
                const [year, month, day] = birthday.split('-');
                writeLine(day, birthdayX + 2, y + 10, 10);
                writeLine(month, birthdayX + 14, y + 10, 10);
                writeLine(year, birthdayX + 26, y + 10, 15);
                }

                y += nameRowHeight;

                const demoRowHeight = 8;
                doc.rect(margin, y, boxWidth, demoRowHeight);

                const sections = [
                { width: boxWidth * 0.1, label: "SEX" },
                { width: boxWidth * 0.1, label: "AGE" },
                { width: boxWidth * 0.15, label: "CIVIL STATUS" },
                { width: boxWidth * 0.15, label: "RELIGION" },
                { width: boxWidth * 0.2, label: "NATIONALITY" },
                { width: boxWidth * 0.3, label: "CONTACT NUMBER" }
                ];

                let currentX = margin;
                doc.setFontSize(7);
                sections.forEach((section, index) => {
                if (index > 0) {
                    doc.line(currentX, y, currentX, y + demoRowHeight);
                }
                doc.text(section.label, currentX + 2, y + 3);
                currentX += section.width;
                });

                currentX = margin;
                writeLine(getText("gender"), currentX + 2, y + 7, boxWidth * 0.1 - 4);
                currentX += boxWidth * 0.1;
                writeLine(getText("age"), currentX + 2, y + 7, boxWidth * 0.1 - 4);
                currentX += boxWidth * 0.1;
                writeLine(getText("civilstatus"), currentX + 2, y + 7, boxWidth * 0.15 - 4);
                currentX += boxWidth * 0.15;
                writeLine(getText("religion"), currentX + 2, y + 7, boxWidth * 0.15 - 4);
                currentX += boxWidth * 0.15;
                writeLine(getText("nationality"), currentX + 2, y + 7, boxWidth * 0.2 - 4);
                currentX += boxWidth * 0.2;
                writeLine(getText("contact"), currentX + 2, y + 7, boxWidth * 0.3 - 4);

                y += demoRowHeight;

                doc.rect(margin, y, boxWidth, 8);
                doc.setFontSize(7);
                doc.text("ADDRESS", margin + 2, y + 3);
                y += 8;

                const addrRowHeight = 8;
                doc.rect(margin, y, boxWidth, addrRowHeight);
                doc.line(margin + 18, y, margin + 18, y + addrRowHeight);
                doc.line(margin + 90, y, margin + 90, y + addrRowHeight);

                doc.setFontSize(5);
                doc.text("No.", margin + 7, y + 3);
                doc.text("STREET", margin + 50, y + 3);
                doc.text("VILLAGE/SUBDIVISION", margin + 120, y + 3);

                const addressParts = getText("address").split(", ");
                writeLine(addressParts[0] || "", margin + 2, y + 7, 16);
                writeLine(addressParts[1] || "", margin + 20, y + 7, 70);
                writeLine(addressParts[2] || "", margin + 92, y + 7, boxWidth - 92);

                y += addrRowHeight;

                doc.rect(margin, y, boxWidth, addrRowHeight);
                doc.line(margin + 60, y, margin + 60, y + addrRowHeight);
                doc.line(margin + 130, y, margin + 130, y + addrRowHeight);

                doc.text("CITY/MUNICIPALITY", margin + 25, y + 3);
                doc.text("PROVINCE", margin + 90, y + 3);
                doc.text("ZIPCODE", margin + 150, y + 3);

                writeLine(getText("city"), margin + 2, y + 7, 58);
                writeLine(getText("province"), margin + 62, y + 7, 68);
                writeLine(getText("zipcode"), margin + 132, y + 7, boxWidth - 132);

                y += addrRowHeight;
            };

            createPatientTable();
            y += 5;

            // EMERGENCY CONTACT SECTION
            doc.setFontSize(10);
            doc.setFont("helvetica", "bold");
            doc.text("Person to contact in case of emergency", margin, y);
            y += 5;

            const createEmergencyTable = () => {
                const nameRowHeight = 14;
                doc.rect(margin, y, boxWidth, nameRowHeight);
                doc.line(margin + (boxWidth * 0.4), y, margin + (boxWidth * 0.4), y + nameRowHeight);
                doc.line(margin + (boxWidth * 0.7), y, margin + (boxWidth * 0.7), y + nameRowHeight);

                doc.setFontSize(7);
                doc.text("SURNAME", margin + 2, y + 3);
                doc.text("GIVEN NAME", margin + (boxWidth * 0.4) + 2, y + 3);
                doc.text("M.I.", margin + (boxWidth * 0.7) + 2, y + 3);
                doc.text("RELATIONSHIP", margin + (boxWidth * 0.76) + 2, y + 3);

                writeLine(getText("emergencyLastname"), margin + 2, y + 10, boxWidth * 0.4 - 4);
                writeLine(getText("emergencyFirstname"), margin + (boxWidth * 0.4) + 2, y + 10, boxWidth * 0.3 - 4);
                writeLine(getText("emergencymiddlename").charAt(0), margin + (boxWidth * 0.7) + 2, y + 10, boxWidth * 0.06 - 4);
                writeLine(getText("relationship"), margin + (boxWidth * 0.76) + 2, y + 10, boxWidth * 0.24 - 4);

                y += nameRowHeight;

                doc.rect(margin, y, boxWidth, 8);
                doc.setFontSize(7);
                doc.text("ADDRESS", margin + 2, y + 3);
                y += 8;

                const addrRowHeight = 8;
                doc.rect(margin, y, boxWidth, addrRowHeight);
                doc.line(margin + 18, y, margin + 18, y + addrRowHeight);
                doc.line(margin + 90, y, margin + 90, y + addrRowHeight);

                doc.setFontSize(5);
                doc.text("No.", margin + 7, y + 3);
                doc.text("STREET", margin + 50, y + 3);
                doc.text("VILLAGE/SUBDIVISION", margin + 120, y + 3);

                const emAddressParts = getText("emergencyaddress").split(", ");
                writeLine(emAddressParts[0] || "", margin + 2, y + 7, 16);
                writeLine(emAddressParts[1] || "", margin + 20, y + 7, 70);
                writeLine(emAddressParts[2] || "", margin + 92, y + 7, boxWidth - 92);

                y += addrRowHeight;

                doc.rect(margin, y, boxWidth, addrRowHeight);
                doc.line(margin + 60, y, margin + 60, y + addrRowHeight);
                doc.line(margin + 130, y, margin + 130, y + addrRowHeight);

                doc.text("CITY/MUNICIPALITY", margin + 25, y + 3);
                doc.text("PROVINCE", margin + 90, y + 3);
                doc.text("ZIPCODE", margin + 150, y + 3);

                writeLine(getText("emergencycity"), margin + 2, y + 7, 58);
                writeLine(getText("emergencyprovince"), margin + 62, y + 7, 68);
                writeLine(getText("emergencyzipcode"), margin + 132, y + 7, boxWidth - 132);

                doc.rect(margin + 130, y - addrRowHeight, boxWidth - 130, addrRowHeight);
                doc.text("CONTACT NUMBER", margin + 150, y - addrRowHeight + 3);
                writeLine(getText("emergencycontact"), margin + 132, y - addrRowHeight + 7, boxWidth - 132);

                y += addrRowHeight;
            };

            createEmergencyTable();
            y += 5;

            // PERSONAL HISTORY SECTION
            doc.setFontSize(10);
            doc.setFont("helvetica", "bold");
            doc.text("PERSONAL HISTORY", margin, y);
            y += 5;

            const medicalBoxHeight = 35;
            doc.rect(margin, y, boxWidth, medicalBoxHeight);

            doc.setFontSize(8);
            doc.text("Medical", margin + 5, y + 5);

            const leftCheckX = margin + 10;
            let checkY = y + 10;
            [
                { id: "hypertension", label: "Hypertension" },
                { id: "tubercolosis", label: "High Cholesterol" },
                { id: "highCholesterol", label: "Diabetes" },
                { id: "cancer", label: "Cancer" },
                { id: "emphysema", label: "Emphysema" }
            ].forEach(condition => {
                doc.setFontSize(6);
                doc.text(getCheck(condition.id) + " " + condition.label, leftCheckX + 5, checkY + 2);
                checkY += 5;
            });

            const rightCheckX = margin + 80;
            checkY = y + 10;
            [
                { id: "tubercolosis", label: "Tuberculosis" },
                { id: "allergies", label: "Allergies: " + getText("allergiesText").substring(0, 30) },
                { id: "thyroidProblems", label: "Thyroid problem" },
                { id: "asthma", label: "Asthma" },
                { id: "otherMedical", label: "OTHERS: " + getText("otherMedicalText").substring(0, 30) }
            ].forEach(condition => {
                doc.setFontSize(6);
                doc.text(getCheck(condition.id) + " " + condition.label, rightCheckX + 5, checkY + 2, { maxWidth: 70 });
                checkY += 5;
            });

            doc.setFontSize(7);
            doc.text("Maintenance medication/s:", margin + 5, y + 30);
            doc.line(margin + 50, y + 30, margin + (boxWidth / 2) - 5, y + 30);
            writeLine(getText("maintenanceMedications"), margin + 50, y + 30, boxWidth / 2 - 50);

            y += medicalBoxHeight + 5;

            const surgicalBoxHeight = 15;
            doc.rect(margin, y, boxWidth, surgicalBoxHeight);
            const surgicalX = margin + 5;
            doc.setFontSize(8);
            doc.text("Surgical", surgicalX, y + 5);
            doc.setFontSize(6);
            doc.text(getCheck("surgical") + " Yes  Specify: " + getText("surgicalText"), surgicalX + 8, y + 10, { maxWidth: 80 });
            doc.text(getCheck("noneSurgery") + " None", surgicalX + 80, y + 10);
            y += surgicalBoxHeight + 5;

            const smokingBoxHeight = 30;
            doc.rect(margin, y, boxWidth, smokingBoxHeight);
            doc.setFontSize(8);
            doc.text("Smoking", margin + 5, y + 5);
            doc.setFontSize(6);
            doc.text(getCheck("yesCheckbox") + " Yes, and I use:", margin + 8, y + 10);
            doc.text("I started since: ", margin + 20, y + 15);
            doc.line(margin + 40, y + 15, margin + 60, y + 15);
            writeLine(getText("cigaretteStartedDate"), margin + 40, y + 15, 20);

            const smokeOptionX = margin + 80;
            doc.text(getCheck("cigarette") + " Cigarette", smokeOptionX + 5, y + 10);
            doc.text(getCheck("vape") + " Vape", smokeOptionX + 35, y + 10);
            doc.text(getCheck("pipe") + " Pipe", smokeOptionX + 55, y + 10);

            doc.text("If cigarette, indicate no. of sticks/day ", margin + 20, y + 20);
            doc.line(margin + 60, y + 20, margin + 70, y + 20);
            writeLine(getText("sticksperday"), margin + 60, y + 20, 10);

            doc.text(getCheck("noCheckbox") + " Never", margin + 8, y + 25);
            doc.text(getCheck("sometimesCheckbox") + " I tried only once", margin + 40, y + 25);
            doc.text(getCheck("preferNotCheckbox") + " I stopped already since: ", margin + 80, y + 25);
            doc.line(margin + 110, y + 25, margin + 130, y + 25);
            writeLine(getText("stoppedDate"), margin + 110, y + 25, 20);

            y += smokingBoxHeight + 5;

            const drugsBoxHeight = 15;
            doc.rect(margin, y, boxWidth, drugsBoxHeight);

            doc.setFontSize(8);
            doc.text("Use of prohibited drugs", margin + 5, y + 5);

            doc.setFontSize(6);
            doc.text(getCheck("yesDrugsCheckbox") + " Yes:", margin + 10, y + 10);

            const drugOptionX = margin + 20;
            doc.text(getCheck("shabu") + " Shabu", drugOptionX + 5, y + 10);
            doc.text(getCheck("ecstasy") + " Ecstasy", drugOptionX + 30, y + 10);
            doc.text(getCheck("marijuana") + " Marijuana", drugOptionX + 5, y + 15);
            doc.text(getCheck("lsd") + " LSD", drugOptionX + 30, y + 15);
            doc.text(getCheck("othersub") + " Others: " + getText("drugs_others_text").substring(0, 30), drugOptionX + 55, y + 10, { maxWidth: 50 });

            y += drugsBoxHeight + 5;

            // Move to Page 2 for Maternal and Alcohol
            doc.addPage();
            y = 20;

            doc.setFontSize(10);
            doc.setFont("helvetica", "bold");
            doc.text("PERSONAL HISTORY (Continued)", margin, y);
            y += 5;

            const maternalBoxHeight = 30;
            doc.rect(margin, y, boxWidth, maternalBoxHeight);

            doc.setFontSize(8);
            doc.text("Maternal (for female only)", margin + 5, y + 5);
            doc.setFontSize(6);

            let maternalY = y + 10;
            [
                { id: "numberOfPreg", label: "Number of pregnancies" },
                { id: "numberOfMiscarriage", label: "Number of miscarriages" },
                { id: "numberOfTermdeliveries", label: "Number of term deliveries" },
                { id: "numberOfPrematureDeliveries", label: "Number of premature deliveries" },
                { id: "totalnumberofChildren", label: "Total number of children" }
            ].forEach(item => {
                doc.text(item.label + ": " + getText(item.id), margin + 8, maternalY, { maxWidth: 80 });
                maternalY += 4;
            });

            y += maternalBoxHeight + 5;

            const alcoholBoxHeight = 20;
            doc.rect(margin, y, boxWidth, alcoholBoxHeight);

            doc.setFontSize(8);
            doc.text("Alcohol", margin + 5, y + 5);

            doc.setFontSize(6);
            doc.text(getCheck("oncePerWeekalcohol") + " Once per week", margin + 10, y + 10);
            doc.text(getCheck("moreThanonceperweekalcohol") + " More than once per week", margin + 10, y + 15);
            doc.text("Amount per consumption: " + getText("totalperconsupAlchoText"), margin + 10, y + 20, { maxWidth: 80 });

            y += alcoholBoxHeight + 5;

            // FAMILY HISTORY SECTION
            doc.setFontSize(10);
            doc.setFont("helvetica", "bold");
            doc.text("FAMILY HISTORY", margin, y);
            y += 5;

            const familyBoxHeight = 30;
            doc.rect(margin, y, boxWidth, familyBoxHeight);

            const famLeftCheckX = margin + 8;
            let famCheckY = y + 5;
            [
                { id: "FamHishypertension", label: "Hypertension" },
                { id: "FamHishighCholesterol", label: "High Cholesterol" },
                { id: "FamHisdiabetes", label: "Diabetes" },
                { id: "FamHiscancer", label: "Cancer" },
                { id: "FamHisemphysema", label: "Emphysema" }
            ].forEach(condition => {
                doc.setFontSize(6);
                doc.text(getCheck(condition.id) + " " + condition.label, famLeftCheckX + 5, famCheckY + 2);
                famCheckY += 5;
            });

            const famRightCheckX = margin + 80;
            famCheckY = y + 5;
            [
                { id: "FamHisthyroidProblems", label: "Tuberculosis" },
                { id: "FamHisallergiesCheckbox", label: "Allergies: " + getText("FamHisallergiesText").substring(0, 30) },
                { id: "FamHisthyroidProblems", label: "Thyroid problem" },
                { id: "FamHisasthma", label: "Asthma" },
                { id: "SpecifyFamHisCheckbox", label: "OTHERS: " + getText("SpecifyFamHisText").substring(0, 30) }
            ].forEach(condition => {
                doc.setFontSize(6);
                doc.text(getCheck(condition.id) + " " + condition.label, famRightCheckX + 5, famCheckY + 2, { maxWidth: 70 });
                famCheckY += 5;
            });

            y += familyBoxHeight + 5;

            // CERTIFICATION TEXT
            doc.setFontSize(7);
            doc.setFont("helvetica", "normal");
            const certText = "I hereby certify that the data provided herein are true in the best of my knowledge and are written without any coercion. I allow the university health services section (clinic) to use my data for the purpose only of medical assessment, treatment, management, health promotion, and research without bridging my confidentiality.";

            const textWidth = boxWidth - 10;
            const textLines = doc.splitTextToSize(certText, textWidth);
            doc.text(textLines, margin, y);

            y += textLines.length * 4 + 8;

            // SIGNATURE LINE
            doc.line(margin + (boxWidth / 2) + 15, y, margin + boxWidth - 15, y);
            doc.setFontSize(7);
            doc.text("Signature over printed name: " + getText("signature"), margin + (boxWidth / 2) + 25, y + 3, { maxWidth: 80 });

            doc.line(margin + 15, y + 8, margin + 75, y + 8);
            doc.text("Date: " + getText("form_date"), margin + 25, y + 11);

            // Page numbers
            doc.setFontSize(7);
            doc.text("1 of 2", margin, pageHeight - 10);
            doc.setPage(2);
            doc.text("2 of 2", margin, pageHeight - 10);

            console.log("Saving PDF...");
            const pdfBlob = doc.output("blob");
            console.log("PDF size:", pdfBlob.size, "bytes");

            generatePDFAndUpload();
              
            console.log("PDF generated successfully");
            } catch (error) {
            console.error("Error generating PDF:", error.message);
            alert("Failed to generate PDF: " + error.message);
            }

            document.getElementById("SuccessPopup").style.display = "none";
            document.getElementById("medicalRecordForm").style.display = "none";
        
            const form = document.getElementById("medicalRecordForm");
            if (form) form.reset();
     }

     function generatePDFAndUpload(patientID) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
      
        doc.text("Example PDF content", 10, 10);
      
        const pdfBase64 = doc.output("datauristring");
      
        console.log("Sending to backend:", { pdfData: pdfBase64, patientID });
      
        fetch("save_pdf.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pdfData: pdfBase64, patientID: patientID })
        })
        .then(res => res.text())
        .then(data => console.log("Server response:", data))
        .catch(err => console.error("Upload error:", err));
      }
      