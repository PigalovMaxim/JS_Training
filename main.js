//Формы с книгами
const FAVORITE_LIST_WRAPPER = document.getElementById('js-favorite-books');
const BOOKS_LIST_WRAPPER = document.getElementById('js-list-books');
const CHOOSEN_BOOK_WRAPPER = document.getElementById('js-book-side');
//Чекбоксы
const CHECK_BOX_DOWNLOAD = document.getElementById('js-download-book');
const CHECK_BOX_WRITE = document.getElementById('js-write-book');
//Формы заполнения книги
const DOWNLOAD_CONTROLS = document.getElementById('js-download-controls');
const WRITE_CONTROLS = document.getElementById('js-write-controls');
//Кнопки/инпуты и т.д
const SEND_BUTTON = document.getElementById('js-send-book');
const DOWNLOAD_TITLE_INPUT = document.getElementById('js-input-title-download');
const WRITE_TITLE_INPUT = document.getElementById('js-input-title-write');
const WRITE_TEXT_INPUT = document.getElementById('js-input-write-text');
//Переменные
const BOOKS_LIST = [];
const FAVORITE_LIST = [];

CHECK_BOX_DOWNLOAD.addEventListener('click', () => changeCheckBox(true));
CHECK_BOX_WRITE.addEventListener('click', () => changeCheckBox(false));
SEND_BUTTON.addEventListener('click', sendBook);
window.addEventListener("load", () => {
    updateBooksArray();
    renderDOM();
});

function changeCheckBox(isDownload){
    CHECK_BOX_WRITE.checked = !isDownload;
    CHECK_BOX_DOWNLOAD.checked = isDownload;
    isDownload ? DOWNLOAD_CONTROLS.classList.remove('g-hidden') : DOWNLOAD_CONTROLS.classList.add('g-hidden');
    !isDownload ? WRITE_CONTROLS.classList.remove('g-hidden') : WRITE_CONTROLS.classList.add('g-hidden');
}
function sendBook() {
    if(CHECK_BOX_WRITE.checked) {
        if(WRITE_TEXT_INPUT.value === '' || WRITE_TEXT_INPUT.value === '') return;
        const BOOK = { title: '', text: '', isReaded: false };
        BOOK.title = WRITE_TITLE_INPUT.value;
        BOOK.text = WRITE_TEXT_INPUT.value;
        BOOKS_LIST.unshift(BOOK);
        setStorageBooks();
        renderDOM();
        return;
    }
}
function renderDOM() {
    FAVORITE_LIST_WRAPPER.innerHTML = '';
    BOOKS_LIST_WRAPPER.innerHTML = '';
    //Загружаем прочитанные
    BOOKS_LIST.forEach((book, index) => {
        if(!book.isReaded) return;
        const BOOK = createBookElement(book, index, false);
        BOOKS_LIST_WRAPPER.appendChild(BOOK);
    });
    FAVORITE_LIST.forEach((book, index) => {
        if(!book.isReaded) return;
        const BOOK = createBookElement(book, index, true);
        FAVORITE_LIST_WRAPPER.appendChild(BOOK);
    });
    //Загружаем непрочитанные
    BOOKS_LIST.forEach((book, index) => {
        if(book.isReaded) return;
        const BOOK = createBookElement(book, index, false);
        BOOKS_LIST_WRAPPER.appendChild(BOOK);
    });
    FAVORITE_LIST.forEach((book, index) => {
        if(book.isReaded) return;
        const BOOK = createBookElement(book, index, true);
        FAVORITE_LIST_WRAPPER.appendChild(BOOK);
    });
}
function createBookElement(book, index, isItFavoriteList) {
    const WRAPPER = document.createElement('div');
    WRAPPER.classList.add('b-list-item');

    const TITLE = document.createElement('label');
    TITLE.classList.add('b-list-title');
    TITLE.innerHTML = '- ' + book.title;
    WRAPPER.appendChild(TITLE);
    
    const CONTROLS_WRAPPER = document.createElement('div');
    CONTROLS_WRAPPER.classList.add('b-list-item-controls');

    const EDIT_BUTTON = document.createElement('button');
    EDIT_BUTTON.classList.add('b-list-item-button');
    EDIT_BUTTON.innerHTML = 'Ред.';
    CONTROLS_WRAPPER.appendChild(EDIT_BUTTON);

    const READED_BUTTON = document.createElement('button');
    READED_BUTTON.classList.add('b-list-item-button');
    READED_BUTTON.innerHTML = book.isReaded ? 'Прочитал' : 'Прочитана';
    if(book.isReaded) READED_BUTTON.classList.add('g-readed');
    READED_BUTTON.addEventListener('click', () => {
        book.isReaded = !book.isReaded;
        renderDOM();
    })
    CONTROLS_WRAPPER.appendChild(READED_BUTTON);

    const READ_BUTTON = document.createElement('button');
    READ_BUTTON.classList.add('b-list-item-button');
    READ_BUTTON.innerHTML = 'Читать';
    READ_BUTTON.addEventListener('click', () => {
        CHOOSEN_BOOK_WRAPPER.innerHTML = '';
        const BOOK_TITLE = document.createElement('label');
        BOOK_TITLE.innerHTML = book.title;
        CHOOSEN_BOOK_WRAPPER.appendChild(BOOK_TITLE);
        const BOOK_TEXT = document.createElement('label');
        BOOK_TEXT.innerHTML = book.text;
        CHOOSEN_BOOK_WRAPPER.appendChild(BOOK_TEXT);
    });
    CONTROLS_WRAPPER.appendChild(READ_BUTTON);

    const DELETE_BUTTON = document.createElement('button');
    DELETE_BUTTON.classList.add('b-list-item-button');
    DELETE_BUTTON.innerHTML = 'X';
    DELETE_BUTTON.addEventListener('click', () => {
        if(isItFavoriteList){
            FAVORITE_LIST = FAVORITE_LIST.splice(index, 1);
            return;
        }
        console.log(index, BOOKS_LIST);
        BOOKS_LIST.splice(index, 1);
        setStorageBooks();
        console.log(index, BOOKS_LIST);
        renderDOM();
    });
    CONTROLS_WRAPPER.appendChild(DELETE_BUTTON);

    WRAPPER.appendChild(CONTROLS_WRAPPER);

    return WRAPPER;
}
function setStorageBooks () {
    localStorage.setItem('bookList', JSON.stringify(BOOKS_LIST));
    localStorage.setItem('favoriteList', JSON.stringify(FAVORITE_LIST));
}
function updateBooksArray () {
    if(localStorage.getItem('bookList')) {
        JSON.parse(localStorage.getItem('bookList')).forEach(book => BOOKS_LIST.push(book));
    }
    if(localStorage.getItem('favoriteList')) {
        JSON.parse(localStorage.getItem('favoriteList')).forEach(book => FAVORITE_LIST.push(book));
    }
}