import { successResponse } from '../helpers/apiResponse.js';
import {
  getProjectDetail,
  getProjectList,
  createProjectItem,
  updateProjectItem,
  deleteProjectItem,
} from '../helpers/projects.service.js';

import { fetchGitHubCommits } from '../helpers/github.api.js';

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
    
    // Nếu có GitHub URL, lấy thêm commit stats
    if (project?.githubUrl && project.githubUrl.includes('github.com')) {
      try {
        const parts = project.githubUrl.split('github.com/')[1]?.split('/');
        if (parts && parts[0] && parts[1]) {
          const commits = await fetchGitHubCommits(parts[0], parts[1]);
          project.commits = commits;
        }
      } catch (err) {
        project.commits = [];
      }
    }
    
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
