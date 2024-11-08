const apiUrl = 'https://672de0b5fd897971564416bf.mockapi.io/api/library/Library';


function getBooks() {
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            displayBooks(data);
        })
        .catch(error => console.error('Error:', error));
}


function displayBooks(books) {
    const booksContainer = document.getElementById('booksContainer');
    booksContainer.innerHTML = ''; 

    books.forEach(book => {
        const bookItem = document.createElement('div');
        bookItem.classList.add('book-item');
        bookItem.innerHTML = `
            <h3>Book Name: ${book.name}</h3>
            <p>ID: ${book.id}</p>
            <p>Genre: ${book.Genre}</p>
            <p>Quantity: ${book.Quantity}</p>
        `;
        booksContainer.appendChild(bookItem);
    });
}


function createBook() {
    const bookName = document.getElementById('addBookName').value;
    const bookGenre = document.getElementById('addBookGenre').value;
    const bookQuantity = document.getElementById('addBookQuantity').value;

    if (!bookName || !bookGenre || !bookQuantity) {
        alert('Please fill in all fields');
        return;
    }

    const bookData = {
        name: bookName,
        Genre: bookGenre,
        Quantity: bookQuantity
    };

    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookData),
    })
    .then(response => response.json())
    .then(data => {
        alert('Book added successfully');
        getBooks();  
    })
    .catch(error => console.error('Error:', error));
}


function deleteBook() {
    const bookId = document.getElementById('deleteBookId').value;

    if (!bookId) {
        alert('Please enter a book ID');
        return;
    }

    fetch(`${apiUrl}/${bookId}`, {
        method: 'DELETE',
    })
    .then(() => {
        alert('Book deleted successfully');
        getBooks(); 
    })
    .catch(error => console.error('Error:', error));
}


function getBookById() {
    const bookId = document.getElementById('bookId').value;

    if (!bookId) {
        alert('Please enter a book ID');
        return;
    }

    fetch(`${apiUrl}/${bookId}`)
        .then(response => response.json())
        .then(book => {
            alert(`Book details: \nID: ${book.id} \nName: ${book.name} \nGenre: ${book.Genre} \nQuantity: ${book.Quantity}`);
        })
        .catch(error => console.error('Error:', error));
}


function updateBook() {
    const bookId = document.getElementById('updateBookId').value;
    const updatedName = document.getElementById('updateBookName').value;
    const updatedGenre = document.getElementById('updateBookGenre').value;
    const updatedQuantity = document.getElementById('updateBookQuantity').value;

    if (!bookId || !updatedName || !updatedGenre || !updatedQuantity) {
        alert('Please fill in all fields');
        return;
    }

    const updatedData = {
        name: updatedName,
        Genre: updatedGenre,
        Quantity: updatedQuantity
    };

    fetch(`${apiUrl}/${bookId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
    })
    .then(response => response.json())
    .then(() => {
        alert('Book updated successfully');
        getBooks();  
    })
    .catch(error => console.error('Error:', error));
}
