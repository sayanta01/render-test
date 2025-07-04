import { useState } from "react";

const NoteForm = ({ createNote }) => {
  const [newNote, setNewNote] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    // const addNote = (noteObject) => {}
    // =
    createNote({
      content: newNote,
      important: true,
    });
    setNewNote("");
  };

  return (
    <div>
      <h2>Create a new note</h2>

      <form onSubmit={handleSubmit}>
        <input value={newNote} onChange={(e) => setNewNote(e.target.value)} />
        <button type="submit">save</button>
      </form>
    </div>
  );
};

export default NoteForm;
