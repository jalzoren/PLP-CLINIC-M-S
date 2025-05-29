function closePopup() {
  document.getElementById("popupContainer").style.display = "none";
  document.getElementById("popupPatient").style.display = "none";
  document.getElementById("popupPersonalHistory").style.display = "none";
  document.getElementById("popupFamilyHistory").style.display = "none";
}

function closeEmptyFieldPopup() {
  document.getElementById('emptyFieldPopup').style.display = "none";
  document.getElementById('popupContainer').style.display = "block";        
}

function closeDuplicationPopup() {
  document.getElementById("DuplicatePopup").style.display = "none";
  document.getElementById("popupPatient").style.display = "block";
}

function closeSurgicalPopup() {
  document.getElementById("SurgicalPopup").style.display = "none";
  document.getElementById("popupPersonalHistory").style.display = "block";
}

function closeSmokingPopup() {
  document.getElementById("SmokingPopup").style.display = "none";
  document.getElementById("popupPersonalHistory").style.display = "block";
}

function closeDrugsPopup() {
  document.getElementById("DrugsPopup").style.display = "none";
  document.getElementById("popupPersonalHistory").style.display = "block";
}

function closeAlcoholPopup() {
  document.getElementById("AlcoholPopup").style.display = "none";
  document.getElementById("popupPersonalHistory").style.display = "block";
}

function closeSuccessPopup() {
  document.getElementById("SuccessPopup").style.display = "none";
  document.getElementById("popupContainer").style.display = "block"; 
}

function openPopupPatient() {
  var studentCheckbox = document.getElementById('studentCheckbox').checked;
  var personnelCheckbox = document.getElementById('personnelCheckbox').checked;
  var collegeDepartment = document.getElementById('collegeDepartment').value.trim();
  var program = document.getElementById('collegeProgram').value.trim();
  var batch = document.getElementById('batch').value.trim();
  var teaching = document.getElementById('teaching').checked;
  var nonTeaching = document.getElementById('nonTeaching').checked;
  var departmentPersonnel = document.getElementById('departmentPersonnel').value.trim();

  let hasError = false;

  if (!studentCheckbox && !personnelCheckbox) {
    hasError = true;
  }

  if (studentCheckbox) {
    if (collegeDepartment === "" || program === "" || batch === "") {
      hasError = true;
    }
  }

  if (personnelCheckbox) {
    if (!teaching && !nonTeaching) {
      hasError = true;
    }
    if (departmentPersonnel === "") {
      hasError = true;
    }
  }

  if (hasError) {
    document.getElementById('emptyFieldPopup').style.display = "block";
  } else {
    document.getElementById('popupContainer').style.display = "none"; 
    document.getElementById('popupPatient').style.display = "block"; 
  }
  
}

function goBackToCategory() {
  document.getElementById("popupPatient").style.display = "none"; 
  document.getElementById("popupContainer").style.display = "block"; 
}

function goBackToPopupPatient() {
  document.getElementById("popupPersonalHistory").style.display = "none"; 
  document.getElementById("popupPatient").style.display = "block"; 
}

function goBackToPersonalHistoPopUp() {
  document.getElementById("popupFamilyHistory").style.display = "none"; 
  document.getElementById("popupPersonalHistory").style.display = "block"; 
}

function goToPersonalHistoPopUp() {
  const requiredFields = document.querySelectorAll(
    "#dataTable input, #dataTable select, #contactTable input, #contactTable select"
  );

  let allFilled = true;

  requiredFields.forEach(field => {
    if (field.value.trim() === "") {
      allFilled = false;
    }
  });

  if (!allFilled) {
    document.getElementById("emptyFieldPopup").style.display = "block";
  } else {
    document.getElementById("popupPatient").style.display = "none"; 
    document.getElementById("popupPersonalHistory").style.display = "block"; 
  }

}

