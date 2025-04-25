



      
    
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
  
  // Function to show the layout box and append a new medicine to the inventory
  function showLayoutBox() {
    const imageInput = document.getElementById("medicineImage");
    const name = document.getElementById("medicineName").value.trim();
    const quantity = document.getElementById("quantityStock").value.trim();
  
    // Check if required fields are filled
    if (!imageInput.files[0] || !name || !quantity) {
      alert("Please fill in all required fields.");
      return;
    }
  
    // Create an image URL from the selected file
    const imageURL = URL.createObjectURL(imageInput.files[0]);
  
    // Create a new medicine box with the image, name, and quantity
    const medicineBox = document.createElement("div");
    medicineBox.classList.add("medicine-box");
  
    // Set the content of the medicine box
    medicineBox.innerHTML = `
      <div class="med-container">
        <img src="${imageURL}" alt="${name}" class="med-img" />
        <div class="med-name">${name}</div>
        <div class="med-quantity">Stock: ${quantity}</div>
      </div>
    `;
  
    const inventory = document.getElementById("inventory");
    inventory.appendChild(medicineBox);
  
    document.getElementById("popupContainer").style.display = "none";
  
    document.getElementById("medicineImage").value = "";
    document.getElementById("medicineName").value = "";
    document.getElementById("quantityStock").value = "";
  }
  
  function closePopup() {
    document.getElementById("popupContainer").style.display = "none";
  }
  
  function showPopup() {
    document.getElementById("popupContainer").style.display = "block";
  }
  
  
        
      
        
        
     
  
     
      
  
          let btn = document.querySelector("#logo");
          let sidebar = document.querySelector(".sidebar");
      
          btn.onclick = function() {
              sidebar.classList.toggle("active");
          }
  