const Note = ({ note, toggleImportance }) => {
  const label = note.important ? "make not important" : "make important";

  return (
    <>
      {note.content} <button onClick={toggleImportance}>{label}</button>
      <br></br>
    </>
  );
};

export default Note;
