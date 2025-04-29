import express, { json } from "express";
import morgan from "morgan";
import cors from "cors";
const app = express();

app.use(express.static("dist"));
app.use(cors());
app.use(morgan("tiny"));

let notes = [
  {
    id: "1",
    content: "HTML is easy & Browser can execute only JavaScript",
    important: false,
  },
  {
    id: "2",
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true,
  },
];

// json-parser is listed before requestLogger, because otherwise request.body will not be initialized when the logger is executed!
app.use(json());

// app.get("/", (req, res) => {
//   res.send("API is Running...");
// });

app.get("/api/notes", (req, res) => {
  res.json(notes);
  // res.send("<h1>Hello World!</h1>");
});

app.get("/api/notes/:id", (req, res) => {
  const id = req.params.id; // 💡
  const note = notes.find((note) => note.id === id);
  // console.log(req.params); // request object that contains route parameters

  if (note) {
    res.json(note);
  } else {
    res.status(404).end("4O4"); // ends the response with no body
  }
});

app.delete("/api/notes/:id", (req, res) => {
  const id = req.params.id;
  notes = notes.filter((note) => note.id !== id); // keep notes that didn't match with the `id`
  res.status(204).end();
});

const generateId = () => {
  const maxId =
    notes.length > 0 ? Math.max(...notes.map((n) => Number(n.id))) : 0;

  return String(maxId + 1);
};

app.post("/api/notes", (req, res) => {
  // console.log(req.headers); // print all headers from the request

  const body = req.body;

  if (!body.content) {
    // return is important - it stops the code right here
    return res.status(400).json({ error: "content missing" });
  }

  const note = {
    content: body.content,
    important: body.important || false,
    id: generateId(),
  };

  notes = notes.concat(note);
  res.json(note);
  // console.log(note);
});

// The process is global object that provides information about the current Node.js process
const port = process.env.PORT || 3001; // PORT that Render tells your app to use & fallback
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
