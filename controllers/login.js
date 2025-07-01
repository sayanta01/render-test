import jwt from "jsonwebtoken"; // create token after login
import bcrypt from "bcrypt";
import express from "express";
const loginRouter = express.Router();
import User from "../models/user.js";

loginRouter.post("/", async (request, response) => {
  const { username, password } = request.body;

  const user = await User.findOne({ username });
  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user.passwordHash);

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: "invalid username or password", // 401 Unauthorized
    });
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  };

  const token = jwt.sign(userForToken, process.env.SECRET, {
    // expiresIn: 60 * 60, // token expires in one hour
  });

  response
    .status(200)
    .send({ token, username: user.username, name: user.name });
});

export default loginRouter;
