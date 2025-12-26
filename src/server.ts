import express from "express";
import { authRouter } from "./routes/auth.routes";
import { logger } from "./middleware/logger";
import { projectRouter } from "./routes/project.route";
import { errorMiddleware } from "./middleware/errorMiddleware";

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(logger);

app.use("/api/auth", authRouter);
app.use("/api/projects", projectRouter);

app.get("/api", (req, res) => {
  res.json({ msg: "Hello World!" });
});

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log("Server started!");
});
