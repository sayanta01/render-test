const Note = ({ note, toggleImportance }) => {
  const label = note.important ? "make not important" : "make important";

  return (
    // li className, to access the component in tests
    <li className="note">
      {note.content} <button onClick={toggleImportance}>{label}</button>
      <br></br>
    </li>
  );
};

export default Note;
