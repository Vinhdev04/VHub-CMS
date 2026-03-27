import cors from "cors";
import express from "express";
import blogRouter from "./modules/blog/blog.routes.js";
import projectsRouter from "./modules/projects/projects.routes.js";
import { errorMiddleware } from "./shared/middlewares/error.middleware.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_, res) => res.json({ ok: true }));
app.use("/api/projects", projectsRouter);
app.use("/api/blog-posts", blogRouter);

app.use(errorMiddleware);

export default app;
