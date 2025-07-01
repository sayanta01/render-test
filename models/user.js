import mongoose from "mongoose";

// The ids of the notes are stored within the user document as an array of Mongo ids
// Create a note, get its ID, and save that ID in the user's notes list
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true, // this ensures the uniqueness of username
  },
  name: String,
  passwordHash: String,
  // this need to be in array to have multiple notes per user
  notes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Note",
    },
  ],
});

userSchema.set("toJSON", {
  transform: (document, returnObject) => {
    returnObject.id = returnObject._id.toString();
    delete returnObject.__id;
    delete returnObject.__v;
    delete returnObject.passwordHash;
  },
});

const User = mongoose.model("User", userSchema);

export default User;
