const express = require("express");
const { body, validationResult } = require("express-validator");

// Middleware Import
const fetchuser = require("../middleware/fetchuser");

// Database Import
const Note = require("../models/Note");

const router = express.Router();

// ROUTE 1: Get All the Notes using: GET "/api/notes/fetchallnotes" - Login required
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    // Find all the notes by user
    const notes = await Note.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// ROUTE 2: Add a new Note using: POST "/api/notes/addnote" - Login required
router.post(
  "/addnote",
  fetchuser,
  [
    body("title", "Enter a longer title").isLength({ min: 3 }),
    body("description", "Description must be atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    // Return Bad Request and error if error is encountered
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      const { title, description, tag } = req.body;
      // Create a new note
      const note = new Note({
        user: req.user.id,
        title,
        description,
        tag,
      });
      const savedNote = await note.save();
      res.json(savedNote);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

// ROUTE 3: Update an existing Note using: PUT "/api/notes/updatenote/:id" - Login required
router.put("/updatenote/:id", fetchuser, async (req, res) => {
  try {
    const { title, description, tag } = req.body;

    // Create a new note
    const newNote = {};
    if (title) newNote.title = title;
    if (description) newNote.description = description;
    if (tag) newNote.tag = tag;

    // Find the note to update
    let note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ error: "No such note found" });
    // Allow updation only if user owns the note
    if (note.user.toString() !== req.user.id)
      return res.status(401).json({ error: "User not authorised" });

    note = await Note.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    );
    res.json(note);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// ROUTE 4: Delete an existing Note using: PUT "/api/notes/deletenote/:id" - Login required
router.delete("/deletenote/:id", fetchuser, async (req, res) => {
  try {
    // Find the note to delete
    let note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ error: "No such note found" });
    // Allow deletion only if user owns the note
    if (note.user.toString() !== req.user.id)
      return res.status(401).json({ error: "User not authorised" });

    note = await Note.findByIdAndDelete(req.params.id);
    res.json({ success: "Note has been deleted", note });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
