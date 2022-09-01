import React, { useContext, useEffect, useState } from "react";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import NoteContext from "../context/notes/NoteContext";
import NoteItem from "./NoteItem";

const Notes = () => {
  const navigate = useNavigate();
  const context = useContext(NoteContext);
  const { notes, getNotes, editNote } = context;
  const ref = useRef(null);
  const refClose = useRef(null);

  const [note, setNote] = useState({
    id: "",
    title: "",
    description: "",
    tag: "",
  });

  const onChange = (e) => {
    setNote({ ...note, [e.target.id]: e.target.value });
  };

  const updateNote = (currentnote) => {
    ref.current.click();
    setNote({
      id: currentnote._id,
      title: currentnote.title,
      description: currentnote.description,
      tag: currentnote.tag,
    });
  };

  const onUpdateNote = (e) => {
    e.preventDefault();
    editNote(note.id, note.title, note.description, note.tag);
    refClose.current.click();
    toast.success("Successfully updated note");
  };

  useEffect(() => {
    if (localStorage.getItem("token")) getNotes();
    else navigate("/login");
    // eslint-disable-next-line
  }, []);

  return (
    <div className="row my-3">
      <button
        ref={ref}
        className="d-none"
        type="button"
        data-bs-toggle="modal"
        data-bs-target="#editModal"
      />
      <div id="editModal" className="modal" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit Note</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">
                    Title
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    value={note.title}
                    onChange={onChange}
                    required
                    minLength={3}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    Description
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="description"
                    value={note.description}
                    onChange={onChange}
                    required
                    minLength={5}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="tag" className="form-label">
                    Tag
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="tag"
                    value={note.tag}
                    onChange={onChange}
                  />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                ref={refClose}
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                disabled={note.title.length < 3 || note.description.length < 5}
                type="button"
                className="btn btn-primary"
                onClick={onUpdateNote}
              >
                Update Note
              </button>
            </div>
          </div>
        </div>
      </div>
      <h2>Your Notes</h2>
      {notes.map((note) => (
        <NoteItem key={note._id} updateNote={updateNote} note={note} />
      ))}
      {notes.length === 0 && (
        <div className="m-2 display-6">No notes to display</div>
      )}
    </div>
  );
};

export default Notes;
