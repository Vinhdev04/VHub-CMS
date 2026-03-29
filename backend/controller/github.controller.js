import { fetchGitHubRepos } from '../helpers/github.api.js';
import { successResponse } from '../helpers/apiResponse.js';

export async function getGitHubReposController(req, res, next) {
  try {
    const { username } = req.query;
    if (!username) {
      return res.status(400).json({ ok: false, message: 'Vui lòng cung cấp GitHub username.' });
    }

    const repos = await fetchGitHubRepos(username);
    return res.json(successResponse(repos, `Lấy dữ liệu từ ${username} thành công.`));
  } catch (error) {
    return next(error);
  }
}
