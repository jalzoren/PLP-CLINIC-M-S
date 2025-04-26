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
  alert("Search function triggered.");
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
    document.getElementById('viewMedicineImage').src = medicine.image;
    document.getElementById('viewMedicineName').value = medicine.name;
    document.getElementById('viewMedicineType').value = medicine.type || 'N/A';
    document.getElementById('viewDosage').value = medicine.dosage || 'N/A';
    document.getElementById('viewRemarks').value = medicine.remarks || 'N/A';
    document.getElementById('viewQuantityStock').value = medicine.quantity;
    document.getElementById('viewDescription').value = medicine.description || 'N/A';

    document.getElementById('viewMedicineName').readOnly = false;
    document.getElementById('viewMedicineType').readOnly = false;
    document.getElementById('viewDosage').readOnly = false;
    document.getElementById('viewRemarks').readOnly = false;
    document.getElementById('viewQuantityStock').readOnly = false;
    document.getElementById('viewDescription').readOnly = false;
    
    document.getElementById('saveChangesBtn').style.display = 'block';
    
    viewPopup.style.display = 'flex';
    
    document.getElementById('saveChangesBtn').onclick = function() {
      medicine.name = document.getElementById('viewMedicineName').value;
      medicine.type = document.getElementById('viewMedicineType').value;
      medicine.dosage = document.getElementById('viewDosage').value;
      medicine.remarks = document.getElementById('viewRemarks').value;
      medicine.quantity = document.getElementById('viewQuantityStock').value;
      medicine.description = document.getElementById('viewDescription').value;
      
      updateGridItem(index, medicine);
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

// Update grid item when edited
function updateGridItem(index, medicine) {
  const inventory = document.getElementById('inventory');
  const gridItem = inventory.children[index];
  
  if (gridItem) {
    gridItem.innerHTML = `
      <div class="item-image">
        <img src="${medicine.image}" alt="${medicine.name}">
      </div>
      <div class="item-name">${medicine.name}</div>
      <div class="item-qty">x${medicine.quantity}</div>
      <div class="item-buttons">
        <button class="view-button" onclick="viewItem(${index})">View</button>
        <button class="delete-button" onclick="deleteItem(${index})">Delete</button>
      </div>
    `;
  }
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

    resetForm();

    closePopup();
  };

  reader.readAsDataURL(imageInput.files[0]);
}

function resetForm() {
  document.getElementById('medicineImage').value = '';
  document.getElementById('medicineName').value = '';
  document.getElementById('medicineType').value = '';
  document.getElementById('dosage').value = '';
  document.getElementById('remarks').value = '';
  document.getElementById('quantityStock').value = '';
  document.getElementById('description').value = '';
}

function deleteItem(index) {
  medicines.splice(index, 1);
  const inventory = document.getElementById('inventory');
  const gridItem = inventory.children[index];
  inventory.removeChild(gridItem);

  const countSpan = document.getElementById('box-count');
  const currentCount = parseInt(countSpan.textContent, 10);
  countSpan.textContent = currentCount - 1;

  rebuildGridButtons();
}

function rebuildGridButtons() {
  const inventory = document.getElementById('inventory');
  const gridItems = inventory.children;
  
  for (let i = 0; i < gridItems.length; i++) {
    const buttonsDiv = gridItems[i].querySelector('.item-buttons');
    if (buttonsDiv) {
      buttonsDiv.innerHTML = `
        <button class="view-button" onclick="viewItem(${i})">View</button>
        <button class="delete-button" onclick="deleteItem(${i})">Delete</button>
      `;
    }
  }
}

let btn = document.querySelector("#logo");
let sidebar = document.querySelector(".sidebar");

btn.onclick = function() {
  sidebar.classList.toggle("active");
}
