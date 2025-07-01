// import "express-async-errors";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";
import config from "./utils/config.js";
import logger from "./utils/logger.js";
import middleware from "./utils/middleware.js";
import notesRouter from "./controllers/notes.js";
import usersRouter from "./controllers/users.js";
import loginRouter from "./controllers/login.js";

const app = express();

mongoose.set("strictQuery", false);

logger.info("🔌 Connecting... to Database");
mongoose
  .connect(config.MONGODB_URI)
  .then(() => logger.info("🟢 Connected to MongoDB"))
  .catch((error) =>
    logger.error("❌ Error connecting to MongoDB:", error.message),
  );

app.use(express.static("dist")); // serving static frontend files at /
app.use(express.json()); // json-parser is listed before requestLogger, or request.body will be undefined when the logger runs
app.use(middleware.requestLogger);
app.use(cors());
app.use(morgan("tiny"));

app.use("/api/notes", notesRouter); // 🧪
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

export default app;
