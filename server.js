import express from "express";
import morgan from "morgan";
import cors from "cors";
import Note from "./models/note.js";
const app = express();

app.use(express.static("dist"));
// json-parser is listed before requestLogger, or request.body will be undefined when the logger runs
app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));

// let notes = [
//   {
//     id: "1",
//     content: "HTML is easy & Browser can execute only JavaScript",
//     important: false,
//   },
//   {
//     id: "2",
//     content: "GET and POST are the most important methods of HTTP protocol",
//     important: true,
//   },
// ];

// app.get("/", (req, res) => {
//   res.send("API is Running...");
// });

app.get("/api/notes", (request, response) => {
  Note.find({}).then((notes) => {
    response.json(notes);
    // res.send("<h1>Hello World!</h1>");
  });
});

// Fetching an individual note
app.get("/api/notes/:id", (request, response) => {
  Note.findById(request.params.id)
    .then((note) => {
      if (note) {
        response.json(note);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
  // .catch((error) => {
  //   console.log(error); // never a bad idea to print the object that caused the exception
  //   response.status(400).send({ error: "malformatted id" });
  //   // response.status(500).end();
  // });
});
// app.get("/api/notes/:id", (req, res) => {
//   const id = req.params.id; // 💡
//   const note = notes.find((note) => note.id === id);
//   // console.log(req.params); // request object that contains route parameters
//
//   if (note) {
//     res.json(note);
//   } else {
//     res.status(404).end("4O4"); // ends the response with no body
//   }
// });

// const generateId = () => {
//   const maxId =
//     notes.length > 0 ? Math.max(...notes.map((n) => Number(n.id))) : 0;
//
//   return String(maxId + 1);
// };

app.post("/api/notes", (request, response, next) => {
  // console.log(request.headers); // print all headers from the request

  const body = request.body;

  if (!body.content) {
    // return is important - it stops the code right here
    return response.status(400).json({ error: "content missing" });
  }

  // The note objects are created with the Note constructor function
  const note = new Note({
    content: body.content,
    important: body.important || false,
  });

  // Save the note to the database and return a Promise that resolves with the saved contact
  note
    .save()
    .then((savedNote) => {
      // Send the saved note back to the client as JSON when done
      response.json(savedNote); // automatically converts to JSON with JSON.stringify(savedNote) under the hood
    })
    .catch((error) => next(error));

  // const note = {
  //   content: body.content,
  //   important: body.important || false,
  //   id: generateId(),
  // };

  // notes = notes.concat(note);
  // res.json(note);
  // console.log(note);
});

app.put("/api/notes/:id", (request, response, next) => {
  const { content, important } = request.body;

  Note.findByIdAndUpdate(
    request.params.id,
    { content, important },
    { new: true, runValidators: true, context: "query" },
  )
    .then((updatedNote) => {
      response.json(updatedNote);
    })
    .catch((error) => next(error));
  // .catch((error) => {
  //   response.status(400).json({ error: error.message });
  // });
});

// app.delete("/api/notes/:id", (req, res) => {
//   const id = req.params.id;
//   notes = notes.filter((note) => note.id !== id); // keep notes that didn't match with the `id`
//   res.status(204).end();
// });

app.delete("/api/notes/:id", (request, response, next) => {
  Note.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end(); // 204 No Content (successful deletion)
    })
    .catch((error) => next(error));
  // .catch((error) => {
  //   res.status(400).json({ error: error.message });
  // });
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint); // handler of requests with unknown endpoint

// ERROR-HANDLING MIDDLEWARE (must be after all routes)
const errorHandler = (error, request, response, next) => {
  console.log(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    // Triggered when data you try to save doesn’t meet schema’s validation rules
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

app.use(errorHandler); // handler of requests with result to errors

// The process is global object that provides information about the current Node.js process
const port = process.env.PORT || 3001; // PORT that Render tells your app to use & fallback
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
