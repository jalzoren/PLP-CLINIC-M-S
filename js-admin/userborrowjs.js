   const modal = document.getElementById("cameraModal");
      const modalContent = document.querySelector(".modal-content");
      const modalHeader = document.getElementById("modalHeader");
      const openBtn = document.getElementById("openCamera");
      const closeBtn = document.getElementById("closeModal");
      const video = document.getElementById("video");
      const takePhotoBtn = document.getElementById("takePhoto");
      const capturedImageDiv = document.getElementById("capturedImage");

      let stream;

      openBtn.addEventListener("click", async () => {
        modal.style.display = "block";
        try {
          stream = await navigator.mediaDevices.getUserMedia({ video: true });
          video.srcObject = stream;
        } catch (err) {
          alert("Camera not available.");
        }
      });

      closeBtn.addEventListener("click", () => {
        modal.style.display = "none";
        if (stream) {
          stream.getTracks().forEach((track) => track.stop());
        }
      });

      takePhotoBtn.addEventListener("click", () => {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL("image/png");

        capturedImageDiv.innerHTML = `<img src="${imageData}" alt="Captured Photo" style="width: 100%; height: 100%; object-fit: cover;" />`;
        document.getElementById("photo_borrowed").value = imageData;

        modal.style.display = "none";
        if (stream) {
          stream.getTracks().forEach((track) => track.stop());
        }
      });

      function makeDraggable(modalEl, handleEl) {
        let isDragging = false;
        let offsetX = 0;
        let offsetY = 0;

        handleEl.addEventListener("mousedown", (e) => {
          isDragging = true;
          offsetX = e.clientX - modalEl.offsetLeft;
          offsetY = e.clientY - modalEl.offsetTop;
          document.body.style.userSelect = "none";
        });

        document.addEventListener("mousemove", (e) => {
          if (isDragging) {
            modalEl.style.left = `${e.clientX - offsetX}px`;
            modalEl.style.top = `${e.clientY - offsetY}px`;
          }
        });

        document.addEventListener("mouseup", () => {
          isDragging = false;
          document.body.style.userSelect = "";
        });
      }

      makeDraggable(modalContent, modalHeader);
     

 
  const rowsPerPage = 5;
  let currentPage = 1;
  let itemsData = [];

  function renderTablePage(page) {
    const tableBody = document.getElementById("itemTableBody");
    tableBody.innerHTML = "";

    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const pageItems = itemsData.slice(start, end);

    if (pageItems.length === 0) {
      tableBody.innerHTML = "<tr><td colspan='5'>No items found.</td></tr>";
      return;
    }

    pageItems.forEach((item, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${start + index + 1}</td>
        <td>${item.Item_Name}</td>
        <td>${item.Category}</td>
        <td>${item.Status}</td>
        <td>${item.Quantity}</td>
      `;
      tableBody.appendChild(row);
    });
  }

  function updatePaginationButtons() {
    const paginationDiv = document.querySelector(".pagination");
    paginationDiv.innerHTML = "";

    const totalPages = Math.ceil(itemsData.length / rowsPerPage);

    const prevButton = `<button class="page-btn" onclick="goToPage('prev')">&laquo;</button>`;
    const nextButton = `<button class="page-btn" onclick="goToPage('next')">&raquo;</button>`;

    paginationDiv.innerHTML += prevButton;

    for (let i = 1; i <= totalPages; i++) {
      paginationDiv.innerHTML += `<button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
    }

    paginationDiv.innerHTML += nextButton;
  }

  function goToPage(page) {
    const totalPages = Math.ceil(itemsData.length / rowsPerPage);

    if (page === 'prev' && currentPage > 1) currentPage--;
    else if (page === 'next' && currentPage < totalPages) currentPage++;
    else if (typeof page === 'number') currentPage = page;

    renderTablePage(currentPage);
    updatePaginationButtons();
  }

  window.addEventListener("DOMContentLoaded", () => {
    fetch('../php-admin/fetch_items.php')
      .then(response => response.json())
      .then(data => {
        itemsData = data;
        currentPage = 1;
        renderTablePage(currentPage);
        updatePaginationButtons();
      })
      .catch(error => {
        console.error("Error fetching items:", error);
      });
  });
 
  



 
  document.addEventListener("DOMContentLoaded", () => {
    fetch("../php-admin/fetch_items.php")
      .then(response => response.json())
      .then(data => {
        const select = document.getElementById("item_id");
        data.forEach(item => {
          const option = document.createElement("option");
          option.value = item.Item_ID;
          option.textContent = item.Item_Name;
          select.appendChild(option);
        });
      })
      .catch(error => {
        console.error("Failed to load items for dropdown:", error);
      });
  });
 

 
  // Dynamically load available items for the right panel
  function loadAvailableItems() {
    fetch('../php-admin/fetch_items.php')
      .then(response => response.json())
      .then(data => {
        const list = document.getElementById('availableItemsList');
        list.innerHTML = '';
        data.forEach(item => {
          const statusClass = item.Status === 'Available' ? 'status-available' : 'status-unavailable';
          const statusText = item.Status === 'Available' ? 'AVAILABLE' : 'NOT AVAILABLE';
          const row = document.createElement('div');
          row.className = 'available-item-row';
          row.innerHTML = `
            <span class="status-indicator ${statusClass}">${statusText}</span>
            <span>${item.Item_Name} (${item.Quantity})</span>
          `;
          list.appendChild(row);
        });
      })
      .catch(error => {
        document.getElementById('availableItemsList').innerHTML = '<div style="color:red">Failed to load items.</div>';
      });
  }
  // Call on load
  window.addEventListener('DOMContentLoaded', loadAvailableItems);

// Dynamically load borrowed items for the table
function loadBorrowedItems() {
  fetch('../php-admin/borrowing_records.php')
    .then(response => response.json())
    .then(data => {
      const tbody = document.getElementById('borrowedTableBody');
      tbody.innerHTML = '';
      // Only show items that are currently borrowed
      const borrowedOnly = data.filter(item => item.Status === 'Borrowed');
      if (!borrowedOnly.length) {
        tbody.innerHTML = '<tr><td colspan="10">No borrowed items found.</td></tr>';
        return;
      }
      borrowedOnly.forEach((item, idx) => {
        const photo = item.Photo_Borrowed ? `<img src="${item.Photo_Borrowed}" alt="Photo" style="width:40px;height:40px;border-radius:6px;object-fit:cover;">` : '';
        tbody.innerHTML += `
          <tr data-patient-id="${item.Patient_ID || ''}" data-item-id="${item.Item_ID || ''}" data-id-number="${item.ID_Number || ''}">
            <td>${idx + 1}</td>
            <td>${item.ID_Number || ''}</td>
            <td>${item.FullName || ''}</td>
            <td>${item.Category || ''}</td>
            <td>${item.DepartmentInfo || ''}</td>
            <td>${formatDateAsia(item.Date_Borrowed)}</td>
            <td>${item.Item_Name || ''}</td>
            <td>${item.Quantity || ''}</td>
            <td>${photo}</td>
            <td><button class="return-btn" ${item.Status !== 'Borrowed' ? 'disabled' : ''}>${item.Status !== 'Borrowed' ? 'Returned' : 'RETURN'}</button></td>
          </tr>
        `;
      });
      reloadReturnListeners();
    })
    .catch(error => {
      document.getElementById('borrowedTableBody').innerHTML = '<tr><td colspan="10" style="color:red">Failed to load borrowed items.</td></tr>';
    });
}
  // Call on load
  window.addEventListener('DOMContentLoaded', loadBorrowedItems);
 

 
// --- Modal and Camera Logic for Return ---
let currentReturnItemId = null;
let currentReturnUserName = '';
let capturedPhotoData = '';
let currentReturnPatientId = '';

function openReturnModal(itemId, userName, patientId) {
  currentReturnItemId = itemId;
  currentReturnUserName = userName;
  currentReturnPatientId = patientId;
  document.getElementById('modalUserName').textContent = userName;
  document.getElementById('modalItemStatus').selectedIndex = 0;
  document.getElementById('submitReturnBtn').disabled = true;
  document.getElementById('capturePhotoBtn').disabled = false;
  document.getElementById('captureCanvas').style.display = 'none';
  document.getElementById('cameraPreview').style.display = 'block';
  document.getElementById('returnModal').style.display = 'flex';
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(s => {
      stream = s;
      document.getElementById('cameraPreview').srcObject = stream;
    });
}

function closeReturnModal() {
  document.getElementById('returnModal').style.display = 'none';
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
    stream = null;
  }
}

