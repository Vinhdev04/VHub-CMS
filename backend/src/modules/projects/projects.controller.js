import { successResponse } from "../../shared/utils/apiResponse.js";
import { getProjectList } from "./projects.service.js";

export async function getProjectsController(req, res, next) {
  try {
    const projects = await getProjectList();
    return res.json(successResponse(projects, "Fetch projects successfully"));
  } catch (error) {
    return next(error);
  }
}
