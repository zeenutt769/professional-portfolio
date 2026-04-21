export const krishnaPath = {
    id: "krishna_path",
    title: "KrishnaPath",
    subtitle: "Your Divine AI Mentor — Where Ancient Wisdom Meets Modern Questions",
    description:
        "A full-stack AI-powered spiritual guidance platform inspired by the timeless teachings of the Bhagavad Gita. Ask life questions, receive verse-grounded responses, discover daily Shlokas, and reflect with calm poetic wisdom.",
    longDescription: `
KrishnaPath is a full-stack AI-powered spiritual guidance platform inspired by the timeless teachings of the Bhagavad Gita.

This is not just a chatbot. It is a digital sanctuary for reflection, clarity, and inner alignment.

 Ask Krishna (AI Chat)
Conversational AI inspired by Gita philosophy. Responses are verse-grounded, calm, metaphor-rich, and compassionate. Personalized addressing — Parth or Sakhi based on context.

 Daily Shlokas
Random Bhagavad Gita verse with Sanskrit text, English translation, and deeper spiritual interpretation.

 Bookmark & Reflect
Save meaningful responses and revisit saved Shlokas — stored locally for simplicity.

 Share Wisdom
Share responses instantly on WhatsApp with one tap.

 Immersive UI
Cosmic glowing background, smooth animations, elegant typography (Cinzel & EB Garamond), mobile-first responsive design.

 AI Philosophy Layer
The AI persona is engineered to speak as a compassionate spiritual mentor, use metaphors of nature, time, stars, and rivers, and encourage reflection — not blind instruction. It does not claim to be Lord Krishna — it reflects the philosophical essence of the Bhagavad Gita.
`,
    type: "AI Web App",
    tech: [
        "React 18",
        "Vite",
        "Tailwind CSS",
        "Next.js (App Router)",
        "Google Gemini 1.5 Pro",
        "Prisma ORM",
        "PostgreSQL (Neon)",
        "NextAuth",
        "React Router DOM",
        "Lucide Icons"
    ],
    links: {
        github: "https://github.com/zeenutt769/Project-Krishnapath",
        live: "https://github.com/zeenutt769/Project-Krishnapath"
    },
    image: "./krishnapath.png",
    date: "2025",
    role: "Full-Stack Developer & AI Engineer",
    highlights: [
        " Verse-grounded AI responses (Gemini 1.5 Pro, Gita philosophy persona)",
        " Daily Shloka engine: Sanskrit + English + spiritual interpretation",
        " Bookmark & Reflect — local storage for saved wisdom",
        " One-tap WhatsApp sharing of responses",
        " Cosmic immersive UI — Cinzel & EB Garamond typography",
        " AI persona: compassionate mentor, metaphors of nature & stars",
        " Prisma ORM + Neon PostgreSQL for persistent conversation history",
        " Frontend on Netlify, Backend on Vercel, DB on Neon"
    ],
    featured: true,
    languages: [
        { name: "TypeScript", percent: 55, color: "#3178c6" },
        { name: "JavaScript", percent: 30, color: "#f7df1e" },
        { name: "SQL", percent: 15, color: "#336791" }
    ],
    deployHistory: [
        {
            version: "v1.0",
            msg: "Live release — Gemini 1.5 Pro integration with daily Shloka engine and Neon DB.",
            time: "2025",
            status: "success"
        }
    ],
    snippet: `// KrishnaPath — Gemini AI Spiritual Persona
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const KRISHNA_SYSTEM_PROMPT = \`
You are a compassionate AI spiritual mentor inspired by the Bhagavad Gita.
Your responses must be:
- Grounded in Gita philosophy and relevant verses (cite shlokas when applicable)
- Warm, calm, and poetic — use metaphors of nature, rivers, stars, and time
- Addressed personally (use "Parth" for male, "Sakhi" for female perspective)
- Reflective and encouraging, never commanding or dogmatic
- Free of medical, legal, or psychological claims

You do NOT claim to be Lord Krishna.
You reflect the philosophical essence of the Bhagavad Gita.
\`;

export async function getGitaGuidance(
  question: string,
  history: { role: string; content: string }[]
) {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

  const chat = model.startChat({
    history: [
      { role: 'user', parts: [{ text: KRISHNA_SYSTEM_PROMPT }] },
      { role: 'model', parts: [{ text: 'I understand. I shall guide with the wisdom of the Gita.' }] },
      ...history.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.content }]
      }))
    ],
    generationConfig: { maxOutputTokens: 1024, temperature: 0.85 }
  });

  const result = await chat.sendMessage(question);
  return result.response.text();
}
`,
    architecture: `
🔹 Frontend (React 18 + Vite)
  → Tailwind CSS styling
  → React Router DOM navigation  
  → Lucide Icons
  → LocalStorage (bookmarks)
  → Runs on: localhost:5173
  → Deploy: Netlify / Vercel

🔹 Backend (Next.js App Router)
  → Google Gemini 1.5 Pro (AI engine)
  → Prisma ORM (DB access layer)
  → PostgreSQL via Neon (serverless)
  → NextAuth (authentication)
  → Runs on: localhost:3001
  → Deploy: Vercel

🔹 Database
  → Neon Serverless PostgreSQL
  → Stores: conversation history, bookmarks

🔐 AI Philosophy Layer:
  → Persona: compassionate Gita mentor
  → Tone: metaphors of nature, stars, rivers
  → Persona guard: no medical/legal claims
  → Not Lord Krishna — philosophical essence
`
};
