//Формы с книгами
const FAVORITE_LIST_WRAPPER = document.getElementById("js-favorite-books");
const BOOKS_LIST_WRAPPER = document.getElementById("js-list-books");
const CHOOSEN_BOOK_WRAPPER = document.getElementById("js-book-side");
//Чекбоксы
const CHECK_BOX_DOWNLOAD = document.getElementById("js-download-book");
const CHECK_BOX_WRITE = document.getElementById("js-write-book");
//Формы заполнения книги
const DOWNLOAD_CONTROLS = document.getElementById("js-download-controls");
const WRITE_CONTROLS = document.getElementById("js-write-controls");
//Кнопки/инпуты и т.д
const SEND_BUTTON = document.getElementById("js-send-book");
const DOWNLOAD_TITLE_INPUT = document.getElementById("js-input-title-download");
const DONWLOAD_INPUT_FILE = document.getElementById("js-download-input");
const WRITE_TITLE_INPUT = document.getElementById("js-input-title-write");
const WRITE_TEXT_INPUT = document.getElementById("js-input-write-text");
const FAVORITE_DROP_AREA = document.getElementById(
  "js-drop-down-area-favorite"
);
const BOOKS_DROP_AREA = document.getElementById("js-drop-down-area-books");
const AREAS = [FAVORITE_DROP_AREA, BOOKS_DROP_AREA];
//Переменные
const BOOKS_LIST = [];
const FAVORITE_LIST = [];

CHECK_BOX_DOWNLOAD.addEventListener("click", () => changeCheckBox(true));
CHECK_BOX_WRITE.addEventListener("click", () => changeCheckBox(false));
SEND_BUTTON.addEventListener("click", sendBook);
AREAS.forEach((area) => {
  area.addEventListener("dragenter", () => {
    area.innerHTML = "DROP BOOK HERE";
  });
  area.addEventListener("dragleave", (e) => {
    area.innerHTML = "DROP DOWN AREA";
  });
  area.addEventListener("dragend", (e) => {
    area.innerHTML = "DROP DOWN AREA";
  });
  area.addEventListener("dragover", (e) => {
    if (e.preventDefault) {
      e.preventDefault();
    }
    return false;
  });
});
FAVORITE_DROP_AREA.addEventListener("drop", (e) => {
  e.preventDefault();
  const currBook = JSON.parse(e.dataTransfer.getData("currentItem"));
  if (currBook.book.isFavorite) return;
  currBook.book.isFavorite = true;
  FAVORITE_LIST.unshift(currBook.book);
  BOOKS_LIST.splice(currBook.index, 1);
  FAVORITE_DROP_AREA.innerHTML = "DROP DOWN AREA";
  setStorageBooks();
  renderDOM();
});
BOOKS_DROP_AREA.addEventListener("drop", (e) => {
  e.preventDefault();
  const currBook = JSON.parse(e.dataTransfer.getData("currentItem"));
  if (!currBook.book.isFavorite) return;
  currBook.book.isFavorite = false;
  FAVORITE_LIST.splice(currBook.index, 1);
  BOOKS_LIST.unshift(currBook.book);
  BOOKS_DROP_AREA.innerHTML = "DROP DOWN AREA";
  setStorageBooks();
  renderDOM();
});
window.addEventListener("load", () => {
  updateBooksArray();
  renderDOM();
});

