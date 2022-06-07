let apiUrl = "https://nordic-books-api.herokuapp.com";
const bookListEL = document.querySelector(".book-list");
const addForm = document.getElementById("add-form");
let inputAuthor = document.getElementById("add-author");
let inputTitle = document.getElementById("add-title");
let userId = document.getElementById("user-login");
const overlay = document.querySelector(".overlay");
const modal = document.getElementById("modal-edit-form");
let inputEditId = document.getElementById("inputEditId");
let editAuthor = document.getElementById("inputEditAuthor");
let editTitle = document.getElementById("inputEditTitle");

// Обращение в БД
async function getLibrary(user) {
  try {
    const response = await fetch(`${apiUrl}/books`, {
      headers: { "user-Id": user.value },
    });
    return response.json();
  } catch (error) {}
}

// Получение списка книг в БД

async function updateLibrary() {
  const books = await getLibrary(userId);
  bookListEL.innerHTML = "";
  books.data.forEach((book) => {
    const bookWrapper = document.createElement("div");
    bookWrapper.classList.add("book-wrapper");
    document.body.append(bookWrapper);

    const userLogin = document.createElement("div");
    userLogin.innerText = book.userId;
    userLogin.style.display = "none";

    const bookId = document.createElement("div");
    bookId.innerText = book._id;
    bookId.style.display = "none";

    const authorName = document.createElement("div");
    authorName.innerText = book.author;
    authorName.classList.add("book-descr");

    const titleBook = document.createElement("div");
    titleBook.innerText = book.title;
    titleBook.classList.add("book-descr");

    const coverImg = document.createElement("img");
    coverImg.src = book.imageUrl;
    coverImg.classList.add("cover-img");

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "удалить";
    deleteButton.classList.add("book-delete");
    deleteButton.dataset.bookId = book._id;

    const editButton = document.createElement("button");
    editButton.textContent = "редактировать";
    editButton.classList.add("book-edit");
    editButton.dataset.bookId = book._id;

    const commentButton = document.createElement("button");
    commentButton.textContent = "показать комментарии";
    commentButton.classList.add("book-comment");
    commentButton.dataset.bookId = book._id;

    const bookDescr = document.createElement("div");
    bookDescr.classList.add("book-descr");
    bookDescr.append(authorName, titleBook);

    const buttonWrap = document.createElement("div");
    buttonWrap.classList.add("button-wrap");
    buttonWrap.append(deleteButton, editButton, commentButton);

    bookWrapper.append(userLogin, bookId, bookDescr, coverImg, buttonWrap);
    bookListEL.append(bookWrapper);
  });
}
updateLibrary(userId);

// Добавление новой книги

addForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (inputAuthor.value === "" && inputTitle === "") {
    alert("Ошибка");
  } else {
    let cover = document.getElementById("cover");
    const formData = new FormData();
    formData.append("author", inputAuthor.value);
    formData.append("title", inputTitle.value);
    formData.append("cover", cover.files[0]);

    fetch(`${apiUrl}/books`, {
      method: "POST",
      headers: {
        "user-Id": userId.value,
      },
      body: formData,
    }).then((data) => {
      inputAuthor.value = "";
      inputTitle.value = "";
      userId.value = "";
      cover.value = "";
      updateLibrary();
    });
  }
});

//Кнопка удаления книги

bookListEL.addEventListener("click", (event) => {
  if (!event.target.classList.contains("book-delete")) {
    return;
  } else {
    const bookId = event.target.dataset.bookId;
    fetch(`${apiUrl}/books/${bookId}`, {
      method: "DELETE",
    }).then((data) => {
      updateLibrary();
    });
  }
});

// Кнопка редактировать

bookListEL.addEventListener("click", (event) => {
  if (!event.target.classList.contains("book-edit")) {
    return;
  } else {
    const bookId = event.target.dataset.bookId;
    overlay.style.display = "block";
    fetch(`${apiUrl}/books/${bookId}`)
      .then((response) => response.json())
      .then((data) => {
        inputEditId.value = data._id;
        editAuthor.value = data.author;
        editTitle.value = data.title;
      });
  }
});

