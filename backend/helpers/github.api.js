import fetch from 'node-fetch';

/**
 * Fetch GitHub repositories for a specific user
 * @param {string} username GitHub username
 * @returns {Promise<Array>} List of repositories
 */
export async function fetchGitHubRepos(username) {
  if (!username) throw new Error('Cần cung cấp GitHub username.');

  try {
    const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'VHub-CMS-Backend'
      }
    });

    if (!response.ok) {
      if (response.status === 404) throw new Error('Không tìm thấy người dùng GitHub này.');
      throw new Error(`GitHub API error: ${response.statusText}`);
    }

    const repos = await response.json();

    const getPlaceholder = (tech) => {
        const query = tech ? tech.toLowerCase() : 'coding';
        return `https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop&q=${query}`;
    };

    return repos.map(repo => ({
      name: repo.name,
      description: repo.description,
      status: 'In Progress',
      stars: repo.stargazers_count,
      technologies: repo.language ? [repo.language] : ['Unknown'],
      thumbnail: getPlaceholder(repo.language),
      liveDemoUrl: repo.homepage || '#',
      githubUrl: repo.html_url,
      category: 'GitHub Import',
      createdAt: repo.created_at,
      updatedAt: repo.updated_at
    }));

  } catch (error) {
    console.error(`[GITHUB] Fetch failed for ${username}:`, error.message);
    throw error;
  }
}

export async function fetchGitHubCommits(owner, repo) {
  try {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/commits?per_page=10`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'VHub-CMS-Backend'
      }
    });

    if (!response.ok) return [];
    
    const commits = await response.json();
    return (commits || []).map(entry => ({
      message: entry.commit.message,
      author: entry.commit.author.name,
      date: entry.commit.author.date,
      url: entry.html_url,
      sha: entry.sha.substring(0, 7)
    }));
  } catch (error) {
    return [];
  }
}

