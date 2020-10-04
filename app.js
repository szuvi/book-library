let myLibrary = [];
const container = document.querySelector(".books-container");
const showButton = document.querySelector("#showPopup");
const cancelButton = document.querySelector("#cancel");
const addButton = document.querySelector("#add");

function Book(id, title, author, pages, read) {
  this.id = id;
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
}

function addBookToLibrary() {
  let id = createId();
  let title = document.querySelector("#new-title").value;
  let author = document.querySelector("#new-author").value;
  let pages = document.querySelector("#new-pages").value;
  let read = document.querySelector("#new-read").checked;
  if (title && author && pages) {
    let newBook = new Book(id, title, author, pages, read);
    myLibrary.push(newBook);
    return true;
  } else {
    return false;
  }
}

function createId() {
  if (myLibrary.length === 0) {
    return 0;
  } else {
    let highestId = myLibrary.reduce((highest, book) => {
      if (book.id > highest) return book.id;
      else return highest + 1;
    }, 0);
    return highestId;
  }
}

function deleteBookFromLibrary(id) {
  myLibrary = myLibrary.filter(book => book.id != id); // Intentional type coerction
}

function updateReadInLibrary(id, read) {
  myLibrary.forEach(book => (book.id == id ? (book.read = read) : ""));
}

function displayBooks() {
  clearBooks();
  if (myLibrary.length > 0) {
    myLibrary.forEach(book => {
      let card = document.createElement("div");
      card.classList.add("card");
      card.dataset.id = book.id;
      let bookInfo = `
      <div class="icon-box"><i class="fas fa-book fa-3x"></i></div>
      <p class="title">Title: <span id="title">${book.title}</span></p>
      <p class="author">Author: <span id="author">${book.author}</span></p>
      <p class="pages">Pages: <span id="pages">${book.pages}</span></p>
      <label for="read">
        Read
        <input type="checkbox" name="read" id="read" ${book.read ? "checked" : ""}/>
      </label>
      <div class="delete-icon">
          <a href="#"><i class="far fa-trash-alt"></i></a>
        </div>
    `;
      card.innerHTML = bookInfo;
      container.appendChild(card);
    });
  }
}

function clearBooks() {
  container.innerHTML = "";
}

function saveToLocal() {
  localStorage.setItem("myLibrary", JSON.stringify(myLibrary));
}

function loadFromLocal() {
  let local = localStorage.getItem("myLibrary");
  if (local) {
    myLibrary = JSON.parse(local);
  } else {
    myLibrary = [];
  }
}

showButton.addEventListener("click", showForm);
cancelButton.addEventListener("click", hideForm);
addButton.addEventListener("click", addBook);
container.addEventListener("click", deleteBook);
container.addEventListener("click", updateRead);

function addBook(e) {
  e.preventDefault();
  if (addBookToLibrary()) {
    hideForm();
    clearForm();
    displayBooks();
    saveToLocal();
  } else {
    alert("Incorrect Input!");
  }
}

function deleteBook(e) {
  if (e.target.classList.contains("fa-trash-alt")) {
    e.preventDefault();
    let id = e.target.parentElement.parentElement.parentElement.dataset.id;
    console.log(id);
    if (id) {
      deleteBookFromLibrary(id);
    }
    displayBooks();
    saveToLocal();
  }
}

function showForm() {
  document.querySelector(".form-wrapper").classList.remove("hidden");
}

function hideForm() {
  document.querySelector(".form-wrapper").classList.add("hidden");
}

function clearForm() {
  document.querySelector("#new-title").value = "";
  document.querySelector("#new-author").value = "";
  document.querySelector("#new-pages").value = "";
  document.querySelector("#new-read").checked = false;
}

function updateRead(e) {
  if (e.target.type === "checkbox") {
    let id = e.target.parentElement.parentElement.dataset.id;
    updateReadInLibrary(id, e.target.checked);
  }
  saveToLocal();
}

window.onload = function () {
  loadFromLocal();
  displayBooks();
};
