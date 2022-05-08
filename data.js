let url = 'https://nordic-books-api.herokuapp.com/books';
const bookLib = document.querySelector ('.book-list');
const formRequest  = document.getElementById("add-form");
let inputAuthor = document.getElementById('add-author');
let inputTitle = document.getElementById('add-title');

function getLibrary(){
    return fetch (url)
    .then((response) => response.json());
}
function updateLibrary(){
    getLibrary() .then((books) => {
            books.forEach (book => {
            const bookWrapper= document.createElement ('div');
            bookWrapper.classList.add("book-wrapper");
            bookWrapper.style.borderStyle= 'double';
            bookWrapper.style.borderWidth= '3px';
            document.body.append(bookWrapper);

            const bookId = document.createElement('div');
            bookId.innerText=book._id;
            // document.body.append(bookId);

            const authorName = document.createElement('div');
            authorName.innerText= book.author;
            // document.body.append(authorName);
                
            const titleBook = document.createElement ('div');
            titleBook.innerText = book.title;
            // document.body.append(titleBook);

            const deleteButton = document.createElement ('button');
            deleteButton.textContent= 'удалить';
            deleteButton.classList.add("book-delete");
            deleteButton.dataset.bookId =book._id;


            const editButton = document.createElement ('button');
            editButton.textContent = 'редактировать';
            editButton.classList.add("book-edit");
            editButton.dataset.bookId =book._id;

            bookWrapper.append(bookId, authorName, titleBook, deleteButton, editButton);
            bookLib. prepend (bookWrapper);
        });
        console.log (books);
    });
}
updateLibrary();

formRequest.addEventListener("submit", (event) =>{
        event.preventDefault();
        if (inputAuthor.value === "" && inputTitle === "") {
            alert ('Ошибка');
        } 
        else{
            const newBook = {
                author: inputAuthor.value,
                title: inputTitle.value
            };
            fetch(url, {
                method: "POST",
                body: JSON.stringify(newBook),
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                },
            })
            .then((data)=> {
                updateLibrary();
                inputAuthor.value = '';
                inputTitle.value = '';
            });
        }

    }
);
bookLib.addEventListener('click', (event) => {
    if(!event.target.classList.contains('book-delete')){
       return;
   }
   else{
    const bookId = event.target.dataset.bookId;
        fetch(`${url}/${bookId}`,{
            method: 'DELETE',
        })
        .then((data)=> {
            updateLibrary();
        });
   }
});

bookLib.addEventListener('click', (event) => {
    if(!event.target.classList.contains('book-edit')){
       return;
    }
    else{
        // alert('ok');
        const bookId = event.target.dataset.bookId;
        fetch (`${url}/${bookId}`)
        .then((response) => response.json())
        .then(data =>{
            const editString = document.createElement('div');
            let editAuthor = document.createElement('input');
            editAuthor.placeholder = 'Введите нового автора';
            editAuthor.value = data.author;
            let editTitle = document.createElement('input');
            editTitle.placeholder = 'Введите новую книгу';
            editTitle.value = data.title;
            const buttonEdit = document.createElement('button');
            buttonEdit.innerText = "обновить";
            buttonEdit.type = "submit";

            editString.append(editAuthor, editTitle, buttonEdit);
            console.log(editString);
            editString.before(document.querySelector('.book-delete'));
        });
        
        
    }
});