// Ensure popups are hidden as soon as the page loads
document.getElementById("viewPopup").style.display = "none";

window.onload = function () {
  loadItemsFromLocalStorage();
};

let medicines = [];

// Load items from server
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
    })
    .catch(error => {
      console.error('Error loading items:', error);
    });
}

function closeViewPopup() {
  document.getElementById("viewPopup").style.display = "none";
}

function addGridItem(medicine, index) {
   const inventory = document.getElementById('inventory');
   const gridItem = document.createElement('div');
   gridItem.className = 'grid-item';
   gridItem.innerHTML = `
      <div class="item-type">${medicine.type}</div>
      <div class="item-content">
        <div class="item-name">${medicine.name}</div>
        <div class="item-qty">x${medicine.quantity}</div>
      </div>
      <div class="item-buttons">
         <button class="view-button" onclick="viewItem(${index})">View</button>
      </div>
   `;
   inventory.appendChild(gridItem);
   inventory.style.display = 'grid';
}

function updateItemCount() {
  const countSpan = document.getElementById('box-count');
  countSpan.textContent = medicines.length;
}

function viewItem(index) {
  const medicine = medicines[index];
  const viewPopup = document.getElementById('viewPopup');

  if (!medicine || !viewPopup) return;

  document.getElementById('viewItemName').value = medicine.name;
  document.getElementById('viewItemType').value = medicine.type;
  document.getElementById('viewQuantityStock').value = medicine.quantity;
  document.getElementById('viewDescription').value = medicine.description;

  // Ensure all fields are readonly
  document.getElementById('viewItemName').readOnly = true;
  document.getElementById('viewItemType').disabled = true;
  document.getElementById('viewQuantityStock').readOnly = true;
  document.getElementById('viewDescription').readOnly = true;

  viewPopup.style.display = 'flex';
}

// Search functionality
function searchTable() {
  const searchInput = document.getElementById('searchInput').value.toLowerCase();
  const inventory = document.getElementById('inventory');
  const items = inventory.getElementsByClassName('grid-item');

  Array.from(items).forEach(item => {
    const name = item.querySelector('.item-name').textContent.toLowerCase();
    if (name.includes(searchInput)) {
      item.style.display = '';
    } else {
      item.style.display = 'none';
    }
  });
}

// Filter functionality
function filterTable() {
  // Implement filtering logic here
  alert("Filter function will be implemented soon.");
}

// Sort functionality
function sortTable() {
  // Implement sorting logic here
  alert("Sort function will be implemented soon.");
} 