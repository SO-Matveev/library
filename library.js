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
    bookWrapper.style.borderStyle = "double";
    bookWrapper.style.borderWidth = "3px";
    document.body.append(bookWrapper);

    const userLogin = document.createElement("div");
    userLogin.innerText = book.userId;

    const bookId = document.createElement("div");
    bookId.innerText = book._id;
    bookId.style.display = "none";

    const authorName = document.createElement("div");
    authorName.innerText = book.author;

    const titleBook = document.createElement("div");
    titleBook.innerText = book.title;

    const coverImg = document.createElement("img");
    coverImg.src = book.imageUrl;
    coverImg.style.width = "150px";

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

    bookWrapper.append(
      userLogin,
      bookId,
      authorName,
      titleBook,
      coverImg,
      deleteButton,
      editButton,
      commentButton
    );
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
        console.log(editAuthor.value);
        editTitle.value = data.title;
        console.log(editTitle.value);
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

// Запрос в БД на наличие комментариев

// async function getComment(bookId) {
//   try {
//     const response = await fetch(`${apiUrl}/books/${bookId}/comments`);
//     return response.json();
//   } catch (error) {}
// }

// async function updateComment(bookId) {
//   const commentElement = document.querySelector(
//     `.comments[data-book-id="${bookId}]`
//   );

//   const data = await getComment(bookId);
//   data.forEach((comment) => {
//     const divName = document.createElement("div");
//     divName.innerText = comment.name;

//     const divText = document.createElement("div");
//     divText.innerText = comment.text;

//     commentElement.prepend(divName, divText);
//   });
// }

//Кнопка показать комментарии

bookListEL.addEventListener("click", (event) => {
  if (!event.target.classList.contains("book-comment")) {
    return;
  } else {
    const bookId = event.target.dataset.bookId;

    const commentShowDiv = document.createElement("div");
    commentShowDiv.classList.add("comments");
    commentShowDiv.dataset.bookId = bookId;

    const commentsForm = document.createElement("form");
    commentsForm.id = "comment-form";
    commentsForm.textContent = "Добавить новый комментарий";

    let commentName = document.createElement("input");
    commentName.id = "inputCommentName";
    commentName.placeholder = "Ваше имя";

    let commentText = document.createElement("textarea");
    commentText.id = "inputCommentText";
    commentText.placeholder = "Напишите Ваш комментарий";

    const buttonSendComment = document.createElement("button");
    buttonSendComment.innerText = "отправить";
    buttonSendComment.type = "submit";
    buttonSendComment.classList.add("book-comment-button");

    commentsForm.append(commentName, commentText, buttonSendComment);
    let stringInsert = event.target.closest(".book-wrapper");
    stringInsert
      .querySelector(".book-comment")
      .after(commentShowDiv, commentsForm);
  }
});
