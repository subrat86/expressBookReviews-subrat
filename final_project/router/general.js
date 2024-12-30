const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
    const username = req.body.username;
    const password = req.body.password;
    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!doesExist(username)) {
            // Add the new user to the users array
            users.push(
                {"username": username, "password": password}
            );
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    return res.status(200).send(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    return res.status(200).send(JSON.stringify(books[isbn]));
  });
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    try {
      const author = req.params.author;
      let author_clean = author.replaceAll("+", " ")
  
      const booksArray = Object.values(books);
      let filtered_books = booksArray.filter((book) => book.author === author_clean);
      return res.status(200).send(filtered_books[0]);
  
    } catch (error) {
      console.error("Error found: ", error);
      return res.status(404).send("author error");
    }
  });

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    try {
      const title = req.params.title;
      let title_clean = title.replaceAll("+", " ")
  
      const booksArray = Object.values(books);
      let filtered_books = booksArray.filter((book) => book.title === title_clean);
      return res.status(200).send(filtered_books[0]);
  
    } catch (error) {
      console.error("Error found: ", error);
      return res.status(404).send("title error");
    }
  });

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    return res.status(200).send(JSON.stringify(books[isbn].reviews));
  });

module.exports.general = public_users;
