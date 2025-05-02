
document.getElementById("timeInForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const form = e.target;
  const reason = form.reason.value;
  const final_reason = (reason === "Other Reason") ? form.other_reason.value : reason;

  const data = {
    id_number: form.id_number.value,
    department: form.department.value,
    category: form.category.value,
    reason: final_reason
  };

  fetch("time_in.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
  .then(response => response.text()) // <-- convert response to plain text
  .then(text => {
    if (text.includes("successfully")) {
      window.location.href = "dashboard.php";
    } else {
      document.getElementById("responseMessage").textContent = text;
    }
  })
  .catch(err => {
    document.getElementById("responseMessage").textContent = "⚠ Error: " + err.message;
  });
  
});

