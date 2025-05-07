
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

function openPopupPatient() {
  var studentCheckbox = document.getElementById('studentCheckbox').checked;
  var personnelCheckbox = document.getElementById('personnelCheckbox').checked;
  var collegeDepartment = document.getElementById('collegeDepartment').value.trim();
  var program = document.getElementById('collegeProgram').value.trim();
  var batch = document.getElementById('batch').value.trim();
  var teaching = document.getElementById('teaching').checked;
  var nonTeaching = document.getElementById('nonTeaching').checked;
  var departmentPersonnel = document.getElementById('departmentPersonnel').value.trim();
  var departmentSection = document.getElementById('departmentSection').value.trim();

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
    if (departmentPersonnel === "" || departmentSection === "") {
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
  document.getElementById("popupPatient").style.display = "none"; 
  document.getElementById("popupPersonalHistory").style.display = "block"; 
}

function goToFamilyHistoPopUp() {
  document.getElementById("popupPersonalHistory").style.display = "none"; 
  document.getElementById("popupFamilyHistory").style.display = "block"; 

}

window.onload = function() {
  document.getElementById("popupContainer").style.display = "block"; 
}

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
    flexWrapper4.style.display = 'none';
  }
});

sometimesDrugsCheckbox.addEventListener('change', function() {
  if (sometimesDrugsCheckbox.checked) {
    yesDrugsCheckbox.checked = false;
    noDrugsCheckbox.checked = false;
    preferNotDrugsCheckbox.checked = false;
    flexWrapper4.style.display = 'none'; 
  }
});

preferNotDrugsCheckbox.addEventListener('change', function() {
  if (preferNotDrugsCheckbox.checked) {
    yesDrugsCheckbox.checked = false;
    noDrugsCheckbox.checked = false;
    sometimesDrugsCheckbox.checked = false;
    flexWrapper4.style.display = 'none'; 
  }
});

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



  function submitMedicalRecordForm(e) {
    e.preventDefault(); // Prevent form's default submission

    const form = document.getElementById("medicalRecordForm");
    if (!form) {
      console.error("Form element not found!");
      return;
    }

    const formData = new FormData(this);

    // Get category
    if (document.getElementById("studentCheckbox").checked) {
      formData.append("user", "student");
      formData.append("collegeDepartment", document.getElementById("collegeDepartment").value);
      formData.append("collegeProgram", document.getElementById("collegeProgram").value);
      formData.append("batch", document.getElementById("batch").value);
    } else if (document.getElementById("personnelCheckbox").checked) {
      formData.append("user", "personnel");

      if (document.getElementById("teaching").checked) {
        formData.append("teaching", "1");
      }
      if (document.getElementById("nonTeaching").checked) {
        formData.append("nonTeaching", "1");
      }

      formData.append("departmentPersonnel", document.getElementById("departmentPersonnel").value);
      formData.append("departmentSection", document.getElementById("departmentSection").value);
    }

    // Patient's general data
    formData.append("firstname", document.getElementById("firstname").value);
    formData.append("middlename", document.getElementById("middlename").value);
    formData.append("lastname", document.getElementById("lastname").value);
    formData.append("gender", document.getElementById("gender").value);
    formData.append("age", document.getElementById("age").value);
    formData.append("birthdate", document.getElementById("birthdate").value);
    formData.append("civilstatus", document.getElementById("civilstatus").value);
    formData.append("religion", document.getElementById("religion").value);
    formData.append("nationality", document.getElementById("nationality").value);
    formData.append("contact", document.getElementById("contact").value);
    formData.append("address", document.getElementById("address").value);
    formData.append("city", document.getElementById("city").value);
    formData.append("province", document.getElementById("province").value);
    formData.append("zipcode", document.getElementById("zipcode").value);
    formData.append("emergencyLastname", document.getElementById("emergencyLastname").value);
    formData.append("emergencyFirstname", document.getElementById("emergencyFirstname").value);
    formData.append("emergencymiddlename", document.getElementById("emergencymiddlename").value);
    formData.append("relationship", document.getElementById("relationship").value);
    formData.append("emergencycontact", document.getElementById("emergencycontact").value);
    formData.append("emergencyaddress", document.getElementById("emergencyaddress").value);
    formData.append("emergencycity", document.getElementById("emergencycity").value);
    formData.append("emergencyprovince", document.getElementById("emergencyprovince").value);
    formData.append("emergencyzipcode", document.getElementById("emergencyzipcode").value);
    formData.append("identification", document.getElementById("identification").value);
    formData.append("numberOfPreg", document.getElementById("numberOfPreg").value);
    formData.append("numberOfMiscarriage", document.getElementById("numberOfMiscarriage").value);
    formData.append("numberOfTermdeliveries", document.getElementById("numberOfTermdeliveries").value);
    formData.append("numberOfPrematureDeliveries", document.getElementById("numberOfPrematureDeliveries").value);
    formData.append("totalnumberofChildren", document.getElementById("totalnumberofChildren").value);
    formData.append("oncePerWeekalcohol", document.getElementById("oncePerWeekalcohol").checked ? "1" : "");
    formData.append("moreThanonceperweekalcohol", document.getElementById("moreThanonceperweekalcohol").checked ? "1" : "");
    formData.append("totalperconsupAlchoText", document.getElementById("totalperconsupAlchoText").value.trim());
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

    

    // Log FormData to check
    for (let [key, value] of formData.entries()) {
      console.log(key + ': ' + value);
    }

  
    // Submit the form
    fetch("submit_patient.php", {
      method: "POST",
      body: formData
    })
    .then(response => response.text())  
    .then(text => {
        console.log("Raw response text:", text);
        try {
            const data = JSON.parse(text);
            console.log("Parsed JSON:", data);
        } catch (e) {
            console.error("Invalid JSON response:", text);
        }
    })
    .catch(error => {
        console.error("Request failed", error);
    });
    
  }

  document.addEventListener("DOMContentLoaded", function() {
    const formElement = document.getElementById("medicalRecordForm");
    if (formElement) {
      formElement.addEventListener("submit", submitMedicalRecordForm);
    } else {
      console.error("Form element not found on page load");
    }
  });





        




      

      
    
      
    
