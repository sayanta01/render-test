import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    minLength: 2,
    required: true,
  },
  important: Boolean,
  // The information about the user who created it
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

// Converts BSON to JSON
noteSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

export default mongoose.model("Note", noteSchema);
