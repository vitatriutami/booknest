// Do your work here...
console.log("Hello, world!");

document.addEventListener("DOMContentLoaded", () => {
  flatpickr("#bookFormYear", {
    dateFormat: "Y", // Format hanya tahun
    plugins: [
      new flatpickr.plugins.yearSelectPlugin({
        start: 1900, // Tahun awal
        end: new Date().getFullYear(), // Tahun akhir (tahun ini)
      }),
    ],
  });
});
