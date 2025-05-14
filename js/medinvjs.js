// Ensure popups are hidden as soon as the page loads
document.getElementById("popupContainer").style.display = "none";
document.getElementById("viewPopup").style.display = "none";

window.onload = function () {
  loadItemsFromLocalStorage();
};

let medicines = [];

// Load saved items from localStorage
function loadItemsFromLocalStorage() {
  // Instead of loading from localStorage, fetch from server
  fetch('../php/fetch_items.php')
    .then(response => response.json())
    .then(items => {
      // First try to get any existing items from localStorage to get their images
      const storedItems = localStorage.getItem('medicines');
      const storedItemsMap = {};
      
      if (storedItems) {
        JSON.parse(storedItems).forEach(item => {
          storedItemsMap[item.id] = item;
        });
      }

      medicines = items.map(item => ({
        id: item.Item_ID,
        name: item.Item_Name,
        type: item.Category,
        quantity: item.Quantity,
        description: item.Description || '',
        // Use the stored image if available, otherwise use default
        image: (storedItemsMap[item.Item_ID] && storedItemsMap[item.Item_ID].image) || '../pictures/default-item.png'
      }));
      
      // Clear the inventory before adding items
      const inventory = document.getElementById('inventory');
      inventory.innerHTML = '';
      
      medicines.forEach((medicine, index) => {
        addGridItem(medicine, index);
      });
      updateItemCount();
      saveItemsToLocalStorage(); // Save to localStorage for offline support
    })
    .catch(error => {
      console.error('Error loading items:', error);
      // Fallback to localStorage if server fetch fails
      const storedItems = localStorage.getItem('medicines');
      if (storedItems) {
        medicines = JSON.parse(storedItems);
        // Clear the inventory before adding items
        const inventory = document.getElementById('inventory');
        inventory.innerHTML = '';
        
        medicines.forEach((medicine, index) => {
          addGridItem(medicine, index);
        });
        updateItemCount();
      }
    });
}

function showPopup() {
  document.getElementById("popupContainer").style.display = "flex";
}

function closePopup() {
  document.getElementById("popupContainer").style.display = "none";
}

function closeViewPopup() {
  document.getElementById("viewPopup").style.display = "none";
}

