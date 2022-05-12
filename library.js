let apiUrl = "https://nordic-books-api.herokuapp.com";
const bookListEL = document.querySelector(".book-list");
const addForm = document.getElementById("add-form");
let inputAuthor = document.getElementById("add-author");
let inputTitle = document.getElementById("add-title");
let userId = document.getElementById("user-login");

async function getLibrary(user) {
  try {
    const response = await fetch(`${apiUrl}/books`, {
      headers: { "user-Id": user.value },
    });
    return response.json();
  } catch (error) {}
}
async function updateLibrary() {
  const books = await getLibrary(userId)
  bookListEL.innerHTML = "";
  books.forEach((book) => {
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

    bookWrapper.append(
      userLogin,
      bookId,
      authorName,
      titleBook,
      coverImg,
      deleteButton,
      editButton
    );
    bookListEL.append(bookWrapper);
  });
}
updateLibrary(userId);

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

bookListEL.addEventListener("click", (event) => {
  if (!event.target.classList.contains("book-edit")) {
    return;
  } else {
    const bookId = event.target.dataset.bookId;
    fetch(`${apiUrl}/books/${bookId}`)
      .then((response) => response.json())
      .then((data) => {
        const editString = document.createElement("div");
        editString.classList.add("edit-string");

        let inputEditId = document.createElement("input");
        inputEditId.type = "hidden";
        inputEditId.id = "inputEditId";
        inputEditId.value = data._id;

        let editAuthor = document.createElement("input");
        editAuthor.id = "inputEditAuthor";
        editAuthor.placeholder = "Введите нового автора";
        editAuthor.value = data.author;

        let editTitle = document.createElement("input");
        editTitle.id = "inputEditTitle";
        editTitle.placeholder = "Введите новую книгу";
        editTitle.value = data.title;

        const buttonEdit = document.createElement("button");
        buttonEdit.innerText = "обновить";
        buttonEdit.type = "submit";
        buttonEdit.classList.add("book-edit-button");

        editString.append(inputEditId, editAuthor, editTitle, buttonEdit);
        let stringInsert = event.target.closest(".book-wrapper");
        stringInsert.querySelector(".book-delete").before(editString);
      });
  }
});

bookListEL.addEventListener("click", (event) => {
  event.preventDefault();
  if (!event.target.classList.contains("book-edit-button")) {
    return;
  } else {
    const bookId = document.getElementById("inputEditId").value;
    const author = document.getElementById("inputEditAuthor").value;
    const title = document.getElementById("inputEditTitle").value;

    fetch(`${apiUrl}/books/${bookId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        author,
        title,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        updateLibrary();
      });
  }
});