function goToFamilyHistoPopUp() {
  const surgicalCheckbox = document.getElementById('surgical');
  const surgicalText = document.getElementById('surgicalText');
  const noneSurgeryCheckbox = document.getElementById('noneSurgery');
  const yesSmoking = document.getElementById('yesCheckbox').checked;
  const noSmoking = document.getElementById('noCheckbox').checked;
  const triedSmoking = document.getElementById('sometimesCheckbox').checked;
  const stoppedSmoking = document.getElementById('preferNotCheckbox').checked;
  const yesDrugs = document.getElementById('yesDrugsCheckbox').checked;
  const neverDrugs = document.getElementById('NeverDrugsCheckbox').checked;
  const triedDrugs = document.getElementById('TriedDrugsCheckbox').checked;
  const sometimesDrugs = document.getElementById('SometimesDrugsCheckbox').checked;
  const oncePerWeek = document.getElementById('oncePerWeekalcohol').checked;
  const moreThanOnce = document.getElementById('moreThanonceperweekalcohol').checked;
  const totalText = document.getElementById('totalperconsupAlchoText').value.trim();

  if (!(surgicalCheckbox.checked || surgicalText.value.trim() !== "" || noneSurgeryCheckbox.checked)) {
    document.getElementById('SurgicalPopup').style.display = 'block';
    return;  
  }

  if (!(yesSmoking || noSmoking || triedSmoking || stoppedSmoking)) {
    document.getElementById('SmokingPopup').style.display = 'block';
    return;
  }

  if (!(yesDrugs || neverDrugs || triedDrugs || sometimesDrugs)) {
    document.getElementById('DrugsPopup').style.display = 'block';
    return;
  }

  document.getElementById("popupPersonalHistory").style.display = "none"; 
  document.getElementById("popupFamilyHistory").style.display = "block"; 

}