document.getElementById('closeModalBtn').onclick = closeReturnModal;
document.getElementById('cancelReturnBtn').onclick = closeReturnModal;

document.getElementById('capturePhotoBtn').onclick = function() {
  const video = document.getElementById('cameraPreview');
  const canvas = document.getElementById('captureCanvas');
  canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
  capturedPhotoData = canvas.toDataURL('image/png');
  canvas.style.display = 'block';
  video.style.display = 'none';
  document.getElementById('submitReturnBtn').disabled = false;
  this.disabled = true;
};

function submitReturnBtn() {
  const status = document.getElementById('modalItemStatus').value;
  const formData = new FormData();
  formData.append('item_id', currentReturnItemId);
  formData.append('item_status', status);
  formData.append('photo_returned', capturedPhotoData || '');
  formData.append('patient_id', currentReturnPatientId);

  fetch('../php-admin/return_item. php-admin', {
    method: 'POST',
    body: formData
  })
  .then(res => res.json())
  .then(response => {
    if (response.success) {
      closeReturnModal();
      window.location.reload();
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: response.error || 'Unknown error'
      });
    }
  })
  .catch(err => {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Network or server error: ' + err.message
    });
  });
}

function attachReturnBtnListeners() {
  document.querySelectorAll('.return-btn').forEach(btn => {
    btn.onclick = async function() {
      const row = btn.closest('tr');
      const idNumber = row ? row.children[1].textContent.trim() : '';
      const itemId = row ? row.getAttribute('data-item-id') : '';
      const userName = row ? row.children[2].textContent : '';
      console.log('Return button clicked:', { idNumber, itemId, userName }); // Debug log

      if (!idNumber || !itemId) {
        Swal.fire({
          icon: 'warning',
          title: 'Missing Field',
          text: 'Error: Missing Identification Number or Item ID.'
        });
        return;
      }

      try {
        const response = await fetch(`../php-user/get_patient_id.php?id_number=${encodeURIComponent(idNumber)}`);
        const data = await response.json();
        console.log('get_patient_id.php response:', data); // Debug log
        if (data.success && data.patient_id) {
          const patientId = data.patient_id;
          openReturnModal(itemId, userName, patientId);
        } else {
          Swal.fire({
            icon: 'warning',
            title: 'No User Found',
            text: 'No user found with Identification Number: ' + idNumber
          });
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error fetching user data: ' + error.message
        });
      }
    };
  });
}