//Закрывание модального окна
function closeModal() {
  inputEditId.value = "";
  editAuthor.value = "";
  editTitle.value = "";
  overlay.style.display = "none";
}

// Отправка обновления редактирования

modal.addEventListener("click", (event) => {
  event.preventDefault();
  if (!event.target.classList.contains("book-edit-button")) {
    return;
  } else {
    const bookId = inputEditId.value;
    const author = editAuthor.value;
    const title = editTitle.value;

    fetch(`${apiUrl}/books/${bookId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        author,
        title,
      }),
    })
      .then((response) => response.json())
      .then(() => {
        updateLibrary();
        closeModal();
      });
  }
});

//Кнопка закрытия модального окна
modal.addEventListener("click", (event) => {
  event.preventDefault();
  if (!event.target.classList.contains("modal-close")) {
    return;
  }
  closeModal();
});

// Запрос в БД на наличие комментариев

async function updateComment(bookId) {
  const commentElement = document.querySelector(
    `.comments[data-book-id="${bookId}"]`
  );
  const response = await fetch(`${apiUrl}/books/${bookId}/comments`);
  const books = await response.json();

  books.data.forEach((comment) => {
    const commentName = document.createElement("div");
    commentName.textContent = `Пользователь: ${comment.name}`;
    commentName.classList.add("comment-body");

    const commentText = document.createElement("div");
    commentText.textContent = `Текст: ${comment.text}`;
    commentText.classList.add("comment-body");

    commentElement.prepend(commentName, commentText);
  });
}

//Кнопка показать комментарии

bookListEL.addEventListener("click", (event) => {
  if (!event.target.classList.contains("book-comment")) {
    return;
  }
  const bookId = event.target.dataset.bookId;
  const bookItem = event.target.closest(".book-wrapper");
  const commentsBlock = bookItem.querySelector(".comments");

  if (commentsBlock) {
    commentsBlock.remove();
    event.target.textContent = "Показать комментарии";
  } else {
    const commentShowDiv = document.createElement("div");
    commentShowDiv.classList.add("comments");
    commentShowDiv.innerText = "Комментарии:";
    commentShowDiv.dataset.bookId = bookId;

    const commentsForm = document.createElement("form");
    commentsForm.classList.add("comment-form");
    commentsForm.id = "comment-form";
    commentsForm.textContent = "Добавить новый комментарий:";

    let commentName = document.createElement("input");
    commentName.classList.add("comment-name");
    commentName.id = "inputCommentName";
    commentName.placeholder = "Ваше имя";

    let commentText = document.createElement("textarea");
    commentText.classList.add("comment-text");
    commentText.id = "inputCommentText";
    commentText.placeholder = "Напишите Ваш комментарий";

    const buttonSendComment = document.createElement("button");
    buttonSendComment.classList.add("comment-send");
    buttonSendComment.innerText = "отправить";
    buttonSendComment.type = "submit";

    commentsForm.append(commentName, commentText, buttonSendComment);
    commentShowDiv.append(commentsForm);

    let stringInsert = event.target.closest(".book-wrapper");

    stringInsert.append(commentShowDiv);
    event.target.textContent = "Скрыть комментарии";
    updateComment(bookId);
  }
});

//Отправка комментария

bookListEL.addEventListener("click", (event) => {
  event.preventDefault();
  if (!event.target.classList.contains("comment-send")) {
    return;
  }
  const commentsFormSubmit = document.querySelector(".comment-form");
  const coomentsDiv = document.querySelector(".comments");

  const nameComment = commentsFormSubmit.querySelector(".comment-name").value;
  const textComment = commentsFormSubmit.querySelector(".comment-text").value;

  const bookId = coomentsDiv.dataset.bookId;

  if (nameComment && textComment) {
    fetch(`${apiUrl}/books/${bookId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: nameComment,
        text: textComment,
      }),
    }).then(() => {
      nameComment.value = "";
      textComment.value = "";
      updateComment(bookId);
    });
  }
});