function initializePopupFormLogic(){
  const studentCheckbox = document.getElementById("studentCheckbox");
  const personnelCheckbox = document.getElementById("personnelCheckbox");
  const studentFields = document.getElementById("studentFields");
  const personnelFields = document.getElementById("personnelFields");

  function clearInputs(container) {
    const inputs = container.querySelectorAll("input, select");
    inputs.forEach(input => {
      if (input.type === "checkbox" || input.type === "radio") {
        input.checked = false;
      } else {
        input.value = "";
      }
    });
  }

  studentCheckbox.addEventListener("change", () => {
    if (studentCheckbox.checked) {
      personnelCheckbox.checked = false;
      studentFields.style.display = "block";
      personnelFields.style.display = "none";
      
      clearInputs(personnelFields);
      teaching.checked = false;
      nonTeaching.checked = false;

      document.getElementById("departmentPersonnel").selectedIndex = 0;
    } else {
      studentFields.style.display = "none";
      clearInputs(studentFields); 
    }
  });

  personnelCheckbox.addEventListener("change", () => {
    if (personnelCheckbox.checked) {
      studentCheckbox.checked = false;
      personnelFields.style.display = "block";
      studentFields.style.display = "none";
      clearInputs(studentFields); 

      document.getElementById("collegeProgram").selectedIndex = 0;
      document.getElementById("collegeDepartment").selectedIndex = 0;
    } else {
      personnelFields.style.display = "none";
      clearInputs(personnelFields); 
    }
  });

  const nonTeaching = document.getElementById("nonTeaching");
  const teaching = document.getElementById("teaching");

  nonTeaching.addEventListener('change', function() {
    if (this.checked) {
      teaching.checked = false; 
    }
  });

  teaching.addEventListener('change', function() {
    if (this.checked) {
      nonTeaching.checked = false; 
    }
  });

  // Alcohol
  const moreThanOncePerWeek = document.getElementById('moreThanonceperweekalcohol');
  const oncePerWeek = document.getElementById('oncePerWeekalcohol');

  moreThanOncePerWeek.addEventListener('change', function() {
    if (this.checked) {
      oncePerWeek.checked = false; 
    }
  });

  oncePerWeek.addEventListener('change', function() {
    if (this.checked) {
      moreThanOncePerWeek.checked = false; 
    }
  });

  // Surgical
  const surgicalCheckbox = document.getElementById('surgical');
  const noneSurgeryCheckbox = document.getElementById('noneSurgery');
  const surgicalText = document.getElementById('surgicalText');

  surgicalCheckbox.addEventListener('change', function() {
    if (this.checked) {
      noneSurgeryCheckbox.checked = false; 
    }
  });

  noneSurgeryCheckbox.addEventListener('change', function() {
    if (this.checked) {
      surgicalCheckbox.checked = false; 
    }
  });

  // Drugs
  document.getElementById("yesDrugsCheckbox").addEventListener("change", function() {
    const flexWrapper4 = document.getElementById("flex-wrapper4");
    
    if (this.checked) {
      flexWrapper4.style.display = "block";
    } else {
      flexWrapper4.style.display = "none";
      
      document.querySelectorAll("#flex-wrapper4 input[type='checkbox']").forEach(function(checkbox) {
        checkbox.checked = false;
      });
    }
  });

  const yesRehab = document.getElementById('yesRehab');
  const noRehab = document.getElementById('noRehab');

  yesRehab.addEventListener('change', function() {
    if (yesRehab.checked) {
      noRehab.checked = false;
    }
  });

  noRehab.addEventListener('change', function() {
    if (noRehab.checked) {
      yesRehab.checked = false;
    }
  });

  const yesDrugsCheckbox = document.getElementById('yesDrugsCheckbox');
  const noDrugsCheckbox = document.getElementById('NeverDrugsCheckbox');
  const sometimesDrugsCheckbox = document.getElementById('SometimesDrugsCheckbox');
  const preferNotDrugsCheckbox = document.getElementById('TriedDrugsCheckbox');
  const flexWrapper4 = document.getElementById('flex-wrapper4');

  function clearDrugSection() {
    flexWrapper4.style.display = 'none';

    // Uncheck all checkboxes inside #flex-wrapper4 (substances and rehab)
    document.querySelectorAll("#flex-wrapper4 input[type='checkbox']").forEach(function(checkbox) {
      checkbox.checked = false;
    });
  }

  yesDrugsCheckbox.addEventListener('change', function() {
    if (yesDrugsCheckbox.checked) {
      noDrugsCheckbox.checked = false;
      sometimesDrugsCheckbox.checked = false;
      preferNotDrugsCheckbox.checked = false;
      flexWrapper4.style.display = 'block';
    }
  });


  noDrugsCheckbox.addEventListener('change', function() {
    if (noDrugsCheckbox.checked) {
      yesDrugsCheckbox.checked = false;
      sometimesDrugsCheckbox.checked = false;
      preferNotDrugsCheckbox.checked = false;
      clearDrugSection();
    }
  });

  sometimesDrugsCheckbox.addEventListener('change', function() {
    if (sometimesDrugsCheckbox.checked) {
      yesDrugsCheckbox.checked = false;
      noDrugsCheckbox.checked = false;
      preferNotDrugsCheckbox.checked = false;
      clearDrugSection();
    }
  });

  preferNotDrugsCheckbox.addEventListener('change', function() {
    if (preferNotDrugsCheckbox.checked) {
      yesDrugsCheckbox.checked = false;
      noDrugsCheckbox.checked = false;
      sometimesDrugsCheckbox.checked = false;
      clearDrugSection();
    }
  });

  // Smoking
  document.getElementById("yesCheckbox").addEventListener("change", function() {
    const flexWrapper3 = document.getElementById("flex-wrapper3");
    
    if (this.checked) {
      flexWrapper3.style.display = "block";
    } else {
      flexWrapper3.style.display = "none";
      
      document.querySelectorAll("#flex-wrapper3 input[type='checkbox']").forEach(function(checkbox) {
        checkbox.checked = false;
      });
    }
  });

  function clearInputs(element) {
    const inputs = element.querySelectorAll('input');
    inputs.forEach(input => {
      input.value = '';
    });
  }

  const yesCheckbox = document.getElementById('yesCheckbox');
  const noCheckbox = document.getElementById('noCheckbox');
  const sometimesCheckbox = document.getElementById('sometimesCheckbox');
  const preferNotCheckbox = document.getElementById('preferNotCheckbox');
  const flexWrapper3 = document.getElementById('flex-wrapper3');
  const stoppedDate = document.getElementById('stoppedDate');

  function resetOtherCheckboxes(checkedCheckbox) {
    [yesCheckbox, noCheckbox, sometimesCheckbox, preferNotCheckbox].forEach(checkbox => {
      if (checkbox !== checkedCheckbox) {
        checkbox.checked = false;
      }
    });
  }

  yesCheckbox.addEventListener('change', function() {
    if (yesCheckbox.checked) {
      resetOtherCheckboxes(yesCheckbox);
      flexWrapper3.style.display = 'block';
      stoppedDate.style.display = 'none';
    } else {
      clearInputs(flexWrapper3);
      flexWrapper3.style.display = 'none';
    }
  });

  noCheckbox.addEventListener('change', function() {
    if (noCheckbox.checked) {
      resetOtherCheckboxes(noCheckbox);
      flexWrapper3.style.display = 'none';
      stoppedDate.style.display = 'none';
    } else {
      clearInputs(flexWrapper3);
      clearInputs(stoppedDate);
    }
  });

  sometimesCheckbox.addEventListener('change', function() {
    if (sometimesCheckbox.checked) {
      resetOtherCheckboxes(sometimesCheckbox);
      flexWrapper3.style.display = 'none'; 
      stoppedDate.style.display = 'none';
    } else {
      clearInputs(flexWrapper3);
      clearInputs(stoppedDate);
    }
  });

  preferNotCheckbox.addEventListener('change', function() {
    if (preferNotCheckbox.checked) {
      resetOtherCheckboxes(preferNotCheckbox);

      flexWrapper3.style.display = 'none'; 
      stoppedDate.style.display = 'inline-block';
    } else {
      stoppedDate.style.display = 'none';
      clearInputs(stoppedDate);
    }
  });


  const cigaretteCheckbox = document.getElementById('cigarette');
  const vapeCheckbox = document.getElementById('vape');
  const pipeCheckbox = document.getElementById('pipe');
  const cigaretteSticksRow = document.getElementById('cigaretteSticksRow');
  const cigaretteStartedRow = document.getElementById('cigaretteStartedRow');

  function uncheckOthers(checkedCheckbox) {
    [cigaretteCheckbox, vapeCheckbox, pipeCheckbox].forEach(checkbox => {
      if (checkbox !== checkedCheckbox) {
        checkbox.checked = false;
      }
    });
  }

  cigaretteCheckbox.addEventListener('change', function() {
    uncheckOthers(this);

    if (this.checked) {
      cigaretteSticksRow.style.display = 'table-row'; 
      cigaretteStartedRow.style.display = 'table-row'; 
    } else {
      cigaretteSticksRow.style.display = 'none'; 
      cigaretteStartedRow.style.display = 'none';
      document.getElementById('cigaretteStartedRow').value = '';
      document.getElementById('sticksperday').value = '';
      document.getElementById('cigaretteStartedDate').value = '';
    }
  });

  noCheckbox.addEventListener('change', function() {
    if (this.checked) {
      vapeCheckbox.checked = false;
      pipeCheckbox.checked = false;
      document.getElementById('stoppedDate').value = '';
    }
  });

  sometimesCheckbox.addEventListener('change', function() {
    if (this.checked) {
      vapeCheckbox.checked = false;
      pipeCheckbox.checked = false;
      document.getElementById('stoppedDate').value = '';
    }
  });

  preferNotCheckbox.addEventListener('change', function() {
    if (this.checked) {
      vapeCheckbox.checked = false;
      pipeCheckbox.checked = false;
    }
  });

  [vapeCheckbox, pipeCheckbox].forEach(checkbox => {
    checkbox.addEventListener('change', function() {
      uncheckOthers(this);
      cigaretteSticksRow.style.display = 'none'; 
      cigaretteStartedRow.style.display = 'none';
      document.getElementById('cigaretteStartedRow').value = '';
      document.getElementById('sticksperday').value = ''; 
      document.getElementById('cigaretteStartedDate').value = ''; 
    });
  });

}

