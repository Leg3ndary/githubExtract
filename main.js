import fetch from "node-fetch";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const config = {
  username: "Leg3ndary",
  token: process.env.GITHUB_TOKEN,
  outputFile: "github_resume_data.json"
};

const apiBaseUrl = "https://api.github.com";

const headers = {
  Authorization: `token ${config.token}`,
  Accept: "application/vnd.github.v3+json",
  "User-Agent": "GitHub-Resume-Builder"
};

const resumeData = {
  user: null,
  repositories: []
};

async function fetchUserProfile() {
  console.log(`Fetching profile for ${config.username}...`);

  const response = await fetch(`${apiBaseUrl}/users/${config.username}`, {
    headers
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch user profile: ${response.statusText}`);
  }

  const userData = await response.json();

  resumeData.user = {
    username: userData.login,
    name: userData.name,
    bio: userData.bio,
    location: userData.location,
    company: userData.company,
    blog: userData.blog,
    publicRepos: userData.public_repos,
    followers: userData.followers,
    following: userData.following,
    joinedAt: userData.created_at
  };

  console.log(`Profile data fetched`);
}

async function fetchRepositories() {
  console.log("Fetching public repositories...");

  let page = 1;
  let hasMoreRepos = true;

  while (hasMoreRepos) {
    const response = await fetch(
      `${apiBaseUrl}/users/${config.username}/repos?per_page=100&page=${page}&sort=updated`,
      { headers }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch repositories (page ${page}): ${response.statusText}`
      );
    }

    const repos = await response.json();

    if (repos.length === 0) {
      hasMoreRepos = false;
    } else {
      for (const repo of repos) {
        if (!repo.fork) {
          resumeData.repositories.push({
            name: repo.name,
            fullName: repo.full_name,
            description: repo.description,
            url: repo.html_url,
            homepage: repo.homepage,
            language: repo.language,
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            watchers: repo.watchers_count,
            openIssues: repo.open_issues_count,
            createdAt: repo.created_at,
            updatedAt: repo.updated_at,
            topics: repo.topics || [],
            isPrivate: repo.private
          });
        }
      }

      page++;
    }
  }

  console.log(`Found ${resumeData.repositories.length} public repositories`);
}

function saveResults() {
  const outputPath = path.resolve(process.cwd(), config.outputFile);
  fs.writeFileSync(outputPath, JSON.stringify(resumeData, null, 2));
  console.log(`Results saved to ${outputPath}`);
}

function calculateStatistics() {
  console.log("Calculating repository statistics...");

  resumeData.statistics = {
    totalRepos: resumeData.repositories.length,
    languageCounts: {},
    topicsCount: {},
    starsTotal: resumeData.repositories.reduce((sum, repo) => sum + repo.stars, 0),
    forksTotal: resumeData.repositories.reduce((sum, repo) => sum + repo.forks, 0)
  };

  for (const repo of resumeData.repositories) {
    if (repo.language) {
      if (!resumeData.statistics.languageCounts[repo.language]) {
        resumeData.statistics.languageCounts[repo.language] = 0;
      }
      resumeData.statistics.languageCounts[repo.language]++;
    }

    for (const topic of repo.topics) {
      if (!resumeData.statistics.topicsCount[topic]) {
        resumeData.statistics.topicsCount[topic] = 0;
      }
      resumeData.statistics.topicsCount[topic]++;
    }
  }

  console.log("Statistics calculated");
}

async function main() {
  try {
    console.log("Starting GitHub repository extraction for resume building");

    await fetchUserProfile();
    await fetchRepositories();
    calculateStatistics();
    saveResults();

    console.log(
      "All done! Your GitHub repository data has been extracted successfully"
    );
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

main();