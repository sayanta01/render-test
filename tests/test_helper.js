import Note from "../models/note.js";
import User from "../models/user.js";

const initialNotes = [
  { content: "HTML is easy", important: false },
  { content: "Browser can execute only JavaScript", important: true },
];

// creates then deletes a note, returns its ID for testing
const nonExistingId = async () => {
  const note = new Note({ content: "willremovethissoon" });
  await note.save();
  await note.deleteOne();

  return note._id.toString();
};

// fetch all notes as objects
const notesInDb = async () => {
  const notes = await Note.find({});
  return notes.map((note) => note.toJSON());
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((user) => user.toJSON());
};

export default {
  initialNotes,
  nonExistingId,
  notesInDb,
  usersInDb,
};
