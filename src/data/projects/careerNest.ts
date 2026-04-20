export const careerNest = {
    id: "career_nest",
    title: "CareerNest",
    subtitle: "Smart Job Matching Platform for Students & Graduates",
    description:
        "A smart full-stack job matching platform for students and fresh graduates. Features JWT-based multi-role authentication, scalable REST APIs, PostgreSQL storage, and Docker containerization with sub-2s API response times.",
    longDescription: `
CareerNest is a production-grade full-stack job matching platform designed specifically for students and fresh graduates entering the job market.

The platform features a dual-role authentication system powered by JWT — students can browse and apply for jobs, while recruiters can post listings, review applications, and manage hiring pipelines. The entire auth flow is secure, stateless, and scalable.

On the backend, RESTful APIs built with Node.js and Express.js handle job listings, applications, and user management. All data is persisted in PostgreSQL with optimized queries ensuring sub-2s API response times even under load.

The application is fully containerized with Docker, making it deployment-ready. It is currently live on Render, serving real users.

🏆 Won KONVERGE 2026 Hackathon — 1st place among 150+ competing teams.
`,
    type: "Full-Stack Web App",
    tech: [
        "React.js",
        "Node.js",
        "Express.js",
        "PostgreSQL",
        "JWT",
        "Docker",
        "REST APIs",
        "Render"
    ],
    links: {
        github: "https://github.com/amit-mohanta/CareerNest",
        live: "https://github.com/amit-mohanta/CareerNest"
    },
    image:
        "https://opengraph.githubassets.com/1/zeenutt769/CareerNest",
    date: "2026",
    role: "Full-Stack Developer & Project Lead",
    highlights: [
        "🏆 Won KONVERGE 2026 Hackathon (1st place, 150+ teams)",
        "JWT-based multi-role auth (student & recruiter)",
        "RESTful APIs with sub-2s response times",
        "PostgreSQL database with optimized schema",
        "Docker containerization for deployment",
        "Deployed live on Render",
        "Job listing, application, and pipeline management",
        "Scalable architecture for production workloads"
    ],
    featured: true,
    languages: [
        { name: "JavaScript", percent: 55, color: "#f7df1e" },
        { name: "TypeScript", percent: 20, color: "#3178c6" },
        { name: "SQL", percent: 15, color: "#336791" },
        { name: "Docker", percent: 10, color: "#2496ed" }
    ],
    deployHistory: [
        {
            version: "v1.0",
            msg: "Live production release — hackathon winning build",
            time: "2026",
            status: "success"
        }
    ],
    snippet: `// CareerNest — JWT Auth Middleware
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access denied' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user; // { id, role: 'student' | 'recruiter' }
    next();
  });
};

// Role-based route guard
const requireRole = (role) => (req, res, next) => {
  if (req.user.role !== role)
    return res.status(403).json({ error: 'Insufficient permissions' });
  next();
};

// Job listing endpoint (recruiters only)
router.post('/jobs', authenticateToken, requireRole('recruiter'), async (req, res) => {
  const { title, description, requirements, salary } = req.body;
  const job = await db.query(
    'INSERT INTO jobs (title, description, requirements, salary, recruiter_id) VALUES ($1,$2,$3,$4,$5) RETURNING *',
    [title, description, requirements, salary, req.user.id]
  );
  res.status(201).json(job.rows[0]);
});
`,
    architecture: `
[React Frontend]
      |
      v
[Express REST API]  ←→  [JWT Auth Middleware]
      |                        |
      v                        v
[PostgreSQL DB]         [Role Guard: student | recruiter]
      |
      v
[Docker Container] → [Render Cloud Deploy]
`
};
