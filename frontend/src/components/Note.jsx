const Note = ({ note, toggleImportance }) => {
  const label = note.important ? "make not important" : "make important";

  return (
    // li className, that could be used to access the component in our tests
    <li className="note">
      {note.content} <button onClick={toggleImportance}>{label}</button>
      <br></br>
    </li>
  );
};

export default Note;
