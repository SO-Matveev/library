let url = "https://nordic-books-api.herokuapp.com/books";
const bookLib = document.querySelector(".book-list");
const formRequest = document.getElementById("add-form");
let inputAuthor = document.getElementById("add-author");
let inputTitle = document.getElementById("add-title");
let userId = document.getElementById("user-login");

function getLibrary() {
	return fetch(url, {
		headers:{'user-Id':userId.value}})
	.then((response) => response.json());
}
function updateLibrary() {
	getLibrary().then((books) => {
		books.forEach((book) => {
			const bookWrapper = document.createElement("div");
			bookWrapper.classList.add("book-wrapper");
			bookWrapper.style.borderStyle = "double";
			bookWrapper.style.borderWidth = "3px";
			document.body.append(bookWrapper);

			const userLogin = document.createElement("div");
			userLogin.innerText= book.userId;

			const bookId = document.createElement("div");
			bookId.innerText = book._id;
			bookId.style.display="none";
			// document.body.append(bookId);

			const authorName = document.createElement("div");
			authorName.innerText = book.author;
			// document.body.append(authorName);

			const titleBook = document.createElement("div");
			titleBook.innerText = book.title;
			// document.body.append(titleBook);

			const coverImg= document.createElement("img");
			coverImg.src = book.imageUrl;
			coverImg.style.width="150px";

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
			bookLib.prepend(bookWrapper);
		});
		console.log(books);
	});
}
updateLibrary();

formRequest.addEventListener("submit", (event) => {
	event.preventDefault();
	if (inputAuthor.value === "" && inputTitle === "") {
		alert("Ошибка");
	} else {
		// const newBook = {
		// 	author: inputAuthor.value,
		// 	title: inputTitle.value,
		// };
		let cover = document.getElementById('cover');
		const formData = new FormData();
        formData.append('author', inputAuthor.value);
        formData.append('title', inputTitle.value);
        formData.append('cover', cover.files[0]);

		fetch(url, {
			method: "POST",
			body: formData, //JSON.stringify(newBook),
			headers: {
				'user-Id':userId.value
				// "Content-type": "application/json; charset=UTF-8",
			},
		}).then((data) => {
			updateLibrary();
			inputAuthor.value = "";
			inputTitle.value = "";
			userId.value="";
		});
	}
});
bookLib.addEventListener("click", (event) => {
	if (!event.target.classList.contains("book-delete")) {
		return;
	} else {
		const bookId = event.target.dataset.bookId;
		fetch(`${url}/${bookId}`, {
			method: "DELETE",
		}).then((data) => {
			updateLibrary();
		});
	}
});

bookLib.addEventListener("click", (event) => {
	if (!event.target.classList.contains("book-edit")) {
		return;
	} else {
		// alert('ok');
		const bookId = event.target.dataset.bookId;
		fetch(`${url}/${bookId}`)
			.then((response) => response.json())
			.then((data) => {
				const editString = document.createElement("div");
				editString.classList.add("edit-string");

				let editId = document.createElement("input");
				editId.type = "hidden";
				editId.id = "inputEditId";
				editId.value = data._id;

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

				editString.append(editId, editAuthor, editTitle, buttonEdit);
				document.querySelector(".book-delete").before(editString);
				console.log(editString);
			});
	}
});

bookLib.addEventListener("click", (event) => {
	event.preventDefault();
	if (!event.target.classList.contains("book-edit-button")) {
		return;
	} else {
		const bookId = document.getElementById("inputEditId").value;
		const author = document.getElementById("inputEditAuthor").value;
		const title = document.getElementById("inputEditTitle").value;
		console.log(author);
		console.log(title);

		fetch(`${url}/${bookId}`, {
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
