document.getElementById("timeInForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const form = e.target;
  const reason = form.reason.value;
  const final_reason = (reason === "Other Reason") ? form.other_reason.value.trim() : reason;

  const data = {
    id_number: form.id_number.value.trim(),
    reason: final_reason
  };

  fetch("time_in.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
  .then(response => response.text())
  .then(text => {
    console.log("Response from server:", text); // Debugging
    if (text.includes("successfully")) {
      window.location.href = "index.html";
    } else {
      document.getElementById("responseMessage").textContent = text;
    }
  })
  .catch(err => {
    console.error("Fetch error:", err); // Debugging
    document.getElementById("responseMessage").textContent = "⚠ Error: " + err.message;
  });
});
