const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();


// Register new user
public_users.post("/register", (req,res) => {

  const username = req.body.username;
  const password = req.body.password;

  if(!username || !password){
    return res.status(400).json({message:"Username and Password required"});
  }

  if(isValid(username)){
    users.push({username:username,password:password});
    return res.status(200).json({message:"User successfully registered"});
  } 
  else{
    return res.status(404).json({message:"User already exists"});
  }

});


// Get all books
public_users.get('/',function (req, res) {

  return res.status(200).json(books);

});


// Get book details by ISBN
public_users.get('/isbn/:isbn',function (req, res) {

  const isbn = req.params.isbn;
  return res.status(200).json(books[isbn]);

});


// Get books by author
public_users.get('/author/:author',function (req, res) {

  const author = req.params.author;

  let filtered_books = Object.values(books).filter(
    book => book.author === author
  );

  return res.status(200).json(filtered_books);

});


// Get books by title
public_users.get('/title/:title',function (req, res) {

  const title = req.params.title;

  let filtered_books = Object.values(books).filter(
    book => book.title === title
  );

  return res.status(200).json(filtered_books);

});


// Get book reviews
public_users.get('/review/:isbn',function (req, res) {

  const isbn = req.params.isbn;
  return res.status(200).json(books[isbn].reviews);

});


// ------------------------------
// Axios + Async APIs (Tasks 10–13)
// ------------------------------


// Get all books using Axios
public_users.get('/asyncbooks', async function(req,res){

  try{
    const response = await axios.get("http://localhost:5000/");
    res.send(response.data);
  }
  catch(error){
    res.status(500).json({message:"Error retrieving books"});
  }

});


// Get book by ISBN using Axios
public_users.get('/asyncisbn/:isbn', async function(req,res){

  try{
    const response = await axios.get(
      `http://localhost:5000/isbn/${req.params.isbn}`
    );
    res.send(response.data);
  }
  catch(error){
    res.status(500).json({message:"Error retrieving book"});
  }

});


// Get books by author using Axios
public_users.get('/asyncauthor/:author', async function(req,res){

  try{
    const response = await axios.get(
      `http://localhost:5000/author/${req.params.author}`
    );
    res.send(response.data);
  }
  catch(error){
    res.status(500).json({message:"Error retrieving books by author"});
  }

});


// Get books by title using Axios
public_users.get('/asynctitle/:title', async function(req,res){

  try{
    const response = await axios.get(
      `http://localhost:5000/title/${req.params.title}`
    );
    res.send(response.data);
  }
  catch(error){
    res.status(500).json({message:"Error retrieving books by title"});
  }

});


module.exports.general = public_users;