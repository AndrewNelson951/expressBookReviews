const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    let result = users.some((obj) => obj.username === username);
    return result;
}

const authenticatedUser = (username,password)=>{ //returns boolean
    return users.some((obj) => obj.username===username && obj.password===password)
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (!username || !password) {
      return res.status(404).json({ message: "Error logging in" });
    }
  
    if (authenticatedUser(username, password)) {
      let accessToken = jwt.sign({
        data: username
      }, 'access', { expiresIn: 60 * 60 });
  
      req.session.authorization = {
        accessToken, username
      };
      return res.status(200).send("User successfully logged in");
    } else {
      return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});


// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;
    const { review } = req.body;
    const sessionData = req.session.authorization;
    if (!sessionData || !sessionData.accessToken) {
        return res.status(401).json({ message: 'Unauthorized: No token found' });
    }
    const decoded = jwt.verify(token, 'access'); // Use your secret key
    const username = decoded.data; // Attach the username to the request object
    books[isbn].reviews[username] = review;
    return res.status(200).json({message: "Review added"});
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    console.log("Deleting...");
    const { isbn } = req.params;
    const sessionData = req.session.authorization;
    if (!sessionData || !sessionData.accessToken) {
        return res.status(401).json({ message: 'Unauthorized: No token found' });
    }
    const decoded = jwt.verify(token, 'access'); // Use your secret key
    const username = decoded.data; // Attach the username to the request object

    if (books[isbn] && books[isbn].reviews && username in books[isbn].reviews) {
        delete books[isbn].reviews[username];
        return res.status(200).json({message: "Review deleted"});
    }
    return res.status(500).json({ message: "Review not found" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
