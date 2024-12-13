//Google Api by default will display only 10 books per request unless we set a maxResult;
async function fetchBooks(query, maxResults = 20, startIndex = 0) { 
    try {
        const response = await fetch(
            `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=${maxResults}&startIndex=${startIndex}`
        );
        const data = await response.json();

        // Check if books are found
        if (data.items) {
            displayBooks(data.items);
        } else {
            document.getElementById('results').innerHTML = '<p>No books found.</p>';
        }
    } catch (error) {
        console.error('Error fetching books:', error);
        document.getElementById('results').innerHTML = '<p>Error fetching books. Please try again later.</p>';
    }
}

// Function to display books in the results section
function displayBooks(books) {
    const results = document.getElementById('results');
    results.innerHTML = ''; // Clear previous results

    books.forEach(book => {
        const { title, authors, categories, imageLinks } = book.volumeInfo;
    
        // Create a card for each book
        const bookCard = document.createElement('div');
        bookCard.classList.add('book');
    
        bookCard.innerHTML = `
            <img src="${imageLinks?.thumbnail || 'https://via.placeholder.com/100x150?text=No+Image'}" alt="${title}"> 
            <h3>${title}</h3>
            <p>${authors ? authors.join(', ') : 'Unknown Author'}</p>
            <p>${categories ? categories.join(', ') : 'No categories available'}</p>
            <button onclick="addToWishlist('${title}', '${authors ? authors.join(', ') : 'Unknown Author'}', '${categories ? categories.join(', ') : ''}', '${imageLinks?.thumbnail || 'https://via.placeholder.com/100x150?text=No+Image'}')">Add to Wishlist</button>
        `; 
    
        results.appendChild(bookCard);
        
    });
}

// Function to handle adding books to the wishlist
async function addToWishlist(title, authors, categories, imageLink) {
    try {
        const response = await fetch('/add-to-wishlist', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, authors, categories, imageLink })
        });

        if (response.ok) {
            alert(`Added "${title}" by ${authors} to your wishlist.`);
        } else {
            alert('Failed to add book to wishlist. Please try again.');
        }
    } catch (error) {
        console.error('Error adding book to wishlist:', error);
        alert('Error adding book to wishlist. Please try again later.');
    }
}

// Event listener for the search button
document.getElementById('search-button').addEventListener('click', () => {
    const query = document.getElementById('search-input').value.trim();
    const infoSection = document.querySelector('.info-section');
    if (!query) {
        alert('Please enter a search term.');
        return;
    }

    fetchBooks(query);
}); //will get user query and look for it in the google API

