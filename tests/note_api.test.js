import { test, after, beforeEach, describe } from "node:test";
import assert from "node:assert";
import mongoose from "mongoose";
import supertest from "supertest";
import app from "../app.js";
import Note from "../models/note.js";
import helper from "../tests/test_helper.js";
import bcrypt from "bcrypt";
import User from "../models/user.js";

const api = supertest(app); // similar to axios but more chainable

describe("when there is initially some notes saved", () => {
  // beforeEach(async () => {
  //   await Note.deleteMany({});
  //   // better way of saving multiple objects to the database
  //   await Note.insertMany(helper.initialNotes);
  // });
  // test.only("notes are returned as json", async () => {
  //   console.log("entered test");
  //   await api
  //     .get("/api/notes")
  //     .expect(200)
  //     .expect("Content-Type", /application\/json/);
  // });
  // test("all notes are returned", async () => {
  //   const response = await api.get("/api/notes");
  //   assert.strictEqual(response.body.length, helper.initialNotes.length);
  // });
  // test("a specific note is within the returned notes", async () => {
  //   const response = await api.get("/api/notes");
  //
  //   const contents = response.body.map((e) => e.content);
  //   assert(contents.includes("HTML is easy"));
  // });
});

describe("viewing a specific note", () => {
  // test("a specific note can be viewed", async () => {
  //   const notesAtStart = await helper.notesInDb();
  //   const noteToView = notesAtStart[0];
  //
  //   const resultNote = await api
  //     .get(`/api/notes/${noteToView.id}`)
  //     .expect(200)
  //     .expect("Content-Type", /application\/json/);
  //
  //   assert.deepStrictEqual(resultNote.body, noteToView);
  // });
});

describe("addition of a new note", () => {
  // test("a valid note can be added", async () => {
  //   const newNote = {
  //     content: "async/await simplifies making async calls",
  //     important: true,
  //   };
  //
  //   await api
  //     .post("/api/notes")
  //     .send(newNote)
  //     .expect(200)
  //     .expect("Content-Type", /application\/json/);
  //
  //   const notesAtEnd = await helper.notesInDb();
  //   assert.strictEqual(notesAtEnd.length, helper.initialNotes.length + 1);
  //
  //   const contents = notesAtEnd.map((n) => n.content);
  //   assert(contents.includes("async/await simplifies making async calls"));
  // });
  // test("note without content is not added", async () => {
  //   const newNote = {
  //     important: true,
  //   };
  //
  //   await api.post("/api/notes").send(newNote).expect(400);
  //
  //   const notesAtEnd = await helper.notesInDb();
  //   assert.strictEqual(notesAtEnd.length, helper.initialNotes.length);
  // });
});
describe("deletion of a note", () => {
  // test("a note can be deleted", async () => {
  //   const notesAtStart = await helper.notesInDb();
  //   const noteToDelete = notesAtStart[0];
  //
  //   await api.delete(`/api/notes/${noteToDelete.id}`).expect(204);
  //
  //   const notesAtEnd = await helper.notesInDb();
  //
  //   const contents = notesAtEnd.map((n) => n.content);
  //   assert(!contents.includes(noteToDelete.content));
  //   assert.strictEqual(notesAtEnd.length, helper.initialNotes.length - 1);
  // });
});

describe("when there is initially one user in db", () => {
  beforeEach(async () => {
    // Adds a user with the username root to the database
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash("sekret", 10);
    const user = new User({ username: "root", passwordHash });

    await user.save();
  });

  test("creation succeeds with a fresh username", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "bot",
      name: "Sayanta",
      password: "pswd",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    assert(usernames.includes(newUser.username));
  });

  // verifies that a new user with the same username can not be created
  test("creation fails with proper statuscode and message if username already taken", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "root",
      name: "Superuser",
      password: "pswd",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert(result.body.error.includes("expected `username` to be unique"));

    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });
});

// Close the database connection after all the tests have finished
after(async () => {
  await mongoose.connection.close();
});
