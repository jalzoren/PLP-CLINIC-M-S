function updateTime() {
  const now = new Date();

  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
  const timeString = `${hours}:${minutes}:${seconds}`;

  const day = now.getDate().toString().padStart(2, '0');
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const year = now.getFullYear();
  const dateString = `${month}/${day}/${year}`;

  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const weekday = weekdays[now.getDay()];

  const dateElem = document.getElementById('date');
  const clockElem = document.getElementById('clock');
  const weekdayElem = document.getElementById('weekday');
  const timeElem = document.getElementById('time');
  const timeTextElem = document.getElementById('time-text');

  if (dateElem) dateElem.innerHTML = `<strong>Date:</strong> ${dateString}`;
  if (clockElem) clockElem.innerHTML = `<strong>Time:</strong> ${timeString}`;
  if (weekdayElem) weekdayElem.innerHTML = `<strong>Day:</strong> ${weekday}`;
  if (timeElem) timeElem.innerHTML = `<strong>Today is:</strong> ${weekday} ${timeString}`;
  if (timeTextElem) timeTextElem.innerText = `Current Date: ${dateString} | Current Time: ${timeString}`;
}

document.addEventListener("DOMContentLoaded", () => {
  updateTime();
  setInterval(updateTime, 1000);
});
