document.getElementById("timeInForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const form = e.target;
  const reason = form.reason.value;
  const otherReason = form.other_reason.value.trim();
  const idNumber = form.id_number.value.trim();

  // Validation: ID number must not be empty
  if (idNumber === "") {
    Swal.fire({
      icon: "warning",
      title: "Missing ID",
      text: "Please enter your Identification Number.",
    });
    return;
  }

  // Validation: Either a standard reason or a filled out other reason is required
  if (!reason || (reason === "Other Reason" && otherReason === "")) {
    Swal.fire({
      icon: "warning",
      title: "Missing Reason",
      text: "Please select a reason or fill out the 'Other Reason' field.",
    });
    return;
  }

  const final_reason = (reason === "Other Reason") ? otherReason : reason;

  const data = {
    id_number: idNumber,
    reason: final_reason
  };

  fetch("time_in.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(result => {
    if (result.status === "success") {
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Nakapag Timed In ka na",
      }).then(() => {
        window.location.href = "index.html";
      });
    } else if (result.message === "Student not found.") {
      Swal.fire({
        icon: "error",
        title: "ID Not Found",
        text: "Walang record ng ID Number na ito.",
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: result.message,
      });
    }
  })
  .catch(err => {
    Swal.fire({
      icon: "error",
      title: "Network Error",
      text: err.message,
    });
  });
});