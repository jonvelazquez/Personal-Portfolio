// controllers/githubController.js
const axios = require("axios");

// Custom metadata for your GitHub repos
const githubMeta = {
  "Personal-Portfolio": {
    description: "Mission‑aligned portfolio showcasing aerospace UI systems.",
    tech: ["Node.js", "Express", "EJS", "CSS", "JavaScript"]
  },
  "Astro-Weight-Calculator": {
    description: "Interactive calculator that computes a user's weight on different celestial bodies.",
    tech: ["JavaScript", "HTML", "CSS"]
  },
  "Express-Server": {
    description: "A backend server demonstrating routing, middleware, and foundational API development.",
    tech: ["Node.js", "Express"]
  },
  "VSTDA-API": {
    description: "A REST API supporting task management operations with structured endpoints and data handling.",
    tech: ["Node.js", "Express"]
  },
  "Log-All-the-Things": {
    description: "Logging and debugging utility demonstrating structured output and Node.js workflow automation.",
    tech: ["Node.js"]
  },
  "Starship-Traversal-Experience": {
    description: "Immersive CSS-driven animation simulating starship traversal through space.",
    tech: ["CSS"]
  },
  "Mortgage-Calculator": {
    description: "Calculates mortgage payments using principal, interest rate, and amortization formulas.",
    tech: ["JavaScript"]
  },
  "Change-Calculator": {
    description: "Computes optimal coin distribution for change amounts using modular arithmetic.",
    tech: ["JavaScript"]
  },
  "San-Diego-Top-Spots": {
    description: "Displays top locations in San Diego using dynamic data loading and interactive UI components.",
    tech: ["JavaScript"]
  },
  "redis-workshop": {
    description: "Hands-on Redis workshop demonstrating key-value storage, caching, and basic NoSQL operations.",
    tech: ["Redis", "JavaScript", "Node.js"]
  },

  "mongodb-exercises": {
    description: "MongoDB practice exercises covering CRUD operations, indexing, and document modeling.",
    tech: ["MongoDB", "JavaScript", "Node.js"]
  },

  "mongodb-workshop": {
    description: "Workshop demonstrating MongoDB queries, aggregation pipelines, and schema design fundamentals.",
    tech: ["MongoDB", "JavaScript", "Node.js"]
  },

  "mysql-exercises": {
    description: "MySQL exercises focusing on relational schema design, joins, queries, and stored procedures.",
    tech: ["MySQL", "SQL", "JavaScript"]
  },

  "Deliver-It-Well": {
    description: "Delivery routing simulation demonstrating asynchronous JavaScript, API calls, and UI updates.",
    tech: ["JavaScript", "HTML", "CSS"]
  },

  "Very-Simple-Todo-App": {
    description: "Minimalist todo application demonstrating DOM manipulation and basic CRUD logic.",
    tech: ["JavaScript", "HTML", "CSS"]
  },

  "React-Top-Spots": {
    description: "React application displaying top locations using props, components, and API-driven data.",
    tech: ["React", "JavaScript", "CSS"]
  },

  "React100-Change-Calculator": {
    description: "React-based change calculator demonstrating component state, props, and controlled inputs.",
    tech: ["React", "JavaScript", "CSS"]
  },

  "OPS200-Prove-It-Works": {
    description: "Operations-focused project demonstrating debugging, logging, and validation workflows.",
    tech: ["JavaScript", "Node.js"]
  },

  "Project-Webpack-Workshop": {
    description: "Webpack workshop demonstrating bundling, loaders, plugins, and modern build pipelines.",
    tech: ["Webpack", "JavaScript", "Node.js"]
  },

  "React-Workshop": {
    description: "React workshop covering components, JSX, props, state, and event handling.",
    tech: ["React", "JavaScript", "CSS"]
  },

  "Movie-Finder-Data": {
    description: "Movie search interface demonstrating API calls, filtering, and dynamic UI rendering.",
    tech: ["JavaScript", "HTML", "CSS"]
  },

  "Node101-Hello-HTTP-Server": {
    description: "Introductory Node.js HTTP server demonstrating routing and basic request handling.",
    tech: ["Node.js", "JavaScript"]
  },

  "my-first-project": {
    description: "First GitHub project created for learning repository structure and version control.",
    tech: ["JavaScript", "HTML", "CSS"]
  }

};

// Fetch GitHub repos + merge metadata
exports.getGitHubProjects = async (req, res) => {
  try {
    const username = "jonvelazquez";

    const response = await axios.get(
      `https://api.github.com/users/${username}/repos?sort=updated`
    );

    const repos = response.data;

    // Merge metadata with GitHub API data
    const enrichedRepos = repos.map(repo => {
      const meta = githubMeta[repo.name] || {};

      return {
        name: repo.name,
        url: repo.html_url,
        homepage: repo.homepage,
        description:
          meta.description ||
          repo.description ||
          "No description available.",
        tech: meta.tech || [repo.language || "Unknown"]
      };
    });

    res.render("github-projects", {
      githubProjects: enrichedRepos,
      page: "github"
    });

  } catch (error) {
    console.error("GitHub API Error:", error);
    res.render("github-projects", {
      githubProjects: [],
      page: "github"
    });
  }
};
