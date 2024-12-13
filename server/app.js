const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

// Middleware
app.use(express.static(path.join(__dirname, '../css')));
app.use(express.static(path.join(__dirname, '../js')));
app.use(express.static(path.join(__dirname, '../html')));
app.use(express.json());

// Route to add a new book to the wishlist
const wishlistPath = path.join(__dirname, 'wishlist.json'); 

app.post('/add-to-wishlist', (req, res) => {
    const newBook = req.body;

    fs.readFile(wishlistPath, 'utf8', (err, data) => {
        let wishlist = [];
        try {
            wishlist = JSON.parse(data);
        } catch (e) {
            return res.status(500).json({ success: false, message: 'Error parsing wishlist JSON.' });
        }

        wishlist.push(newBook);

        fs.writeFile(wishlistPath, JSON.stringify(wishlist, null, 2), (err) => {
            res.json({ success: true, message: 'Book added successfully.' });
        });
    });
});

//get book from the json to display on my wishlist.html
app.get('/wishlist', (req, res) => {
    fs.readFile(wishlistPath, 'utf8', (err, data) => {
        try {
            const wishlist = JSON.parse(data);
            res.json(wishlist);
        } catch (e) {
            res.status(500).json({ success: false, message: 'Error parsing wishlist JSON.' });
        }
    });
});

// Route to delete a book from the wishlist
app.delete('/delete-from-wishlist/:index', (req, res) => {
    let index = parseInt(req.params.index); // Ensure it's an integer

    fs.readFile(wishlistPath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Error reading wishlist.' });
        }

        let wishlist = [];
        try {
            wishlist = JSON.parse(data);
        } catch (e) {
            return res.status(500).json({ success: false, message: 'Error parsing wishlist JSON.' });
        }

        // Ensure the index is valid
        if (index < 0 || index >= wishlist.length) {
            return res.status(400).json({ success: false, message: 'Invalid index.' });
        }

        // Remove the book at the specified index
        wishlist.splice(index, 1);

        fs.writeFile(wishlistPath, JSON.stringify(wishlist, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Error writing to wishlist.' });
            }
            res.json({ success: true, message: 'Book removed from wishlist.' });
        });
    });
});


// Start the server
app.listen(3000, () => {
    console.log(`Server running at http://localhost:3000`);
});
