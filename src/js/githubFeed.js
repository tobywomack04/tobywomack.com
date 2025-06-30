const username = "tobywomack04";
const repoFeed = document.getElementById("recentRepo");
const cacheKey = "recentRepoCache";
const cacheExpiry = 60 * 60 * 1000; // 1 hour expiry

const languageIcons = {
  JavaScript: "🟨",
  HTML: "🟥",
  CSS: "🟦",
  Python: "🐍",
  Java: "☕",
  C: "🔵",
  "C++": "💠",
  TypeScript: "🔷",
  Shell: "💻",
  default: "📁"
};

// Get icon for language
function getLangIcon(lang) {
  return languageIcons[lang] || languageIcons.default;
}

// Format date
function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString();
}

// Get from cache if fresh
function getCachedRepos() {
  const cache = localStorage.getItem(cacheKey);
  if (!cache) return null;
  const { timestamp, data } = JSON.parse(cache);
  if (Date.now() - timestamp > cacheExpiry) return null;
  return data;
}

// Save to cache
function cacheRepos(data) {
  localStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), data }));
}

// Fetch commit count
async function fetchCommitCount(repoName) {
  const res = await fetch(`https://api.github.com/repos/${username}/${repoName}/commits`);
  const commits = await res.json();
  return Array.isArray(commits) ? commits.length : "N/A";
}

// Render one repo
async function renderRepo(repo) {
  const item = document.createElement("li");
  const commitCount = await fetchCommitCount(repo.name);
  const langIcon = getLangIcon(repo.language);

  item.innerHTML = `
    <a href="${repo.html_url}" target="_blank">${repo.name}</a>
    <p>${repo.description || "No description provided."}</p>
    <small>${langIcon} ${repo.language || "Unknown"} &nbsp;•&nbsp; 🔁 Commits: ${commitCount} &nbsp;•&nbsp; Updated: ${formatDate(repo.updated_at)}</small>
  `;
  repoFeed.appendChild(item);
}

// Load and display the latest repo
async function loadRepos() {
  repoFeed.innerHTML = "<li>Loading...</li>";

  let repos = getCachedRepos();

  if (!repos) {
    try {
      const res = await fetch(`https://api.github.com/users/${username}/repos?sort=updated`);
      repos = await res.json();
      cacheRepos(repos);
    } catch (err) {
      console.error("GitHub fetch error:", err);
      repoFeed.innerHTML = "<li>Failed to load GitHub repository.</li>";
      return;
    }
  }

  repoFeed.innerHTML = ""; // Clear placeholder

  const mostRecent = repos[0];
  if (mostRecent) {
    await renderRepo(mostRecent);
  } else {
    repoFeed.innerHTML = "<li>No repositories found.</li>";
  }
}

loadRepos();