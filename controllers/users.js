// Router for user-related routes. Use this in app.js
// So it handles requests made to the /api/users url
import bcrypt from "bcrypt";
import express from "express";
import jwt from "jsonwebtoken";
const usersRouter = express.Router();
import User from "../models/user.js";

const getTokenFrom = (request) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.startsWith("Bearer ")) {
    return authorization.replace("Bearer ", ""); // keep only the token
  }
  return null;
};

usersRouter.get("/", async (request, response) => {
  const users = await User.find({}).populate("notes", {
    content: 1,
    important: 1,
    username: 1,
    name: 1,
  });
  response.json(users);
});

usersRouter.post("/", async (request, response) => {
  const { username, name, password } = request.body;

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    name,
    passwordHash,
  });

  const savedUser = await user.save();
  response.status(201).json(savedUser);
});

usersRouter.delete("/:id", async (request, response) => {
  try {
    const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET); // 👤
    if (!decodedToken.id) {
      return response.status(401).json({ error: "token invalid" });
    }

    const user = await User.findById(request.params.id);
    if (!user) {
      return response.status(404).json({ error: "user not found" });
    }

    if (user.id !== decodedToken.id) {
      return response
        .status(403)
        .json({ error: "only the owner can delete the account" });
    }

    await User.findByIdAndDelete(request.params.id);
    response.status(204).end();
  } catch (error) {
    console.error("DELETE /api/users/:id error:", error.message);
    return response.status(500).json({ error: "internal server error" });
  }
});

export default usersRouter;
