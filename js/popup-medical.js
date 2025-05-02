
const studentCheckbox = document.getElementById("studentCheckbox");
const personnelCheckbox = document.getElementById("personnelCheckbox");
const studentFields = document.getElementById("studentFields");
const personnelFields = document.getElementById("personnelFields");

studentCheckbox.addEventListener("change", () => {
  if (studentCheckbox.checked) {
    personnelCheckbox.checked = false;
    studentFields.style.display = "block";
    personnelFields.style.display = "none";
  } else {
    studentFields.style.display = "none";
  }
});

personnelCheckbox.addEventListener("change", () => {
  if (personnelCheckbox.checked) {
    studentCheckbox.checked = false;
    personnelFields.style.display = "block";
    studentFields.style.display = "none";
  } else {
    personnelFields.style.display = "none";
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
  var program = document.getElementById('program').value.trim();
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
    document.getElementById('totalperconsupAlchoText').value = '';
    document.getElementById('cigaretteStartedDate').value = '';
  }
});

[vapeCheckbox, pipeCheckbox].forEach(checkbox => {
  checkbox.addEventListener('change', function() {
    uncheckOthers(this);
    cigaretteSticksRow.style.display = 'none'; 
    cigaretteStartedRow.style.display = 'none';
    document.getElementById('totalperconsupAlchoText').value = ''; 
    document.getElementById('cigaretteStartedDate').value = ''; 
  });
});

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
const noDrugsCheckbox = document.getElementById('noDrugsCheckbox');
const sometimesDrugsCheckbox = document.getElementById('sometimesDrugsCheckbox');
const preferNotDrugsCheckbox = document.getElementById('preferNotDrugsCheckbox');
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

const yesCheckbox = document.getElementById('yesCheckbox');
const noCheckbox = document.getElementById('noCheckbox');
const sometimesCheckbox = document.getElementById('sometimesCheckbox');
const preferNotCheckbox = document.getElementById('preferNotCheckbox');
const flexWrapper3 = document.getElementById('flex-wrapper3');
const stoppedDate = document.getElementById('stoppedDate');

yesCheckbox.addEventListener('change', function() {
  if (yesCheckbox.checked) {
    noCheckbox.checked = false;
    sometimesCheckbox.checked = false;
    preferNotCheckbox.checked = false;
    flexWrapper3.style.display = 'block';
    stoppedDate.style.display = 'none';
  }
});

noCheckbox.addEventListener('change', function() {
  if (noCheckbox.checked) {
    yesCheckbox.checked = false;
    sometimesCheckbox.checked = false;
    preferNotCheckbox.checked = false;
    flexWrapper3.style.display = 'none';
    stoppedDate.style.display = 'none';
  }
});

sometimesCheckbox.addEventListener('change', function() {
  if (sometimesCheckbox.checked) {
    yesCheckbox.checked = false;
    noCheckbox.checked = false;
    preferNotCheckbox.checked = false;
    flexWrapper3.style.display = 'none'; 
    stoppedDate.style.display = 'none';
  }
});

preferNotCheckbox.addEventListener('change', function() {
  if (preferNotCheckbox.checked) {
    yesCheckbox.checked = false;
    noCheckbox.checked = false;
    sometimesCheckbox.checked = false;
    flexWrapper3.style.display = 'none'; 
    stoppedDate.style.display = 'inline-block';
  } else {
    stoppedDate.style.display = 'none';
  }
});




function submitMedicalRecordForm() {
  const formData = new FormData();

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
  formData.append("maintenanceMedications", maintenance);

  // Submit the form
  fetch("popup-medicalrec.php", {
    method: "POST",
    body: formData
  })
    .then(response => response.json())
    .then(result => {
      if (result.status === "success") {
        alert("Form submitted successfully!");
        const form = document.getElementById("medicalRecordForm");
        if (form) form.reset();
      } else {
        alert("Error: " + result.message);
      }
    })
    .catch(error => {
      console.error("Fetch error:", error);
      alert("An unexpected error occurred.");
    });
}











      




    

    
  
    
  
