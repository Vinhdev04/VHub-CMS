import { Router } from "express";
import { getProjectsController } from "./projects.controller.js";

const projectsRouter = Router();

projectsRouter.get("/", getProjectsController);

export default projectsRouter;