function generateEmail() {
  const lastname = document.getElementById("lastname").value.trim().toLowerCase();
  const firstname = document.getElementById("firstname").value.trim().toLowerCase().replace(/\s+/g, '');

  if (lastname && firstname) {
    const email = `${lastname}_${firstname}@plpasig.edu.ph`;
    document.getElementById("email").value = email;
  }
}

document.getElementById("lastname").addEventListener("input", generateEmail);
document.getElementById("firstname").addEventListener("input", generateEmail);


window.onload = function() {
  document.getElementById("popupContainer").style.display = "block"; 
}




function submitMedicalRecordForm(e) {
    e.preventDefault(); 

    const form = document.getElementById("medicalRecordForm");
    if (!form) {
      console.error("Form element not found!");
      return;
    }

    const formData = new FormData(form);

    // Get category
    if (document.getElementById("studentCheckbox").checked) {
      formData.append("user", "student");
      formData.append("category", "student");
      formData.append("collegeDepartment", document.getElementById("collegeDepartment").value);
      formData.append("collegeProgram", document.getElementById("collegeProgram").value);
      formData.append("batch", document.getElementById("batch").value);
    } else if (document.getElementById("personnelCheckbox").checked) {
      formData.append("user", "personnel");

      // Determine category type for personnel
      if (document.getElementById("teaching").checked) {
          formData.append("category", "teaching");
      } else if (document.getElementById("nonTeaching").checked) {
          formData.append("category", "non-teaching");
      } else {
          formData.append("category", "unspecified"); 
      }

      formData.append("departmentPersonnel", document.getElementById("departmentPersonnel").value);
    }

    // Patient's general data
    const hasSurgical = document.getElementById("surgical").checked;
    const hasNoneSurgery = document.getElementById("noneSurgery").checked;

    let surgicalStatus = hasNoneSurgery ? "none" : (hasSurgical ? "yes" : "none");

    formData.append("surgical", surgicalStatus);
    formData.append("surgicalText", document.getElementById("surgicalText").value.trim());

    // Medical Conditions
    const conditions = [
      { id: "hypertension", label: "Hypertension" },
      { id: "tubercolosis", label: "Tubercolosis" },
      { id: "highCholesterol", label: "High Cholesterol" },
      { id: "allergies", label: "Allergies", detailsId: "allergiesText" },
      { id: "diabetes", label: "Diabetes" },
      { id: "thyroidProblems", label: "Thyroid Problems" },
      { id: "cancer", label: "Cancer" },
      { id: "asthma", label: "Asthma" },
      { id: "emphysema", label: "Emphysema" },
      { id: "otherMedical", label: "Others", detailsId: "otherMedicalText" }
    ];

    conditions.forEach(condition => {
      const checkbox = document.getElementById(condition.id);
      if (checkbox && checkbox.checked) {
        const details = condition.detailsId ? document.getElementById(condition.detailsId).value.trim() : "";
        formData.append("conditions[]", JSON.stringify({
          name: condition.label,
          details: details
        }));
      }
    });

    const maintenance = document.getElementById("maintenanceMedications").value.trim();
    formData.append("maintenanceMedications", maintenance || "");

    const usageCheckboxes = document.querySelectorAll('input[name="usageStatus"]');
    usageCheckboxes.forEach(box => {
      if (box.checked) formData.append("usageStatus", box.value);
    });

    const smokingTypes = document.querySelectorAll('input[name="smokingTypes[]"]:checked');
    smokingTypes.forEach(type => {
      console.log('Selected smoking type:', type.value);
      formData.append("smokingTypes[]", type.value);
    });

    formData.append("sticksperday", document.getElementById("sticksperday").value.trim() || '');
    formData.append("cigaretteStartedDate", document.getElementById("cigaretteStartedDate").value.trim() || '');
    formData.append("stoppedDate", document.getElementById("stoppedDate").value.trim() || '');

    const drugStatusInputs = form.querySelectorAll('input[name="drugsStatus"]');
    let selectedDrugStatus = '';
    drugStatusInputs.forEach(input => {
      if (input.checked) {
        selectedDrugStatus = input.value;
      }
    });

    const rehabInputs = form.querySelectorAll('input[name="rehabilitation"]');
    let rehabValue = '';
    rehabInputs.forEach(input => {
      if (input.checked) {
        rehabValue = input.value;
      }
    });

    const selectedSubs = [];
    form.querySelectorAll('input[name="substances[]"]:checked').forEach(input => {
      selectedSubs.push(input.value);
    });
    formData.set('drug_status', selectedDrugStatus);
    formData.set('rehabilitation', rehabValue);

    selectedSubs.forEach(sub => {
      formData.append('substances[]', sub);
    });

    const familyHistory = [];
    document.querySelectorAll('input[name="family_history[]"]:checked').forEach(input => {
      familyHistory.push(input.value);
    });

    const allergiesChecked = document.getElementById('FamHisallergiesCheckbox').checked;
    const allergiesText = document.getElementById('FamHisallergiesText').value.trim();
    if (allergiesChecked && allergiesText !== '') {
      familyHistory.push('Allergies:' + allergiesText);
    } else if (allergiesChecked) {
      familyHistory.push('Allergies');
    }

    const otherChecked = document.getElementById('SpecifyFamHisCheckbox').checked;
    const otherText = document.getElementById('SpecifyFamHisText').value.trim();
    if (otherChecked && otherText !== '') {
      familyHistory.push('Others:' + otherText);
    } else if (otherChecked) {
      familyHistory.push('Others');
    }
    
    console.log("family_history:", familyHistory);

    familyHistory.forEach(item => {
      formData.append('family_history[]', item);
    });

    const emailInput = document.getElementById("email");
    if (emailInput) {
      emailInput.disabled = false; 
      formData.append("email", emailInput.value.trim());
      emailInput.disabled = true; 
    }

    // Log FormData to check
    for (let [key, value] of formData.entries()) {
      console.log(key + ': ' + value);
    }

    // Submit the form
    fetch("../php-admin/submit_patient.php", {
      method: "POST",
      body: formData
    })
    .then(response => response.text())
    .then(text => {
        console.log("Raw response text:", text);
        try {
            const data = JSON.parse(text);

            if (data.status === "success") {
                document.getElementById("SuccessPopup").style.display = "block";
            }
        } catch (e) {
            console.error("Invalid JSON response:", text);
            console.error("JSON parse error:", e);
            console.error("Response text causing error:", text);
        }
    })
    .catch(error => {
        console.error("Request failed", error);
    });
  }

  function bindFormSubmission() {
    const formElement = document.getElementById("medicalRecordForm");
    if (formElement) {
      formElement.addEventListener("submit", submitMedicalRecordForm);
    } else {
      console.error("Form element not found");
    }
  }
  
  bindFormSubmission();
  initializePopupFormLogic();











      

      
    
      
    