function openReturnModal(itemId, userName, patientId) {
  currentReturnItemId = itemId;
  currentReturnUserName = userName;
  currentReturnPatientId = patientId;
  console.log('Modal opened with:', { itemId, userName, patientId }); // Debug log
  document.getElementById('modalUserName').textContent = userName;
  document.getElementById('modalItemStatus').selectedIndex = 0;
  document.getElementById('submitReturnBtn').disabled = true;
  document.getElementById('capturePhotoBtn').disabled = false;
  document.getElementById('captureCanvas').style.display = 'none';
  document.getElementById('cameraPreview').style.display = 'block';
  document.getElementById('returnModal').style.display = 'flex';
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(s => {
      stream = s;
      document.getElementById('cameraPreview').srcObject = stream;
    })
    .catch(err => {
      console.error('Camera error:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Camera not available: ' + err.message
      });
      closeReturnModal();
    });
}

// Call after table is loaded
window.addEventListener('DOMContentLoaded', () => {
  setTimeout(attachReturnBtnListeners, 1000);
});
// Also call after each table reload
function reloadReturnListeners() {
  setTimeout(attachReturnBtnListeners, 500);
}
// Patch into loadBorrowedItems
const origLoadBorrowedItems = loadBorrowedItems;
window.loadBorrowedItems = function() {
  origLoadBorrowedItems();
  reloadReturnListeners();
};
 

 
document.getElementById('borrowForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  // Validation
  const idNumber = document.getElementById('user_id').value.trim();
  const quantity = document.getElementById('quantity').value.trim();
  const itemId = document.getElementById('item_id').value;
  const dueDate = document.getElementById('due_date').value;
  const capturedImage = document.getElementById('capturedImage');

  if (!idNumber) {
    Swal.fire({
      icon: 'warning',
      title: 'Missing Field',
      text: 'Please enter an ID Number.'
    });
    return;
  }
  if (!quantity || quantity < 1) {
    Swal.fire({
      icon: 'warning',
      title: 'Missing Field',
      text: 'Please enter a valid quantity.'
    });
    return;
  }
  if (!itemId) {
    Swal.fire({
      icon: 'warning',
      title: 'Missing Field',
      text: 'Please select an item.'
    });
    return;
  }
  if (!dueDate) {
    Swal.fire({
      icon: 'warning',
      title: 'Missing Field',
      text: 'Please select a due date.'
    });
    return;
  }
  // Validation: require photo
  if (!capturedImage.querySelector('img')) {
    Swal.fire({
      icon: 'warning',
      title: 'Missing Photo',
      text: 'Please capture a photo before submitting the borrow.'
    });
    return;
  }

  try {
    // Patient ID lookup
    const patientResponse = await fetch('../php-user/get_patient_id.php?id_number=' + encodeURIComponent(idNumber));
    const patientData = await patientResponse.json();

    if (!patientData.success || !patientData.patient_id) {
      Swal.fire({
        icon: 'warning',
        title: 'No User Found',
        text: 'No user found with that ID Number.'
      });
      return;
    }

    // Prepare form data
    const formData = new FormData(this);
    formData.set('patient_id', patientData.patient_id);

    // Add photo if available
    if (capturedImage.querySelector('img')) {
      const imgData = capturedImage.querySelector('img').src;
      formData.set('photo_borrowed', imgData);
    }

    // Submit via AJAX
    const submitResponse = await fetch('../php-admin/submit_borrow.php', {
      method: 'POST',
      body: formData
    });

    const result = await submitResponse.text();

    if (result.includes('Error')) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: result
      });
    } else {
      // Success
      this.reset();
      document.getElementById('capturedImage').innerHTML = '';
      loadBorrowedItems();
      loadAvailableItems();
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Item borrowed successfully!'
      });
    }
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'An error occurred while submitting the form.'
    });
  }
});
 

document.getElementById('returnForm').onsubmit = function(e) {
  e.preventDefault();
  submitReturnBtn();
};

function formatDateAsia(dateString) {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleString('en-PH', {
    timeZone: 'Asia/Manila',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
}