function showLayoutBox() {
  const imageInput = document.getElementById('itemImage');
  const name = document.getElementById('itemName').value.trim();
  const type = document.getElementById('itemType').value.trim();
  const quantity = document.getElementById('itemStock').value.trim();
  const description = document.getElementById('itemDescription').value.trim();

  if (!imageInput.files[0] || !name || !quantity || !type) {
    document.getElementById('emptyFieldPopup').style.display = 'flex';
    return;
  }

  const formData = new FormData();
  formData.append('itemName', name);
  formData.append('category', type);
  formData.append('quantity', quantity);

  fetch('../php/add_item.php', {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .then(result => {
    if (result.status === 'success') {
      const reader = new FileReader();
      reader.onload = function (e) {
        const imageURL = e.target.result;

        const medicine = {
          id: result.id,
          image: imageURL,
          name: name,
          type: type,
          quantity: quantity,
          description: description
        };

        medicines.push(medicine);
        addGridItem(medicine, medicines.length - 1);
        updateItemCount();
        resetForm();
        closePopup();
        saveItemsToLocalStorage();
        // Show success popup
        document.getElementById('SuccessPopup').style.display = 'flex';
      };

      reader.readAsDataURL(imageInput.files[0]);
    } else {
      alert("Error saving to database: " + result.message);
    }
  })
  .catch(error => {
    console.error("Error:", error);
    alert("An error occurred while saving data.");
  });
}

function addGridItem(medicine, index) {
   const inventory = document.getElementById('inventory');
   const gridItem = document.createElement('div');
   gridItem.className = 'grid-item';
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
   inventory.appendChild(gridItem);
   inventory.style.display = 'grid';
}

function updateItemCount() {
  const countSpan = document.getElementById('box-count');
  countSpan.textContent = medicines.length;
}

function resetForm() {
  document.getElementById('itemImage').value = '';
  document.getElementById('itemName').value = '';
  document.getElementById('itemType').value = '';
  document.getElementById('itemStock').value = '';
  document.getElementById('itemDescription').value = '';
}

function viewItem(index) {
  const medicine = medicines[index];
  const viewPopup = document.getElementById('viewPopup');

  if (!medicine || !viewPopup) return;

  // Set the image source directly from the stored image URL
  document.getElementById('viewItemImage').src = medicine.image || '../pictures/default-item.png';
  document.getElementById('viewItemName').value = medicine.name;
  document.getElementById('viewItemType').value = medicine.type;
  document.getElementById('viewQuantityStock').value = medicine.quantity;
  document.getElementById('viewDescription').value = medicine.description;

  document.getElementById('viewItemName').readOnly = false;
  document.getElementById('viewItemType').disabled = false;
  document.getElementById('viewQuantityStock').readOnly = false;
  document.getElementById('viewDescription').readOnly = false;

  document.getElementById('saveChangesBtn').style.display = 'block';

  viewPopup.style.display = 'flex';

  document.getElementById('saveChangesBtn').onclick = function () {
    const updatedMedicine = {
      id: medicines[index].id,
      name: document.getElementById('viewItemName').value,
      category: document.getElementById('viewItemType').value,
      quantity: parseInt(document.getElementById('viewQuantityStock').value)
    };

    // Update backend first
    fetch('../php/update_item.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedMedicine)
    })
    .then(response => response.json())
    .then(result => {
      if (result.status === 'success') {
        // Only update frontend if backend update was successful
        // IMPORTANT: Preserve the original image URL
        medicines[index] = { 
          ...medicines[index],          // Keep all existing properties including image
          name: updatedMedicine.name,
          type: updatedMedicine.category,
          quantity: updatedMedicine.quantity,
          description: document.getElementById('viewDescription').value,
          image: medicines[index].image  // Explicitly preserve the image URL
        };
        updateGridItem(index, medicines[index]);
        saveItemsToLocalStorage();
        closeViewPopup();
      } else {
        alert("Failed to update database: " + result.message);
      }
    })
    .catch(error => {
      console.error("Update error:", error);
      alert("An error occurred while updating the item.");
    });
  };
}

function updateGridItem(index, medicine) {
  const inventory = document.getElementById('inventory');
  const gridItem = inventory.children[index];

  if (!gridItem) return;

  // Always use the stored image URL or fallback to default
  const imageUrl = medicine.image || '../pictures/default-item.png';

  gridItem.innerHTML = `
    <div class="item-image">
      <img src="${imageUrl}" alt="${medicine.name}" onerror="this.src='../pictures/default-item.png'">
    </div>
    <div class="item-name">${medicine.name}</div>
    <div class="item-qty">x${medicine.quantity}</div>
    <div class="item-buttons">
      <button class="view-button" onclick="viewItem(${index})">View</button>
      <button class="delete-button" onclick="deleteItem(${index})">Delete</button>
    </div>
  `;
}

function deleteItem(index) {
  const idToDelete = medicines[index].id; // Ensure the correct ID is passed from frontend

  // Remove from frontend
  medicines.splice(index, 1);
  document.getElementById('inventory').children[index].remove();
  updateItemCount();
  rebuildGridButtons();
  saveItemsToLocalStorage();

  // Remove from backend
  fetch('../php/delete_item.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ id: idToDelete })
  })
  .then(response => response.text())
  .then(result => {
    if (result.trim() !== 'success') {
      alert("Failed to delete from database: " + result);
    }
  });
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

// Save the items to localStorage
function saveItemsToLocalStorage() {
  localStorage.setItem('medicines', JSON.stringify(medicines));
}

// Placeholder functions
function filterTable() {
  alert("Filter function triggered.");
}

function sortTable() {
  alert("Sort function triggered.");
}

function searchTable() {
  alert("Search function triggered.");
}

// Add popup close functions
function closeSuccessPopup() {
  document.getElementById('SuccessPopup').style.display = 'none';
}

function closeEmptyFieldPopup() {
  document.getElementById('emptyFieldPopup').style.display = 'none';
}
