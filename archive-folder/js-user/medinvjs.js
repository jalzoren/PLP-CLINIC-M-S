// Ensure popups are hidden as soon as the page loads
document.getElementById("popupContainer").style.display = "none";
document.getElementById("viewPopup").style.display = "none";

window.onload = function () {
  loadItemsWithFilters();
};

let medicines = [];

// Load saved items from localStorage
function loadItemsFromLocalStorage() {
  // Instead of loading from localStorage, fetch from server
  fetch('../php/fetch_items.php')
    .then(response => response.json())
    .then(items => {
      medicines = items.map(item => ({
        id: item.Item_ID,
        name: item.Item_Name,
        type: item.Category,
        quantity: item.Quantity,
        description: item.Description || ''
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
  const name = document.getElementById('itemName').value.trim();
  const type = document.getElementById('itemType').value.trim();
  const quantity = document.getElementById('itemStock').value.trim();
  const description = document.getElementById('itemDescription').value.trim();

  if (!name || !quantity || !type) {
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
      const medicine = {
        id: result.id,
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
      // Show SweetAlert success popup
      Swal.fire({
        icon: 'success',
        title: 'Suc  cess!',
        text: result.message || 'Item added successfully'
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: result.message || 'Error saving to database'
      });
    }
  })
  .catch(error => {
    console.error("Error:", error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'An error occurred while saving data.'
    });
  });
}

function addGridItem(medicine, index) {
  const inventory = document.getElementById('inventory');
  const gridItem = document.createElement('div');
  gridItem.className = 'grid-item';
  gridItem.setAttribute('data-id', medicine.id); // Store Item_ID in the DOM
  gridItem.innerHTML = `
    <div class="item-type">${medicine.type}</div>
    <div class="item-content">
      <div class="item-name">${medicine.name}</div>
      <div class="item-qty">x${medicine.quantity}</div>
    </div>
    <div class="item-buttons">
      <button class="view-button" onclick="viewItem(${medicine.id})">View</button>
      <button class="delete-button" onclick="deleteItem(${medicine.id})">Delete</button>
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
  document.getElementById('itemName').value = '';
  document.getElementById('itemType').value = '';
  document.getElementById('itemStock').value = '';
  document.getElementById('itemDescription').value = '';
}

function viewItem(id) {
  const medicine = medicines.find(item => item.id == id);
  const index = medicines.findIndex(item => item.id == id);
  const viewPopup = document.getElementById('viewPopup');

  if (!medicine || !viewPopup) return;

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
      id: medicine.id,
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
      .then(data => {
        if (data.status === 'success') {
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: data.message || 'Item updated successfully'
          });
          // Update frontend
          medicines[index] = {
            ...medicines[index],
            name: updatedMedicine.name,
            type: updatedMedicine.category,
            quantity: updatedMedicine.quantity,
            description: document.getElementById('viewDescription').value
          };
          updateGridItem(id, medicines[index]);
          saveItemsToLocalStorage();
          closeViewPopup();
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: data.message || 'Failed to update item'
          });
        }
      })
      .catch(error => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.toString()
        });
      });
  };
}

function updateGridItem(id, medicine) {
  const inventory = document.getElementById('inventory');
  const gridItem = Array.from(inventory.children).find(
    item => item.getAttribute('data-id') == id
  );

  if (!gridItem) return;

  gridItem.innerHTML = `
    <div class="item-type">${medicine.type}</div>
    <div class="item-content">
      <div class="item-name">${medicine.name}</div>
      <div class="item-qty">x${medicine.quantity}</div>
    </div>
    <div class="item-buttons">
      <button class="view-button" onclick="viewItem(${medicine.id})">View</button>
      <button class="delete-button" onclick="deleteItem(${medicine.id})">Delete</button>
    </div>
  `;
}

function deleteItem(id) {
  const index = medicines.findIndex(item => item.id == id);

  if (index === -1) return;

  // Remove from backend
  fetch('../php/delete_item.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ id: id })
  })
    .then(response => response.json())
    .then(result => {
      if (result.status === 'success') {
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: result.message || 'Item deleted successfully'
        });
        // Remove from frontend only after backend success
        medicines.splice(index, 1);
        const inventory = document.getElementById('inventory');
        const gridItem = Array.from(inventory.children).find(
          item => item.getAttribute('data-id') == id
        );
        if (gridItem) gridItem.remove();
        updateItemCount();
        saveItemsToLocalStorage();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: result.message || 'Failed to delete from database'
        });
      }
    })
    .catch(error => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.toString()
      });
    });
}

function rebuildGridButtons() {
  const inventory = document.getElementById('inventory');
  const gridItems = inventory.children;

  for (let i = 0; i < gridItems.length; i++) {
    const id = gridItems[i].getAttribute('data-id');
    const buttonsDiv = gridItems[i].querySelector('.item-buttons');
    if (buttonsDiv) {
      buttonsDiv.innerHTML = `
        <button class="view-button" onclick="viewItem(${id})">View</button>
        <button class="delete-button" onclick="deleteItem(${id})">Delete</button>
      `;
    }
  }
}

// Save the items to localStorage
function saveItemsToLocalStorage() {
  localStorage.setItem('medicines', JSON.stringify(medicines));
}

// Search functionality
function searchTable() {
  const searchInput = document.getElementById('searchInput').value;
  loadItemsWithFilters(searchInput, currentFilter);
}

// Filter functionality
let currentFilter = '';
function filterTable() {
  // Create and show the filter dropdown
  Swal.fire({
    title: 'Filter by Category',
    input: 'select',
    inputOptions: {
      '': 'All Categories',
      'Supplies': 'Supplies',
      'PPE': 'PPE',
      'Equipment': 'Equipment',
      'First Aid': 'First Aid'
    },
    inputValue: currentFilter,
    showCancelButton: true,
    inputValidator: (value) => {
      currentFilter = value;
      const searchInput = document.getElementById('searchInput').value;
      loadItemsWithFilters(searchInput, value);
    }
  });
}

// Load items with search and filter
function loadItemsWithFilters(search = '', category = '') {
  let url = '../php/fetch_items.php';
  const params = new URLSearchParams();
  
  if (search) params.append('search', search);
  if (category) params.append('category', category);
  
  if (params.toString()) {
    url += '?' + params.toString();
  }

  fetch(url)
    .then(response => response.json())
    .then(items => {
      medicines = items.map(item => ({
        id: item.Item_ID,
        name: item.Item_Name,
        type: item.Category,
        quantity: item.Quantity,
        description: item.Description || ''
      }));
      
      // Clear the inventory before adding items
      const inventory = document.getElementById('inventory');
      inventory.innerHTML = '';
      
      medicines.forEach((medicine, index) => {
        addGridItem(medicine, index);
      });
      updateItemCount();
    })
    .catch(error => {
      console.error('Error loading items:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load items. Please try again.'
      });
    });
}

// Add popup close functions
function closeSuccessPopup() {
  document.getElementById('SuccessPopup').style.display = 'none';
}

function closeEmptyFieldPopup() {
  document.getElementById('emptyFieldPopup').style.display = 'none';
}

// Add event listener for search input
document.getElementById('searchInput').addEventListener('input', function() {
  searchTable();
});
