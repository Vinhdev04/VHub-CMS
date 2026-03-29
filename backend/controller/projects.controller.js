import { successResponse } from '../helpers/apiResponse.js';
import {
  getProjectDetail,
  getProjectList,
  createProjectItem,
  updateProjectItem,
  deleteProjectItem,
} from '../helpers/projects.service.js';

export async function getProjectsController(req, res, next) {
  try {
    const projects = await getProjectList();
    return res.json(successResponse(projects, 'Fetch projects successfully'));
  } catch (error) {
    return next(error);
  }
}

export async function getProjectDetailController(req, res, next) {
  try {
    const project = await getProjectDetail(req.params.id);
    return res.json(successResponse(project, 'Lay chi tiet du an thanh cong'));
  } catch (error) {
    return next(error);
  }
}

export async function createProjectController(req, res, next) {
  try {
    const project = await createProjectItem(req.body);
    return res.status(201).json(successResponse(project, 'Tạo dự án thành công'));
  } catch (error) {
    return next(error);
  }
}

export async function updateProjectController(req, res, next) {
  try {
    const project = await updateProjectItem(req.params.id, req.body);
    return res.json(successResponse(project, 'Cập nhật dự án thành công'));
  } catch (error) {
    return next(error);
  }
}

export async function deleteProjectController(req, res, next) {
  try {
    const result = await deleteProjectItem(req.params.id);
    return res.json(successResponse(result, 'Xóa dự án thành công'));
  } catch (error) {
    return next(error);
  }
}
