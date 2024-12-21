const STORAGE_KEY = "BOOKSHELF_APPS";
let books = [];

// Fungsi untuk mengecek dukungan localStorage
function isStorageAvailable() {
  return typeof Storage !== "undefined";
}

// Fungsi untuk menyimpan data ke localStorage
function saveData() {
  if (isStorageAvailable()) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
  } else {
    alert("Browser Anda tidak mendukung local storage.");
  }
}

// Fungsi untuk memuat data dari localStorage
function loadData() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  if (serializedData) {
    books = JSON.parse(serializedData);
  }
}

// Fungsi untuk membuat elemen buku
function createBookElement(book) {
  const { id, title, author, year, isCompleted } = book;

  // Title element
  const titleElement = document.createElement("h3");
  titleElement.textContent = title;
  titleElement.classList.add("font-semibold");
  titleElement.setAttribute("data-testid", "bookItemTitle");

  // Author element
  const authorElement = document.createElement("p");
  authorElement.textContent = `Penulis: ${author}`;
  authorElement.setAttribute("data-testid", "bookItemAuthor");

  // Year element
  const yearElement = document.createElement("p");
  yearElement.textContent = `Tahun: ${year}`;
  yearElement.setAttribute("data-testid", "bookItemYear");

  // Container
  const container = document.createElement("div");
  container.classList.add(
    "book-item",
    "bg-slate-200",
    "rounded-lg",
    "p-2",
    "flex",
    "flex-col",
    "gap-1"
  );
  container.append(titleElement, authorElement, yearElement);
  container.setAttribute("data-testid", "bookItem");
  container.setAttribute("data-bookid", id);

  // Button container
  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("actions", "flex", "gap-2");

  // Delete button
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Hapus";
  deleteButton.classList.add(
    "px-2",
    "bg-red-500",
    "text-white",
    "rounded-2xl",
    "hover:text-black"
  );
  deleteButton.setAttribute("data-testid", "bookItemDeleteButton");
  deleteButton.addEventListener("click", () => {
    removeBook(id);
  });

  buttonContainer.append(deleteButton);

  // Completed/Uncompleted button
  if (!isCompleted) {
    const markCompleteButton = document.createElement("button");
    markCompleteButton.textContent = "Selesai";
    markCompleteButton.classList.add(
      "px-2",
      "bg-emerald-500",
      "text-white",
      "rounded-2xl",
      "hover:text-black"
    );
    markCompleteButton.setAttribute("data-testid", "bookItemIsCompleteButton");
    markCompleteButton.addEventListener("click", () => {
      markBookAsCompleted(id);
    });
    buttonContainer.append(markCompleteButton);
  } else {
    const markUncompleteButton = document.createElement("button");
    markUncompleteButton.textContent = "Belum Selesai";
    markUncompleteButton.classList.add(
      "px-2",
      "bg-slate-500",
      "text-white",
      "rounded-2xl",
      "hover:text-rose-300"
    );
    markUncompleteButton.setAttribute(
      "data-testid",
      "bookItemIsCompleteButton"
    );
    markUncompleteButton.addEventListener("click", () => {
      markBookAsUncompleted(id);
    });
    buttonContainer.append(markUncompleteButton);
  }

  container.append(buttonContainer);
  return container;
}


// Fungsi untuk menampilkan buku
function renderBooks() {
  const uncompletedBookList = document.getElementById("incompleteBookList");
  const completedBookList = document.getElementById("completeBookList");

  uncompletedBookList.innerHTML = "";
  completedBookList.innerHTML = "";

  for (const book of books) {
    const bookElement = createBookElement(book);
    if (book.isCompleted) {
      completedBookList.append(bookElement);
    } else {
      uncompletedBookList.append(bookElement);
    }
  }
}   
// Fungsi untuk menambahkan buku baru
function addBook(event) {
  event.preventDefault();

  const title = document.getElementById("bookFormTitle").value;
  const author = document.getElementById("bookFormAuthor").value;
  const year = document.getElementById("bookFormYear").value;
  const isCompleted = document.getElementById("bookFormIsComplete").checked;
  const id = +new Date();

  const newBook = {
    id,
    title,
    author,
    year,
    isCompleted,
  };

  books.push(newBook);
  saveData();
  renderBooks();

  // Reset form
  document.getElementById("bookForm").reset();

  // Reset text tombol submit
  const submitButton = document.getElementById("bookFormSubmit");
  submitButton.innerHTML = `Masukkan buku ke rak <span class="text-rose-200">Belum selesai dibaca</span>`;
}

// Event listener untuk tombol submit
document.getElementById("bookForm").addEventListener("submit", addBook);

// Event listener untuk checkbox selesai dibaca
document
  .getElementById("bookFormIsComplete")
  .addEventListener("change", (event) => {
    const isCompleted = event.target.checked;
    const submitButton = document.getElementById("bookFormSubmit");

    if (isCompleted) {
      submitButton.innerHTML = `Masukkan buku ke rak <span>Selesai dibaca</span>`;
    } else {
      submitButton.innerHTML = `Masukkan buku ke rak <span>Belum selesai dibaca</span>`;
    }
  });

// Fungsi untuk menghapus buku
function removeBook(id) {
  books = books.filter((book) => book.id !== id);
  saveData();
  renderBooks();
}

// Fungsi untuk menandai buku selesai
function markBookAsCompleted(id) {
  const book = books.find((book) => book.id === id);
  if (book) {
    book.isCompleted = true;
    saveData();
    renderBooks();
  }
}

// Fungsi untuk mengembalikan buku ke status belum selesai
function markBookAsUncompleted(id) {
  const book = books.find((book) => book.id === id);
  if (book) {
    book.isCompleted = false;
    saveData();
    renderBooks();
  }
}

// Event Listener
document.addEventListener("DOMContentLoaded", () => {
  // Year picker
  const input = document.getElementById("bookFormYear");
  const yearDropdown = document.createElement("select");
  yearDropdown.className = input.className;
  yearDropdown.id = input.id;
  yearDropdown.required = true;
  yearDropdown.setAttribute("data-testid", input.getAttribute("data-testid"));

  const currentYear = new Date().getFullYear();
  for (let year = 1900; year <= currentYear; year++) {
    const option = document.createElement("option");
    option.value = year;
    option.textContent = year;
    yearDropdown.appendChild(option);
  }

  input.replaceWith(yearDropdown);

  //   BOOK FORM
  const bookForm = document.getElementById("bookForm");
  bookForm.addEventListener("submit", addBook);

  if (isStorageAvailable()) {
    loadData();
  }
  renderBooks();
});

//
//
//
//
