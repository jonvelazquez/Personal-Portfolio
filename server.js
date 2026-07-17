const express = require('express');
const bodyParser = require('body-parser');
const { google } = require('googleapis');
const axios = require('axios');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Controller
const portfolioController = require('./controllers/portfolioController');

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(helmet());

/* ============================================
   RATE LIMITING — Prevent spam & bot floods
============================================ */
const contactLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: "Too many submissions. Please wait a moment."
});

/* ============================================
   AUTO-GENERATED METADATA ENGINE
============================================ */
function generateDescription(repo) {
  const name = repo.name.toLowerCase();

  if (repo.name === "Personal-Portfolio") {
    return "Mission‑aligned portfolio showcasing aerospace UI systems, telemetry animations, orbital motion, and a JSON-driven project system.";
  }
  if (repo.name === "my-first-project") {
    return "First project created to explore repository structure, version control, and foundational engineering concepts.";
  }

  if (name.includes("workshop")) return "Hands-on workshop demonstrating practical engineering concepts and mission-aligned development.";
  if (name.includes("exercise")) return "Practice exercises focusing on core engineering fundamentals and applied problem solving.";
  if (name.includes("react")) return "React-based application demonstrating component-driven UI architecture and modern frontend workflows.";
  if (name.includes("node")) return "Node.js project demonstrating backend logic, routing, and server-side engineering.";
  if (name.includes("mysql")) return "MySQL project demonstrating relational schema design, queries, and structured data operations.";
  if (name.includes("mongodb")) return "MongoDB project demonstrating document modeling, CRUD operations, and NoSQL workflows.";
  if (name.includes("redis")) return "Redis project demonstrating caching, key-value storage, and high-speed data operations.";
  if (name.includes("todo")) return "Simple task management application demonstrating CRUD operations and UI state handling.";
  if (name.includes("calculator")) return "Interactive calculator demonstrating arithmetic logic, UI updates, and user-driven workflows.";
  if (name.includes("webpack")) return "Webpack project demonstrating bundling, loaders, plugins, and modern build pipelines.";
  if (name.includes("movie")) return "Movie search interface demonstrating API calls, filtering, and dynamic UI rendering.";
  if (name.includes("first")) return "First project created to explore repository structure, version control, and foundational engineering concepts.";

  return repo.description || "Mission-aligned engineering project demonstrating modern development practices.";
}

function generateTech(repo) {
  const lang = repo.language ? repo.language.toLowerCase() : "";
  const name = repo.name.toLowerCase();

  if (repo.name === "Personal-Portfolio") {
    return ["Node.js", "Express", "EJS", "CSS", "JavaScript"];
  }
  if (repo.name === "my-first-project") {
    return ["JavaScript", "HTML", "CSS"];
  }

  if (lang.includes("javascript")) return ["JavaScript", "HTML", "CSS"];
  if (lang.includes("typescript")) return ["TypeScript", "JavaScript", "HTML", "CSS"];
  if (lang.includes("python")) return ["Python"];
  if (lang.includes("java")) return ["Java"];
  if (lang.includes("c#")) return ["C#", ".NET"];
  if (lang.includes("c++")) return ["C++"];
  if (lang.includes("html")) return ["HTML", "CSS", "JavaScript"];
  if (lang.includes("css")) return ["CSS", "HTML", "JavaScript"];

  if (name.includes("react")) return ["React", "JavaScript", "CSS"];
  if (name.includes("node")) return ["Node.js", "JavaScript"];
  if (name.includes("mongodb")) return ["MongoDB", "JavaScript", "Node.js"];
  if (name.includes("mysql")) return ["MySQL", "SQL"];
  if (name.includes("redis")) return ["Redis", "JavaScript", "Node.js"];
  if (name.includes("webpack")) return ["Webpack", "JavaScript", "Node.js"];

  return [repo.language || "Unknown"];
}

