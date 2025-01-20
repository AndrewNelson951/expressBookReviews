const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  let username = req.body.username;
  let password = req.body.password;
  if (isValid(username)) {
    return res.status(500).json({message: "Username already exists, choose another."});
  }

  users.push({username:username, password:password})
  return res.status(200).json({message: "User " + username + " added."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
    res.status(200).send(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = parseInt(req.params.isbn);
  //return res.status(300).json({message: "Yet to be implemented"});
  return res.status(200).send(JSON.stringify(books[isbn]));
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    //Write your code here
    const author = req.params.author;
    let key = null;
    for ([key, value] of Object.entries(books)) {
        if (value.author === author) {
            break;
        }
    }
    if (key === null) {
        return res.status(200).json({ message: "Author not found"});
    }
    return res.status(200).send(books[key]);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    //Write your code here
    const title = req.params.title;
    let key = null;
    for ([key, value] of Object.entries(books)) {
        if (value.title === title) {
            break;
        }
    }
    if (key === null) {
        return res.status(200).json({ message: "Title not found"});
    }
    return res.status(200).send(books[key]);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = parseInt(req.params.isbn);
  //return res.status(300).json({message: "Yet to be implemented"});
  return res.status(200).send(JSON.stringify(books[isbn].review));
 });

module.exports.general = public_users;
