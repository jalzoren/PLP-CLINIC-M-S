function viewDetails(id) {
  alert("Viewing details for ID: " + id);
}

function filterTable() {
  alert("Filter function triggered.");
}

function sortTable() {
  alert("Sort function triggered.");
}

function addRow() {
  alert("Add function triggered.");
}

function searchTable() {
  alert("Add function triggered.");
}

function showPopup() {
  document.getElementById("popupContainer").style.display = "flex";
}

function closePopup() {
  document.getElementById("popupContainer").style.display = "none";
}

window.onload = function() {
  document.getElementById("popupContainer").style.display = "none";
}

let medicines = [];

function viewItem(index) {
  const medicine = medicines[index];
  const viewPopup = document.getElementById('viewPopup');
  
  if (viewPopup) {
    // Fill the fields with current medicine data
    document.getElementById('viewMedicineImage').src = medicine.image;
    document.getElementById('viewMedicineName').value = medicine.name;
    document.getElementById('viewMedicineType').value = medicine.type || 'N/A';
    document.getElementById('viewDosage').value = medicine.dosage || 'N/A';
    document.getElementById('viewRemarks').value = medicine.remarks || 'N/A';
    document.getElementById('viewQuantityStock').value = medicine.quantity;
    document.getElementById('viewDescription').value = medicine.description || 'N/A';

    // editable
    document.getElementById('viewMedicineName').readOnly = false;
    document.getElementById('viewMedicineType').readOnly = false;
    document.getElementById('viewDosage').readOnly = false;
    document.getElementById('viewRemarks').readOnly = false;
    document.getElementById('viewQuantityStock').readOnly = false;
    document.getElementById('viewDescription').readOnly = false;
    
    // save button
    document.getElementById('saveChangesBtn').style.display = 'block';
    
    //  popup
    viewPopup.style.display = 'flex';
    
    
    document.getElementById('saveChangesBtn').onclick = function() {
      // Save changes to the medicine data
      medicine.name = document.getElementById('viewMedicineName').value;
      medicine.type = document.getElementById('viewMedicineType').value;
      medicine.dosage = document.getElementById('viewDosage').value;
      medicine.remarks = document.getElementById('viewRemarks').value;
      medicine.quantity = document.getElementById('viewQuantityStock').value;
      medicine.description = document.getElementById('viewDescription').value;
      
     
      closeViewPopup();
    };
  }
}

function closeViewPopup() {
  const viewPopup = document.getElementById('viewPopup');
  if (viewPopup) {
    viewPopup.style.display = 'none';
  }
}

function closeViewPopup() {
  const viewPopup = document.getElementById('viewPopup');
  if (viewPopup) {
    viewPopup.style.display = 'none';
  }
}

function closePopup() {
  document.getElementById("popupContainer").style.display = "none";
}

function showLayoutBox() {
  const imageInput = document.getElementById('medicineImage');
  const name = document.getElementById('medicineName').value;
  const quantity = document.getElementById('quantityStock').value;

  if (!imageInput.files[0] || !name || !quantity) {
    alert("Please fill out all required fields.");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    const imageURL = e.target.result;
    const medicine = {
      image: imageURL,
      name: name,
      type: document.getElementById('medicineType').value,
      dosage: document.getElementById('dosage').value,
      remarks: document.getElementById('remarks').value,
      quantity: quantity,
      description: document.getElementById('description').value
    };

    medicines.push(medicine);

    const gridItem = document.createElement('div');
    gridItem.className = 'grid-item';
    gridItem.innerHTML = `
    <div class="item-image">
      <img src="${imageURL}" alt="${name}">
    </div>
    <div class="item-name">${name}</div>
    <div class="item-qty">x${quantity}</div>
    <div class="item-buttons">
      <button class="view-button" onclick="viewItem(${medicines.length - 1})">View</button>
      <button class="delete-button" onclick="deleteItem(${medicines.length - 1})">Delete</button>
    </div>
  `;
  

    const inventory = document.getElementById('inventory');
    inventory.appendChild(gridItem);
    inventory.style.display = 'grid';

    const countSpan = document.getElementById('box-count');
    const currentCount = parseInt(countSpan.textContent, 10);
    countSpan.textContent = currentCount + 1;

    // Clear the form after adding the medicine
    resetForm();

    closePopup();
  };

  reader.readAsDataURL(imageInput.files[0]);
}

function resetForm() {
  // Clear the form fields
  document.getElementById('medicineImage').value = ''; // Clear the file input
  document.getElementById('medicineName').value = ''; // Clear the medicine name
  document.getElementById('medicineType').value = ''; // Clear the medicine type
  document.getElementById('dosage').value = ''; // Clear the dosage
  document.getElementById('remarks').value = ''; // Clear remarks
  document.getElementById('quantityStock').value = ''; // Clear quantity
  document.getElementById('description').value = ''; // Clear description
}

function deleteItem(index) {
  medicines.splice(index, 1);
  const inventory = document.getElementById('inventory');
  const gridItem = inventory.children[index];
  inventory.removeChild(gridItem);

  const countSpan = document.getElementById('box-count');
  const currentCount = parseInt(countSpan.textContent, 10);
  countSpan.textContent = currentCount - 1;
}

let btn = document.querySelector("#logo");
let sidebar = document.querySelector(".sidebar");

btn.onclick = function() {
  sidebar.classList.toggle("active");
}
