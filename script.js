const apiUrl = 'http://localhost:5000/books'; 


function fetchBooks() {
  fetch(apiUrl)
    .then((response) => response.json())
    .then((books) => {
      const booksContainer = document.getElementById('booksContainer');
      booksContainer.innerHTML = '';
      books.forEach((book) => {
        booksContainer.innerHTML += `
          <div class="book-item">
            <h3>${book.name}</h3>
            <p>Genre: ${book.genre}</p>
            <p>Quantity: ${book.quantity}</p>
            <p>ID: ${book._id}</p>
          </div>
        `;
      });
    })
    .catch((error) => console.error('Error fetching books:', error));
}


function addBook() {
  const name = document.getElementById('addBookName').value;
  const genre = document.getElementById('addBookGenre').value;
  const quantity = document.getElementById('addBookQuantity').value;

  if (!name || !genre || !quantity) {
    alert('Please fill out all fields!');
    return;
  }

  const bookData = { name, genre, quantity };

  fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bookData),
  })
    .then(() => {
      alert('Book added successfully!');
      fetchBooks();
    })
    .catch((error) => console.error('Error adding book:', error));
}

function getBookById() {
    const bookId = document.getElementById('getBookId').value;
  
    if (!bookId) {
      alert('Please enter a book ID!');
      return;
    }
  
    fetch(`${apiUrl}/${bookId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Book not found');
        }
        return response.json();
      })
      .then((book) => {
        const specificBook = document.getElementById('specificBook');
        if (book) {
          specificBook.innerHTML = `
            <h3>${book.name}</h3>
            <p>Genre: ${book.genre}</p>
            <p>Quantity: ${book.quantity}</p>
          `;
        } else {
          specificBook.innerHTML = '<p>Book not found.</p>';
        }
      })
      .catch((error) => {
        console.error('Error fetching book:', error);
        alert('Failed to fetch book. Please check the ID.');
      });
  }
  

function updateBook() {
    const bookId = document.getElementById('updateBookId').value;
    const name = document.getElementById('updateBookName').value;
    const genre = document.getElementById('updateBookGenre').value;
    const quantity = document.getElementById('updateBookQuantity').value;
  
    if (!bookId || !name || !genre || !quantity) {
      alert('Please fill out all fields!');
      return;
    }
  
    const updatedData = { name, genre, quantity };
  
    fetch(`${apiUrl}/${bookId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to update book');
        }
        return response.json();
      })
      .then(() => {
        alert('Book updated successfully!');
        fetchBooks(); 
      })
      .catch((error) => console.error('Error updating book:', error));
  }
  


function deleteBook() {
  const bookId = document.getElementById('deleteBookId').value;

  if (!bookId) {
    alert('Please enter a book ID!');
    return;
  }

  fetch(`${apiUrl}/${bookId}`, { method: 'DELETE' })
    .then(() => {
      alert('Book deleted successfully!');
      fetchBooks();
    })
    .catch((error) => console.error('Error deleting book:', error));
}
