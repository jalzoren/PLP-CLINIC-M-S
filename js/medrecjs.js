
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

function showPopup() {
  document.getElementById("popupContainer").style.display = "flex";
}

function closePopup() {
  document.getElementById("popupContainer").style.display = "none";
  document.getElementById("popupPatient").style.display = "none";
}

function openPopupPatient() {
  document.getElementById('popupPatient').style.display = 'block';
}


window.onload = function() {
    document.getElementById("popupContainer").style.display = "none"; 
  }




      




    

    
  
    
    
 

  
    let btn = document.querySelector("#logo");
    let sidebar = document.querySelector(".sidebar");

    btn.onclick = function () {
      sidebar.classList.toggle("active");
    };