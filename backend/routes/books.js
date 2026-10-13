import express from "express";
import mongoose from "mongoose";
import Book from "../models/Book.js";

const router = express.Router();

// GET /books - সব বই দেখাও
router.get("/", async (req, res, next) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });

    res.status(200).json(books);
  } catch (error) {
    next(error);
  }
});

// POST /books - নতুন বই যোগ করো
router.post("/", async (req, res, next) => {
  try {
    const title =
      typeof req.body.title === "string" ? req.body.title.trim() : "";
    const author =
      typeof req.body.author === "string" ? req.body.author.trim() : "";

    if (!title || !author) {
      return res.status(400).json({
        message: "Title and author are required",
      });
    }

    const book = await Book.create({ title, author });

    res.status(201).json(book);
  } catch (error) {
    next(error);
  }
});

// PATCH /books/:id - বইয়ের তথ্য সম্পাদনা করো
router.patch("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid book ID" });
    }
    const title = typeof req.body.title === "string" ? req.body.title.trim() : "";
    const author = typeof req.body.author === "string" ? req.body.author.trim() : "";
    if (!title || !author) {
      return res.status(400).json({ message: "Title and author are required" });
    }
    const book = await Book.findByIdAndUpdate(
      id,
      { $set: { title, author } },
      { new: true, runValidators: true }
    );
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.status(200).json(book);
  } catch (error) { next(error); }
});

// PUT /books/:id - বই Read হিসেবে চিহ্নিত করো
router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid book ID" });
    }

    const book = await Book.findByIdAndUpdate(
      id,
      { $set: { status: "read" } },
      { new: true, runValidators: true }
    );

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.status(200).json(book);
  } catch (error) {
    next(error);
  }
});

// DELETE /books/:id - বই মুছে ফেলো
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid book ID" });
    }

    const book = await Book.findByIdAndDelete(id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.status(200).json({
      message: "Book deleted successfully",
      id: book.id,
    });
  } catch (error) {
    next(error);
  }
});

export default router;