import { useState, useEffect, useRef } from "react";
import Note from "./components/Note";
import LoginForm from "./components/Login";
import SignupForm from "./components/Signup";
import NoteForm from "./components/NoteForm";
import Togglable from "./components/Togglable";
import Notification from "./components/Notification";
import Footer from "./components/Footer";
import noteService from "./services/notes";
import loginService from "./services/login";
import signupService from "./services/signup";

function App() {
  const [notes, setNotes] = useState([]);
  // const [newNote, setNewNote] = useState("");
  const [showAll, setShowAll] = useState(true);
  const [message, setMessage] = useState(null);
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const noteFormRef = useRef();

  useEffect(() => {
    noteService.getAll().then((initialNotes) => {
      setNotes(initialNotes); // fetch notes from the server and update the state
    });
  }, []); // specify when the effect runs

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedNoteAppUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      noteService.setToken(user.token);
    }
  }, []); // executed only when the component is rendered for the first time

  const addNote = (noteObject) => {
    // event.preventDefault();
    //
    // const noteObject = {
    //   content: newNote,
    //   important: Math.random() < 0.5,
    // };
    //
    noteFormRef.current.toggleVisibility();
    noteService.create(noteObject).then((response) => {
      setNotes(notes.concat(response));
      setMessage({ text: "Note Added", type: "success" });
      setTimeout(() => {
        setMessage(null);
      }, 2000);
    });
  };

  const toggleImportanceOf = (id) => {
    const note = notes.find((n) => n.id === id);
    // Avoids mutating objects directly
    // Create full copy of the note, but with one field (important) changed
    const updateNote = { ...note, important: !note.important };

    noteService
      .update(id, updateNote)
      .then((updatedNote) => {
        setNotes(notes.map((n) => (n.id === id ? updatedNote : n)));
      })
      .catch((error) => {
        console.log(error);
        setMessage({
          text: `Note '${note.content}' was already removed from server`,
          type: "error",
        });
        setTimeout(() => {
          setMessage(null);
        }, 3000);

        // setNotes(notes.filter((n) => n.id !== id));
      });
  };

  // const handleNoteChange = (event) => {
  //   setNewNote(event.target.value);
  // };

  // Responsible for handling the data in the form
  const handleLogin = async (event) => {
    event.preventDefault(); // don't reload the whole page ❌

    try {
      const user = await loginService.login({
        username,
        password,
      });
      window.localStorage.setItem("loggedNoteAppUser", JSON.stringify(user));
      noteService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
    } catch (error) {
      setMessage("Wrong credentials");
      setTimeout(() => {
        setMessage(null);
      }, 5000);
    }
  };

  const handleSignup = async (event) => {
    event.preventDefault(); // don't reload the whole page ❌

    try {
      const user = await signupService.signup({
        fullName,
        username,
        password,
      });
      // window.localStorage.setItem("loggedNoteAppUser", JSON.stringify(user));
      // noteService.setToken(user.token);
      setUser(user);
      setFullName("");
      setUsername("");
      setPassword("");
    } catch (error) {
      setMessage("Something is Wrong");
      setTimeout(() => {
        setMessage(null);
      }, 5000);
    }
  };

  const notesToShow = showAll ? notes : notes.filter((note) => note.important);

  const noteForm = () => (
    <Togglable ref={noteFormRef} buttonLabel="new note">
      <NoteForm createNote={addNote} />
    </Togglable>
    //   <NoteForm
    //     value={newNote}
    //     onChnage={handleNoteChange}
    //     onSubmit={addNote}
    //   />
  );

  return (
    <>
      <h1>Notes</h1>
      <Notification message={message} />

      {user === null ? (
        <div>
          <h2>Login</h2>
          {/* {loginForm()} */}
          <Togglable buttonLabel="login">
            <LoginForm
              username={username}
              password={password}
              handleUsernameChange={({ target }) => setUsername(target.value)}
              handlePasswordChange={({ target }) => setPassword(target.value)}
              handleSubmit={handleLogin}
            />
          </Togglable>

          <Togglable buttonLabel="signup">
            <SignupForm
              fullname={fullName}
              username={username}
              password={password}
              handleFullnameChange={({ target }) => setFullName(target.value)}
              handleUsernameChange={({ target }) => setUsername(target.value)}
              handlePasswordChange={({ target }) => setPassword(target.value)}
              handleSubmit={handleSignup}
            />
          </Togglable>
        </div>
      ) : (
        <div>
          {/* if the user is logged in, their name is shown on the screen */}
          <p>
            {user.name} logged-in
            <button
              onClick={() => {
                window.localStorage.removeItem("loggedNoteAppUser");
                setUser(null);
                setMessage({
                  text: "Logged out successfully",
                  type: "success",
                });
                setTimeout(() => {
                  setMessage(null);
                }, 5000);
              }}
            >
              logout
            </button>
          </p>
          {noteForm()}

          <ul className="note">
            {notesToShow.map((note) => (
              <Note
                key={note.id}
                note={note}
                toggleImportance={() => toggleImportanceOf(note.id)}
              />
            ))}
          </ul>
          <div>
            <button onClick={() => setShowAll(!showAll)}>
              show {showAll ? "important" : "all"}
            </button>
          </div>
        </div>
      )}

      {/* <form onSubmit={addNote}> */}
      {/*   <input value={newNote} onChange={(e) => setNewNote(e.target.value)} /> */}
      {/*   <button type="submit">save</button> */}
      {/* </form> */}
      <Footer />
    </>
  );
}

export default App;
