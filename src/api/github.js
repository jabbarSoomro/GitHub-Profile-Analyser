// github.js
// GitHub API client for fetching profile, repos, and events.

const BASE_URL = 'https://api.github.com';

function getHeaders() {
  const headers = {
    'Accept': 'application/vnd.github.v3+json'
  };
  const token = localStorage.getItem('gh_analyser_token');
  if (token) {
    headers['Authorization'] = `token ${token}`;
  }
  return headers;
}

/**
 * Fetch profile data for a user
 * @param {string} username 
 * @returns {Promise<Object>}
 */
export async function fetchUserProfile(username) {
  const response = await fetch(`${BASE_URL}/users/${username}`, {
    headers: getHeaders()
  });
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('User not found');
    }
    if (response.status === 403) {
      throw new Error('GitHub API rate limit exceeded or credentials invalid. Please check your token or try again later.');
    }
    throw new Error('Failed to fetch user profile');
  }
  return response.json();
}

/**
 * Fetch public repositories for a user (up to 100)
 * @param {string} username 
 * @returns {Promise<Array>}
 */
export async function fetchUserRepos(username) {
  const response = await fetch(`${BASE_URL}/users/${username}/repos?per_page=100&sort=updated`, {
    headers: getHeaders()
  });
  if (!response.ok) {
    if (response.status === 403) {
      throw new Error('GitHub API rate limit exceeded or credentials invalid. Please check your token or try again later.');
    }
    throw new Error('Failed to fetch user repositories');
  }
  return response.json();
}

/**
 * Fetch public events for a user (up to 100) for contributions and streaks
 * @param {string} username 
 * @returns {Promise<Array>}
 */
export async function fetchUserEvents(username) {
  const response = await fetch(`${BASE_URL}/users/${username}/events?per_page=100`, {
    headers: getHeaders()
  });
  if (!response.ok) {
    if (response.status === 403) {
      throw new Error('GitHub API rate limit exceeded or credentials invalid. Please check your token or try again later.');
    }
    throw new Error('Failed to fetch user events');
  }
  return response.json();
}

/**
 * Process repository data to extract top languages and repo health
 * @param {Array} repos 
 */
export function processRepoData(repos) {
  // Aggregate languages by size
  const languageStats = {};
  let totalSize = 0;

  repos.forEach(repo => {
    if (repo.language) {
      const lang = repo.language;
      const size = repo.size || 0; // Size in KB
      languageStats[lang] = (languageStats[lang] || 0) + size;
      totalSize += size;
    }
  });

  // Convert to array and sort
  const languages = Object.keys(languageStats)
    .map(name => ({
      name,
      value: languageStats[name],
      percentage: totalSize > 0 ? Math.round((languageStats[name] / totalSize) * 100) : 0
    }))
    .sort((a, b) => b.value - a.value);

  // Calculate health score for each repository
  const scoredRepos = repos.map(repo => {
    let score = 0;
    
    // 1. Stars (Max 20 points, 50+ stars = 20)
    const starScore = Math.min((repo.stargazers_count / 50) * 20, 20);
    score += starScore;

    // 2. Recency of updates (Max 20 points)
    const daysSinceUpdate = (new Date() - new Date(repo.updated_at)) / (1000 * 60 * 60 * 24);
    let recencyScore = 0;
    if (daysSinceUpdate <= 7) recencyScore = 20;
    else if (daysSinceUpdate <= 30) recencyScore = 15;
    else if (daysSinceUpdate <= 90) recencyScore = 10;
    else if (daysSinceUpdate <= 365) recencyScore = 5;
    score += recencyScore;

    // 3. Completeness (Description + Homepage: Max 20 points)
    const descScore = repo.description ? 10 : 0;
    const homepageScore = repo.homepage ? 10 : 0;
    score += descScore + homepageScore;

    // 4. Open Issues Ratio (Max 20 points)
    // If no open issues, full points. Otherwise, compare open issues to total issues estimation.
    // Since we don't have total issues directly, we can use a ratio or deduct based on count.
    // Let's use: 20 points if 0 open issues, deducting 2 points per open issue down to min 0.
    const issuesScore = Math.max(20 - (repo.open_issues_count * 2), 0);
    score += issuesScore;

    // 5. Repository Size/Completeness (Max 20 points)
    // Very small repos (< 10 KB) might be placeholders. Repos > 1MB (1000 KB) get full points.
    const sizeScore = Math.min((repo.size / 1000) * 20, 20);
    score += sizeScore;

    return {
      id: repo.id,
      name: repo.name,
      html_url: repo.html_url,
      description: repo.description,
      language: repo.language,
      stargazers_count: repo.stargazers_count,
      forks_count: repo.forks_count,
      open_issues_count: repo.open_issues_count,
      healthScore: Math.round(score)
    };
  }).sort((a, b) => b.healthScore - a.healthScore);

  return { languages, scoredRepos };
}

/**
 * Process events data to extract contribution dates and streaks
 * @param {Array} events 
 */
export function processEventsData(events) {
  // We're interested in activity: PushEvents, CreateEvents, PullRequestEvents, IssuesEvents, etc.
  const activityByDate = {};
  
  events.forEach(event => {
    if (!event.created_at) return;
    const dateStr = event.created_at.split('T')[0]; // YYYY-MM-DD
    
    // Count specific event weight or just presence
    // PushEvents have commits count, others count as 1 contribution
    let contributions = 1;
    if (event.type === 'PushEvent' && event.payload && event.payload.commits) {
      contributions = event.payload.commits.length;
    }
    
    activityByDate[dateStr] = (activityByDate[dateStr] || 0) + contributions;
  });

  // Calculate streaks
  const dates = Object.keys(activityByDate).sort((a, b) => new Date(b) - new Date(a)); // Newest first
  
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  const todayStr = new Date().toISOString().split('T')[0];
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  // To find streaks, we need them sorted oldest to newest
  const sortedDates = [...dates].reverse(); // Oldest first
  
  // Calculate longest streak & current streak
  if (sortedDates.length > 0) {
    let prevDate = null;
    
    for (let i = 0; i < sortedDates.length; i++) {
      const currentDate = new Date(sortedDates[i]);
      
      if (prevDate === null) {
        tempStreak = 1;
      } else {
        const diffTime = Math.abs(currentDate - prevDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          tempStreak++;
        } else if (diffDays > 1) {
          if (tempStreak > longestStreak) {
            longestStreak = tempStreak;
          }
          tempStreak = 1;
        }
      }
      prevDate = currentDate;
    }
    
    if (tempStreak > longestStreak) {
      longestStreak = tempStreak;
    }

    // Current streak check: does it include today or yesterday?
    const hasActivityRecently = activityByDate[todayStr] !== undefined || activityByDate[yesterdayStr] !== undefined;
    if (hasActivityRecently) {
      // Walk backwards from today/yesterday to count consecutive active days
      let checkDate = new Date();
      if (activityByDate[checkDate.toISOString().split('T')[0]] === undefined) {
        checkDate.setDate(checkDate.getDate() - 1); // Start from yesterday if today is empty
      }
      
      while (true) {
        const checkStr = checkDate.toISOString().split('T')[0];
        if (activityByDate[checkStr] !== undefined) {
          currentStreak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }
    }
  }

  // Total contributions count
  const totalContributions = Object.values(activityByDate).reduce((sum, val) => sum + val, 0);

  return {
    activityByDate,
    currentStreak,
    longestStreak,
    totalContributions,
    activeDaysCount: Object.keys(activityByDate).length
  };
}
