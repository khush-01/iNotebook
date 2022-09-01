import { useState } from "react";
import NoteContext from "./NoteContext";

const NoteState = (props) => {
  const host = "http://localhost:5000";
  const notesInitial = [];
  const [notes, setNotes] = useState(notesInitial);

  // Get all notes
  const getNotes = async () => {
    // API Call
    const response = await fetch(`${host}/api/notes/fetchallnotes`, {
      method: "GET",
      headers: {
        "auth-token": localStorage.getItem("token"),
        "Content-Type": "application/json",
      },
    }).then((res) => res.json());

    // Client side
    setNotes(response);
  };

  // Add a note
  const addNote = async (title, description, tag) => {
    // API Call
    const data = { title, description };
    if (tag.length > 0) data[tag] = tag;

    const response = await fetch(`${host}/api/notes/addnote`, {
      method: "POST",
      headers: {
        "auth-token": localStorage.getItem("token"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((res) => res.json());

    // Client side
    setNotes(notes.concat(response));
  };

  // Delete a note
  const deleteNote = async (id) => {
    // API Call
    await fetch(`${host}/api/notes/deletenote/${id}`, {
      method: "DELETE",
      headers: {
        "auth-token": localStorage.getItem("token"),
        "Content-Type": "application/json",
      },
    }).then((res) => res.json());

    // Client side
    setNotes(notes.filter((note) => note._id !== id));
  };

  // Edit a note
  const editNote = async (id, title, description, tag) => {
    // API Call
    await fetch(`${host}/api/notes/updatenote/${id}`, {
      method: "PUT",
      headers: {
        "auth-token": localStorage.getItem("token"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, description, tag }),
    }).then((res) => res.json());

    // Client side
    const newNotes = JSON.parse(JSON.stringify(notes));
    for (let idx = 0; idx < newNotes.length; idx++) {
      const el = newNotes[idx];
      if (el._id === id) {
        newNotes[idx].title = title;
        newNotes[idx].description = description;
        newNotes[idx].tag = tag;
        break;
      }
    }
    setNotes(newNotes);
  };

  return (
    <NoteContext.Provider
      value={{ notes, getNotes, addNote, deleteNote, editNote }}
    >
      {props.children}
    </NoteContext.Provider>
  );
};

export default NoteState;
