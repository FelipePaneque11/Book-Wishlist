async function loadWishlist() {
    try {
        const response = await fetch('/wishlist');
        const wishlist = await response.json();

        const container = document.getElementById('wishlist-container');
        container.innerHTML = ''; // Clear existing content

        if (wishlist.length === 0) {
            container.innerHTML = '<p>Your wishlist is empty!</p>';
            return;
        }

        wishlist.forEach((book, index) => {
            const { title, authors, categories, imageLink } = book;
        
            const bookCard = document.createElement('div');
            bookCard.classList.add('book');
            
            //redirect to amazon in case user wants to purchase book
            const searchQuery = `${title} ${authors}`;
            const amazonUrl = `https://www.amazon.ie/s?k=${searchQuery}`; //amazon search link
        
            bookCard.innerHTML = `
                <img src="${imageLink}" alt="${title}" onerror="this.src='https://via.placeholder.com/100x150?text=No+Image'">
                <h3>${title}</h3>
                <p>${authors}</p>
                <p>${categories}</p>
                <div class="book-buttons">
                    <button class="buy" onclick="window.open('${amazonUrl}', '_blank')">BUY</button>
                    <button class="delete" onclick="deleteFromWishlist(${index})">Delete</button>
                </div>
            `;
        
            container.appendChild(bookCard);
        });
    } catch (error) {
        console.error('Error loading wishlist:', error);
        document.getElementById('wishlist-container').innerHTML = '<p>Error loading wishlist. Please try again later.</p>';
    }
}


async function deleteFromWishlist(index) {
    try {
        const response = await fetch(`/delete-from-wishlist/${index}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            alert('Book removed from wishlist.');
            loadWishlist(); // Refresh the wishlist
        } else {
            alert('Failed to remove book from wishlist. Please try again.');
        }
    } catch (error) {
        console.error('Error deleting book from wishlist:', error);
        alert('Error deleting book from wishlist. Please try again later.');
    }
}


// Load the wishlist on page load
document.addEventListener('DOMContentLoaded', loadWishlist);

