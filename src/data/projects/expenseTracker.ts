export const expenseTracker = {
    id: "expense_tracker",
    title: "ExpenseTracker",
    subtitle: "Full-Stack Personal Finance Management App",
    description:
        "A full-stack expense tracking application for managing personal finances. Track income, expenses, and financial goals with a clean, intuitive interface.",
    longDescription: `
ExpenseTracker is a full-stack personal finance management application that helps users take control of their spending and savings.

The app provides a clean dashboard for tracking income and expenses, categorizing transactions, and visualizing spending patterns over time. Users can set budgets, track financial goals, and gain insights through data visualizations.

Built with React.js on the frontend for a responsive, dynamic UI, and Node.js with Express.js on the backend for robust API services. Data is persisted in PostgreSQL for reliability and query efficiency.
`,
    type: "Full-Stack Web App",
    tech: [
        "React.js",
        "Node.js",
        "Express.js",
        "PostgreSQL",
        "JavaScript",
        "REST APIs"
    ],
    links: {
        github: "https://github.com/amit-mohanta/ExpenseTracker"
    },
    image: "https://opengraph.githubassets.com/1/zeenutt769/ExpenseTracker?v=1776804134970",
    date: "2024",
    role: "Full-Stack Developer",
    highlights: [
        "Track income and expenses with categories",
        "Budget setting and goal tracking",
        "Spending pattern visualizations",
        "PostgreSQL for reliable data persistence",
        "RESTful API with Express.js",
        "Responsive React.js frontend"
    ],
    featured: false,
    languages: [
        { name: "JavaScript", percent: 65, color: "#f7df1e" },
        { name: "SQL", percent: 20, color: "#336791" },
        { name: "CSS", percent: 15, color: "#264de4" }
    ],
    deployHistory: [
        {
            version: "v1.0",
            msg: "Initial public release",
            time: "2024",
            status: "success"
        }
    ],
    snippet: `// ExpenseTracker — Monthly Summary Query
const getMonthlySummary = async (userId, month, year) => {
  const { rows } = await db.query(\`
    SELECT 
      category,
      SUM(amount) as total,
      COUNT(*) as count,
      type
    FROM transactions
    WHERE user_id = $1
      AND EXTRACT(MONTH FROM date) = $2
      AND EXTRACT(YEAR FROM date) = $3
    GROUP BY category, type
    ORDER BY total DESC
  \`, [userId, month, year]);

  const income = rows.filter(r => r.type === 'income');
  const expenses = rows.filter(r => r.type === 'expense');

  return {
    income: income.reduce((acc, r) => acc + Number(r.total), 0),
    expenses: expenses.reduce((acc, r) => acc + Number(r.total), 0),
    breakdown: rows
  };
};
`,
    architecture: `
[React.js Frontend]
      |
      v
[Express.js REST API]
      |
      v
[PostgreSQL Database]
      |
      └── transactions
      └── users
      └── categories
      └── budgets
`
};
