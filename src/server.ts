import express from "express";
import { authRouter } from "./routes/auth.route";
import { logger } from "./middleware/logger";
import { projectRouter } from "./routes/project.route";
import { errorMiddleware } from "./middleware/errorMiddleware";
import { taskRouter } from "./routes/task.route";
import cookieParser from "cookie-parser";
import { authMiddleware } from "./middleware/authMiddleware";
import cors from "cors";

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cookieParser());
app.use(logger);
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  }),
);

app.use("/api/auth", authRouter);
app.use("/api/projects", authMiddleware, projectRouter);
app.use("/api/tasks", authMiddleware, taskRouter);

app.get("/api", (req, res) => {
  res.json({ msg: "Hello World!" });
});

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log("Server started!");
});
