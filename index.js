const express = require("express");
const mongoose = require("mongoose");
const app = express();

app.use(express.json());

const connect = () => {
  return mongoose.connect("mongodb://127.0.01:27017/library");
};

//create the section schema
const sectionSchema = new mongoose.Schema({
  section_name: { type: String, required: true },
});

//connect the schema to section collection
const Section = mongoose.model("section", sectionSchema);

//create schema for books
const bookSchema = new mongoose.Schema({
  name: { type: String, required: true },
  body: { tryp: String, required: true },
  section_name: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "section",
    required: true,
  },
});

//connect the schema to the books collection
const Book = mongoose.model("book", bookSchema);

//create schema for author
const authorSchema = new mongoose.Schema({
  author_name: { type: String, required: true },
});

//connect schema to the author collection
const Author = mongoose.model("author", authorSchema);

//create schema for book author
const bookAuthorSchema = new mongoose.Schema({
  book_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "book",
    required: true,
  },
  author_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "author",
    required: true,
  },
});

//connect the schema to book author collection
const BookAuthor = mongoose.model("bookAuthor", bookAuthorSchema);

//crud api for section
app.post("/section", async (req, res) => {
  const sec = await Section.create(req.body);
  return res.status(201).send({ sec });
});

app.get("/section", async (req, res) => {
  const sec = await Section.find().lean().exec();
  return res.status(200).send({ sec });
});

//api for author
app.post("/author", async (req, res) => {
  const author = await Author.create(req.body);
  return res.status(201).send({ author });
});

app.get("/author", async (req, res) => {
  const author = await Author.find().lean().exec();
  return res.status(200).send({ author });
});

//api for bookauthor
app.post("/bookauthor", async (req, res) => {
  const bookauthor = await BookAuthor.create(req.body);
  return res.status(201).send({ bookauthor });
});
app.get("/bookauthor", async (req, res) => {
  const bookauthor = await BookAuthor.lean().exec();
  return res.status(200).send({ bookauthor });
});

//all books written by an author
app.get("/booksbyauthor/:id", async (req, res) => {
    const match = await BookAuthor.find({ author_id: req.params.id }).lean().populate("book_id").exec();
    res.send(match)
});

//find books  in a section
app.get("/booksbysection/:id", async (req, res) => {
    const match = await Book.find({ section_name: req.params.id }).lean().populate("book_id").exec();
    res.send(match)
});
app.listen(4000, async (req, res) => {
  await connect();
  console.log("listening to port 4000");
});
