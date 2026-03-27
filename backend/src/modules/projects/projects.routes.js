import { Router } from "express";
import {
  createProjectController,
  deleteProjectController,
  getProjectsController,
  updateProjectController,
} from "./projects.controller.js";

const projectsRouter = Router();

projectsRouter.get("/", getProjectsController);
projectsRouter.post("/", createProjectController);
projectsRouter.put("/:id", updateProjectController);
projectsRouter.delete("/:id", deleteProjectController);

export default projectsRouter;
