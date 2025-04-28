import { useState, useEffect } from "react";
// import axios from "axios";
import Note from "./components/Note";
import Notification from "./components/Notification";
import Footer from "./components/Footer";
import noteService from "./services/notes";

function App() {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [showAll, setShowAll] = useState(true);
  const [message, setMessage] = useState({
    text: "some error happened...",
    type: null,
  });

  useEffect(() => {
    noteService.getAll().then((initialNotes) => {
      setNotes(initialNotes); // fetch notes from the server and update the state
    });
  }, []); // specify how often the effect is run

  const addNote = (event) => {
    event.preventDefault();

    const noteObject = {
      content: newNote,
      important: Math.random() < 0.5,
    };

    noteService.create(noteObject).then((response) => {
      setNotes(notes.concat(response.data));
      setMessage({ text: "Note Added", type: "success" });
      setTimeout(() => {
        setMessage(null);
      }, 2000);
      setNewNote("");
    });
  };

  const toggleImportanceOf = (id) => {
    const note = notes.find((n) => n.id === id);
    const changedNote = { ...note, important: !note.important };

    noteService
      .update(id, changedNote)
      .then((response) => {
        setNotes(notes.map((n) => (n.id === id ? response.data : n)));
      })
      .catch((error) => {
        setMessage({
          text: `Note '${note.content}' was already removed from server`,
          type: "error",
        });
        setTimeout(() => {
          setMessage(null);
        }, 4000);
        setNotes(notes.filter((n) => n.id !== id));
      });
  };

  const notesToShow = showAll ? notes : notes.filter((note) => note.important);

  return (
    <>
      <h1>Notes</h1>
      <Notification message={message} />

      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? "important" : "all"}
        </button>
      </div>

      <ul className="note">
        {notesToShow.map((note) => (
          <Note
            key={note.id}
            note={note}
            toggleImportance={() => toggleImportanceOf(note.id)}
          />
        ))}
      </ul>

      <form onSubmit={addNote}>
        <input value={newNote} onChange={(e) => setNewNote(e.target.value)} />
        <button type="submit">save</button>
      </form>
      <Footer />
    </>
  );
}

export default App;