/* ============================================
   GITHUB PROJECTS FETCH
============================================ */
async function fetchGitHubRepos() {
  try {
    const response = await axios.get(
      "https://api.github.com/users/jonvelazquez/repos?sort=updated"
    );

    const repos = Array.isArray(response.data) ? response.data : [];

    return repos
      .filter(repo => repo.name.toLowerCase() !== "jonvelazquez")
      .filter(repo => repo.name.toLowerCase() !== "jonvelazquez.github.io")
      .map(repo => ({
        name: repo.name,
        url: repo.html_url,
        homepage: repo.homepage || null,
        description: generateDescription(repo),
        tech: generateTech(repo)
      }));

  } catch (error) {
    console.error("GitHub API Error:", error);
    return [];
  }
}

/* ============================================
   ROUTES
============================================ */
app.get('/', (req, res) => {
  res.render('index', { page: 'home' });
});

app.get('/portfolio', (req, res) => {
  portfolioController.getPortfolio(req, res, 'portfolio');
});

app.get('/github-projects', async (req, res) => {
  const githubProjects = await fetchGitHubRepos();
  res.render('github-projects', { githubProjects, page: 'github' });
});

app.get('/contact', (req, res) => {
  res.render('contact', { page: 'contact' });
});

/* ============================================
   CONTACT FORM VALIDATION + SANITIZATION
============================================ */
function sanitize(str) {
  return str.replace(/[<>{}()$;]/g, "");
}

function validateName(name) {
  return /^[A-Za-z]+$/.test(name);
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* ============================================
   GOOGLE OAUTH WEB CLIENT (RENDER-SAFE)
============================================ */
function getOAuthClient() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
}

async function getSheetsClient() {
  const oauth2Client = getOAuthClient();

  oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN
  });

  return oauth2Client;
}

/* ============================================
   GOOGLE SHEETS WRITE (WEB AUTH VERSION)
============================================ */
async function updateSheet(contact, res) {
  try {
    const auth = await getSheetsClient();
    const sheets = google.sheets({ version: "v4", auth });

    const spreadsheetId = "18GjkmKiH3R3GK4XV_W0yDIJF8SNCh46lfxfVoh9N4Ms";

    const values = [
      [
        contact.firstName,
        contact.lastName,
        contact.email,
        new Date().toLocaleString()
      ]
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "Sheet1!A:D",
      valueInputOption: "RAW",
      resource: { values }
    });

    console.log("Sheets append completed — now rendering thanks page");
    res.render("thanks", { contact, page: "contact" });

  } catch (err) {
    console.error("Sheets update error:", err);
    res.status(500).send("Error saving your contact info.");
  }
}

/* ============================================
   GOOGLE OAUTH LOGIN ROUTE
============================================ */
app.get('/auth', (req, res) => {
  const oauth2Client = getOAuthClient();

  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ["https://www.googleapis.com/auth/spreadsheets"]
  });

  res.redirect(url);
});

/* ============================================
   FULL /thanks ROUTE
============================================ */
app.post('/thanks', contactLimiter, (req, res) => {

  if (req.body.missionCode) {
    return res.status(400).send("Bot submission blocked.");
  }

  const { firstName, lastName, email } = req.body;

  if (!validateName(firstName) || !validateName(lastName)) {
    return res.status(400).send("Invalid name format. Letters only.");
  }

  if (!validateEmail(email)) {
    return res.status(400).send("Invalid email format.");
  }

  const safeContact = {
    firstName: sanitize(firstName),
    lastName: sanitize(lastName),
    email: sanitize(email)
  };

  updateSheet(safeContact, res);
});

/* ============================================
   GOOGLE OAUTH CALLBACK ROUTE
============================================ */
app.get('/oauth2callback', async (req, res) => {
  const code = req.query.code;
  const oauth2Client = getOAuthClient();

  try {
    const { tokens } = await oauth2Client.getToken(code);

    console.log("Copy this refresh token into Render:", tokens.refresh_token);

    res.send("OAuth successful! Check Render logs and paste the refresh token into GOOGLE_REFRESH_TOKEN.");
  } catch (err) {
    console.error("OAuth callback error:", err);
    res.status(500).send("OAuth failed.");
  }
});

/* ============================================
   EXPORT APP FOR TESTING
============================================ */
module.exports = app;

/* ============================================
   START SERVER (TEST-SAFE)
============================================ */
if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
