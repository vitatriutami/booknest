// Do your work here...
console.log("Hello, world!");

document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("bookFormYear");
  const yearDropdown = document.createElement("select");
  yearDropdown.className = input.className;

  const currentYear = new Date().getFullYear();
  for (let year = 1900; year <= currentYear; year++) {
    const option = document.createElement("option");
    option.value = year;
    option.textContent = year;
    yearDropdown.appendChild(option);
  }

  input.replaceWith(yearDropdown);
});