function changeCheckBox(isDownload) {
  CHECK_BOX_WRITE.checked = !isDownload;
  CHECK_BOX_DOWNLOAD.checked = isDownload;
  isDownload
    ? DOWNLOAD_CONTROLS.classList.remove("g-hidden")
    : DOWNLOAD_CONTROLS.classList.add("g-hidden");
  !isDownload
    ? WRITE_CONTROLS.classList.remove("g-hidden")
    : WRITE_CONTROLS.classList.add("g-hidden");
}
async function sendBook() {
  if (CHECK_BOX_WRITE.checked) {
    if (WRITE_TITLE_INPUT.value === "" || WRITE_TEXT_INPUT.value === "") return;
    const BOOK = { title: "", text: "", isReaded: false, isFavorite: false };
    BOOK.title = WRITE_TITLE_INPUT.value;
    BOOK.text = WRITE_TEXT_INPUT.value;
    BOOKS_LIST.unshift(BOOK);
    setStorageBooks();
    renderDOM();
    return;
  }
  if (
    DOWNLOAD_TITLE_INPUT.value === "" ||
    DONWLOAD_INPUT_FILE.files.length === 0
  )
    return;
  const BOOK = { title: "", text: "", isReaded: false, isFavorite: false };
  const FORM_DATA = new FormData();
  FORM_DATA.append('login', 'user');
  FORM_DATA.append('file', DONWLOAD_INPUT_FILE.files[DONWLOAD_INPUT_FILE.files.length - 1]);
  const ANSWER = await fetch(
    `https://apiinterns.osora.ru/`,
    {
      method: "POST",
      body: FORM_DATA,
    }
  );
  const RESULT = await ANSWER.json();
  BOOK.title = DOWNLOAD_TITLE_INPUT.value;
  BOOK.text = RESULT.text;
  BOOKS_LIST.unshift(BOOK);
  setStorageBooks();
  renderDOM();
}
function renderDOM() {
  FAVORITE_LIST_WRAPPER.innerHTML = "";
  BOOKS_LIST_WRAPPER.innerHTML = "";
  //Загружаем прочитанные
  BOOKS_LIST.forEach((book, index) => {
    if (!book.isReaded) return;
    const BOOK = createBookElement(book, index, false);
    BOOKS_LIST_WRAPPER.appendChild(BOOK);
  });
  FAVORITE_LIST.forEach((book, index) => {
    if (!book.isReaded) return;
    const BOOK = createBookElement(book, index, true);
    FAVORITE_LIST_WRAPPER.appendChild(BOOK);
  });
  //Загружаем непрочитанные
  BOOKS_LIST.forEach((book, index) => {
    if (book.isReaded) return;
    const BOOK = createBookElement(book, index, false);
    BOOKS_LIST_WRAPPER.appendChild(BOOK);
  });
  FAVORITE_LIST.forEach((book, index) => {
    if (book.isReaded) return;
    const BOOK = createBookElement(book, index, true);
    FAVORITE_LIST_WRAPPER.appendChild(BOOK);
  });
}
function createBookElement(book, index, isItFavoriteList) {
  const WRAPPER = document.createElement("div");
  WRAPPER.classList.add("b-list-item");
  WRAPPER.setAttribute("draggable", true);
  WRAPPER.addEventListener("dragstart", (e) => {
    WRAPPER.style.opacity = 0.4;
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("currentItem", JSON.stringify({ book, index }));
  });
  WRAPPER.addEventListener("dragend", (e) => {
    WRAPPER.style.opacity = 1;
  });
  WRAPPER.addEventListener("dragover", (e) => {
    if (e.preventDefault) {
      e.preventDefault();
    }
    return false;
  });
  WRAPPER.addEventListener("drop", (e) => {
    e.stopPropagation();
    e.preventDefault();
    WRAPPER.style.opacity = 1;
  });

  const TITLE = document.createElement("label");
  TITLE.classList.add("b-list-title");
  TITLE.innerHTML = "- " + book.title;
  WRAPPER.appendChild(TITLE);

  const CONTROLS_WRAPPER = document.createElement("div");
  CONTROLS_WRAPPER.classList.add("b-list-item-controls");

  const EDIT_BUTTON = document.createElement("button");
  EDIT_BUTTON.classList.add("b-list-item-button");
  EDIT_BUTTON.innerHTML = "Ред.";
  EDIT_BUTTON.addEventListener("click", () => {
    editBook(book);
  });
  CONTROLS_WRAPPER.appendChild(EDIT_BUTTON);

  const READED_BUTTON = document.createElement("button");
  READED_BUTTON.classList.add("b-list-item-button");
  READED_BUTTON.innerHTML = book.isReaded ? "Прочитал" : "Прочитана";
  if (book.isReaded) READED_BUTTON.classList.add("g-readed");
  READED_BUTTON.addEventListener("click", () => {
    book.isReaded = !book.isReaded;
    renderDOM();
  });
  CONTROLS_WRAPPER.appendChild(READED_BUTTON);

  const READ_BUTTON = document.createElement("button");
  READ_BUTTON.classList.add("b-list-item-button");
  READ_BUTTON.innerHTML = "Читать";
  READ_BUTTON.addEventListener("click", () => {
    readBook(book);
  });
  CONTROLS_WRAPPER.appendChild(READ_BUTTON);

  const DELETE_BUTTON = document.createElement("button");
  DELETE_BUTTON.classList.add("b-list-item-button");
  DELETE_BUTTON.innerHTML = "X";
  DELETE_BUTTON.addEventListener("click", () => {
    if (isItFavoriteList) {
      FAVORITE_LIST.splice(index, 1);
      setStorageBooks();
      renderDOM();
      return;
    }
    BOOKS_LIST.splice(index, 1);
    setStorageBooks();
    renderDOM();
  });
  CONTROLS_WRAPPER.appendChild(DELETE_BUTTON);

  WRAPPER.appendChild(CONTROLS_WRAPPER);

  return WRAPPER;
}
function setStorageBooks() {
  localStorage.setItem("bookList", JSON.stringify(BOOKS_LIST));
  localStorage.setItem("favoriteList", JSON.stringify(FAVORITE_LIST));
}
function updateBooksArray() {
  if (localStorage.getItem("bookList")) {
    JSON.parse(localStorage.getItem("bookList")).forEach((book) =>
      BOOKS_LIST.push(book)
    );
  }
  if (localStorage.getItem("favoriteList")) {
    JSON.parse(localStorage.getItem("favoriteList")).forEach((book) =>
      FAVORITE_LIST.push(book)
    );
  }
}
function readBook(book) {
  CHOOSEN_BOOK_WRAPPER.innerHTML = "";
  const BOOK_TITLE = document.createElement("label");
  BOOK_TITLE.classList.add("book__title");
  BOOK_TITLE.innerHTML = book.title;
  CHOOSEN_BOOK_WRAPPER.appendChild(BOOK_TITLE);
  const BOOK_TEXT = document.createElement("label");
  BOOK_TEXT.classList.add("book__text");
  BOOK_TITLE.classList.add("book__text");
  BOOK_TEXT.innerHTML = book.text;
  CHOOSEN_BOOK_WRAPPER.appendChild(BOOK_TEXT);
}
function editBook(book) {
  CHOOSEN_BOOK_WRAPPER.innerHTML = "";
  const INPUT_TITLE = document.createElement("input");
  INPUT_TITLE.classList.add("book__title-input");
  INPUT_TITLE.value = book.title;
  INPUT_TITLE.placeholder = "Введите название книги";
  CHOOSEN_BOOK_WRAPPER.appendChild(INPUT_TITLE);
  const INPUT_TEXT = document.createElement("textarea");
  INPUT_TEXT.classList.add("book__text-input");
  INPUT_TEXT.value = book.text;
  INPUT_TEXT.placeholder = "Введите текст книги";
  CHOOSEN_BOOK_WRAPPER.appendChild(INPUT_TEXT);
  const BUTTON_SEND = document.createElement("button");
  BUTTON_SEND.classList.add("book__submit-button");
  BUTTON_SEND.innerHTML = "Сохранить";
  BUTTON_SEND.addEventListener("click", () => {
    book.title = INPUT_TITLE.value;
    book.text = INPUT_TEXT.value;
    setStorageBooks();
    renderDOM();
    CHOOSEN_BOOK_WRAPPER.innerHTML = "";
  });
  CHOOSEN_BOOK_WRAPPER.appendChild(BUTTON_SEND);
}
