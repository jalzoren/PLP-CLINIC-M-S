function updateDateTime() {
    const now = new Date();
  
    // Format time
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const timeString = `${hours} : ${minutes} : ${seconds}`;
  
    // Format date
    const weekdays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    const day = weekdays[now.getDay()];
    const date = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const dateString = `${day} ${date} / ${month} / ${year}`;
  
    // Update DOM
    const timeElement = document.getElementById('live-time');
    const dateElement = document.getElementById('live-date');
  
    if (timeElement && dateElement) {
      timeElement.textContent = timeString;
      dateElement.textContent = dateString;
    }
  }
  
  // Run once immediately and then every second
  updateDateTime();
  setInterval(updateDateTime, 1000);
  