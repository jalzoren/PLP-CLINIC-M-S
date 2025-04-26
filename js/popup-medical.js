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

function closePopup() {
  document.getElementById("popupContainer").style.display = "none";
  document.getElementById("popupPatient").style.display = "none";
  document.getElementById("popupPersonalHistory").style.display = "none";
}

function openPopupPatient() {
  document.getElementById('popupPatient').style.display = 'block';
}

function goBackToCategory() {
  document.getElementById("popupPatient").style.display = "none"; 
  document.getElementById("popupContainer").style.display = "block"; 
}

function goToPersonalHistoPopUp() {
  document.getElementById("popupPatient").style.display = "none"; 
  document.getElementById("popupPersonalHistory").style.display = "block"; 
}

window.onload = function() {
  document.getElementById("popupContainer").style.display = "block"; 
}