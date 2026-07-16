// controllers/portfolioController.js

const featuredProjects = [
  {
    title: "Mission Portfolio Website",
    description: "A space-themed, defense-aligned portfolio featuring telemetry animations, orbital path motion, and a JSON-driven project system.",
    homepage: null, // No Vercel deployment
    github: "https://github.com/jonvelazquez/Personal-Portfolio",
    tech: ["Node.js", "Express", "EJS", "CSS", "JavaScript"]
  },
  {
    title: "Astro Weight Calculator",
    description: "Interactive calculator that computes a user's weight on different celestial bodies using physics-based multipliers.",
    homepage: "https://astro-weight-calculator-ruddy.vercel.app/",
    github: "https://github.com/jonvelazquez/Astro-Weight-Calculator",
    tech: ["JavaScript", "HTML", "CSS"]
  },
  {
    title: "Express Server API",
    description: "A backend server demonstrating routing, middleware, and foundational API development.",
    homepage: null, // Code-only
    github: "https://github.com/jonvelazquez/Express-Server",
    tech: ["Node.js", "Express"]
  },
  {
    title: "VSTDA API",
    description: "A REST API supporting task management operations with structured endpoints and data handling.",
    homepage: null, // Code-only
    github: "https://github.com/jonvelazquez/VSTDA-API",
    tech: ["Node.js", "Express"]
  },
  {
    title: "Log All the Things",
    description: "Logging and debugging utility demonstrating structured output, error handling, and Node.js workflow automation.",
    homepage: null, // Code-only
    github: "https://github.com/jonvelazquez/Log-All-the-Things",
    tech: ["Node.js"]
  },
  {
    title: "Starship Traversal Experience",
    description: "Immersive CSS-driven animation simulating starship traversal through space.",
    homepage: "https://starship-traversal-experience.vercel.app/",
    github: "https://github.com/jonvelazquez/Starship-Traversal-Experience",
    tech: ["CSS"]
  }
];

const integratedProjects = [
  {
    title: "Space Systems Telemetry UI (Integrated Feature)",
    description: "Integrated telemetry interface featuring animated signal lines and orbital motion.",
    homepage: null, // Integrated into portfolio only
    github: "https://github.com/jonvelazquez/Personal-Portfolio",
    tech: ["JavaScript", "CSS Animations", "EJS"]
  },
  {
    title: "Cyber Defense Dashboard (Integrated Concept)",
    description: "SOC-style dashboard concept displayed within the Mission Portfolio.",
    homepage: null, // Integrated into portfolio only
    github: "https://github.com/jonvelazquez/Personal-Portfolio",
    tech: ["Node.js", "Express", "EJS"]
  }
];

const additionalProjects = [
  {
    title: "Mortgage Calculator",
    description: "Calculates mortgage payments using principal, interest rate, and amortization formulas.",
    homepage: "https://mortgage-calculator-lemon-six.vercel.app/",
    github: "https://github.com/jonvelazquez/Mortgage-Calculator",
    tech: ["JavaScript"]
  },
  {
    title: "Change Calculator",
    description: "Computes optimal coin distribution for change amounts using modular arithmetic.",
    homepage: "https://change-calculator-weld.vercel.app/",
    github: "https://github.com/jonvelazquez/Change-Calculator",
    tech: ["JavaScript"]
  },
  {
    title: "San Diego Top Spots",
    description: "Displays top locations in San Diego using dynamic data loading and interactive UI components.",
    homepage: "https://san-diego-top-spots-mocha.vercel.app/",
    github: "https://github.com/jonvelazquez/San-Diego-Top-Spots",
    tech: ["JavaScript"]
  },
  {
    title: "Very Simple Todo App",
    description: "Minimalist todo application demonstrating DOM manipulation and basic CRUD logic.",
    homepage: "https://very-simple-todo-app.vercel.app/",
    github: "https://github.com/jonvelazquez/Very-Simple-Todo-App",
    tech: ["JavaScript", "HTML", "CSS"]
  },
  {
    title: "React Top Spots",
    description: "React application displaying top locations using props, components, and API-driven data.",
    homepage: "https://react-top-spots-ruddy.vercel.app/",
    github: "https://github.com/jonvelazquez/React-Top-Spots",
    tech: ["React", "JavaScript", "CSS"]
  },
  {
    title: "React100 Change Calculator",
    description: "React-based change calculator demonstrating component state, props, and controlled inputs.",
    homepage: "https://react100-change-calculator-one.vercel.app/",
    github: "https://github.com/jonvelazquez/React100-Change-Calculator",
    tech: ["React", "JavaScript", "CSS"]
  }
];

// UPDATED — Now includes active link highlighting
exports.getPortfolio = (req, res) => {
  res.render("portfolio", {
    featuredProjects,
    integratedProjects,
    additionalProjects,
    page: "portfolio"
  });
};
