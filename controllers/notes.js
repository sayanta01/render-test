// All of the routes related to notes
import express from "express";
import jwt from "jsonwebtoken";
const notesRouter = express.Router(); // Accessing property of imported object
import Note from "../models/note.js";
import User from "../models/user.js";

// Make sure this middleware is used before the route handler
const getTokenFrom = (request) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.startsWith("Bearer ")) {
    return authorization.replace("Bearer ", ""); // keep only the token
  }
  return null;
};

notesRouter.get("/", async (request, response) => {
  const notes = await Note.find({}).populate("user", {
    username: 1,
    name: 1,
  });
  response.json(notes);
});

notesRouter.get("/:id", async (request, response) => {
  const note = await Note.findById(request.params.id);
  if (note) {
    response.json(note);
  } else {
    response.status(404).end();
  }
});

notesRouter.post("/", async (request, response) => {
  try {
    const body = request.body;

    // gets token & decode/verify it
    const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET);
    // check if token has user id
    if (!decodedToken.id) {
      return response.status(401).json({ error: "token invalid" });
    }

    const user = await User.findById(decodedToken.id); // find user in db
    if (!user) {
      return response
        .status(400)
        .json({ error: "user id missing or not valid" });
    }

    const note = new Note({
      content: body.content,
      important: body.important || false,
      user: user._id, // link note to user
    });

    const savedNote = await note.save(); // 📝 Note ➡️ User
    user.notes = user.notes.concat(savedNote._id); // save note id in user's notes list 👤 User ➡️ Notes
    await user.save();

    response.status(201).json(savedNote);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

notesRouter.patch("/:id", async (request, response, next) => {
  const { content, important } = request.body;

  try {
    const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET);
    if (!decodedToken.id) {
      return response.status(401).json({ error: "token invalid" });
    }

    const user = await User.findById(decodedToken.id); // find user in db
    if (!user) {
      return response
        .status(400)
        .json({ error: "user id missing or not valid" });
    }

    const note = await Note.findById(request.params.id);

    if (!note) {
      return response.status(404).end();
    }

    note.content = content;
    note.important = !note.important; // ✅ Toggle logic
    // note.important = important;

    const updatedNote = await note.save();
    response.json(updatedNote);
  } catch (error) {
    next(error);
  }
});

notesRouter.delete("/:id", async (request, response) => {
  try {
    const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET);
    if (!decodedToken.id) {
      return response.status(401).json({ error: "token invalid" });
    }

    const note = await Note.findById(request.params.id);
    if (!note) {
      return response.status(404).json({ error: "note not found" });
    }

    if (note.user.toString() !== decodedToken.id) {
      return response
        .status(403)
        .json({ error: "only the owner can delete the notes" });
    }

    await Note.findByIdAndDelete(request.params.id);
    response.status(204).end(); // .end() is important
  } catch (error) {
    console.error("DELETE /api/notes/:id error:", error.message);
    // next(error); // Runs the next middleware that handles errors params
  }
});

export default notesRouter;
