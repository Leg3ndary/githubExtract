# GitHub Repository Extractor

A simple script that extracts your GitHub profile and repository data for resume building.

## Features

- Fetches your GitHub user profile information
- Retrieves all your public repositories (excluding forks)
- Calculates repository statistics (languages, stars, forks, etc.)
- Saves everything to a structured JSON file

## Prerequisites

- Node.js installed
- GitHub Personal Access Token

## Installation

1. Clone or download this repository
2. Install dependencies:
   ```
   npm install node-fetch dotenv
   ```
3. Create a `.env` file in the project root with your GitHub token:
   ```
   GITHUB_TOKEN=your_github_token_here
   ```

## Usage

1. Modify the config section in the script if you want to change:
   - Your GitHub username
   - The output file name

2. Run the script:
   ```
   node github-repo-extractor.js
   ```

3. Find your data in the generated JSON file (default: `github_resume_data.json`)

## Output Format

The script generates a JSON file with the following structure:

```json
{
  "user": {
    "username": "YourUsername",
    "name": "Your Name",
    "bio": "Your bio",
    ...
  },
  "repositories": [
    {
      "name": "repo-name",
      "description": "Repository description",
      "language": "JavaScript",
      "stars": 5,
      ...
    },
    ...
  ],
  "statistics": {
    "totalRepos": 10,
    "languageCounts": {
      "JavaScript": 5,
      "Python": 3,
      ...
    },
    ...
  }
}
```
