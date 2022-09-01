import React, { useContext } from "react";
import { toast } from "react-toastify";
import NoteContext from "../context/notes/NoteContext";

const NoteItem = (props) => {
  const context = useContext(NoteContext);
  const { deleteNote } = context;
  const { note, updateNote } = props;

  return (
    <div className="col-md-3">
      <div className="card my-3">
        <div className="card-body">
          <div className="d-flex align-items-center justify-content-between">
            <h5 className="card-title">{note.title}</h5>
            <div>
              <i
                className="fa fa-sm fa-trash-can mx-2"
                onClick={() => {
                  deleteNote(note._id);
                  toast.success("Successfully deleted note");
                }}
              ></i>
              <i
                className="fa fa-sm fa-pen-to-square mx-2"
                onClick={() => updateNote(note)}
              ></i>
            </div>
          </div>
          <p className="card-text">{note.description}</p>
        </div>
      </div>
    </div>
  );
};

export default NoteItem;
