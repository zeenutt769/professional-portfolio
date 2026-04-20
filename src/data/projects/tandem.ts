export const tandem = {
    id: "tandem",
    title: "TANDEM",
    subtitle: "Real-time Collaborative Code Editor",
    description:
        "Code together, in real-time. No lag. No conflict. Just go with the flow. Multi-user collaborative editor using Yjs CRDT — same sync tech as Figma & Notion — with live cursors, chat, code execution, and Monaco Editor.",
    longDescription: `
TANDEM is a real-time collaborative code editor built for seamless multi-user development. Multiple engineers can edit the same file simultaneously — with zero conflicts, zero lag, and live cursors showing exactly who is typing and where.

 CRDT Sync via Yjs — The same conflict-free synchronization technology powering Figma and Notion. Mathematical merges mean two users can never corrupt each other's work — even offline.

 Live Collaboration — Multiple users editing the same file simultaneously with colored live cursors and named labels (Google Docs-style).

 Live Context-Aware Chat — Dedicated chat panel with a Snippet Approval System: request workspace permission before injecting code snippets.

 Code Execution — Run code directly in the browser via a backend JDoodle API proxy. Supports JavaScript, Python, C++, Java, Go, Rust, TypeScript, C.

 Persistent Rooms — Powered by Neon Serverless PostgreSQL. Resume any session instantly via a 6-character Room code.

 Monaco Editor — The same robust engine powering VS Code, with IntelliSense natively.

 Shared Terminal Focus — Auto-synchronized output terminals keep your team on the same line.

 Auto-formatting — One-click format code, auto-closing brackets, and smart indent.

 Tip: Open two browser tabs → same Room ID → type in one → watch it appear in the other instantly.
`,
    type: "Real-time Collaborative App",
    tech: [
        "React 18",
        "Vite",
        "Yjs (CRDT)",
        "Socket.io",
        "Monaco Editor",
        "Node.js",
        "Express.js",
        "PostgreSQL (Neon)",
        "Framer Motion",
        "JDoodle API",
        "WebSocket",
        "Docker"
    ],
    links: {
        github: "https://github.com/zeenutt769/TANDEM",
        live: "https://tandem-editor.vercel.app"
    },
    image: "https://opengraph.githubassets.com/1/zeenutt769/TANDEM",
    date: "2025",
    role: "Full-Stack Developer",
    highlights: [
        " Yjs CRDT sync — same tech as Figma & Notion (upgraded from OT)",
        " Live cursors & named labels via Yjs Awareness protocol",
        " Chat Snippet Approval System (Antigravity-style permissions)",
        " Neon Serverless PostgreSQL for persistent room states",
        " Multi-language code execution via JDoodle API proxy",
        " Monaco Editor — full VS Code IntelliSense experience",
        " 6-char shareable Room codes for instant team invites",
        " Shared Terminal Focus with auto-sync scroll",
        " Docker Compose for optional Redis persistence"
    ],
    featured: true,
    languages: [
        { name: "JavaScript", percent: 55, color: "#f7df1e" },
        { name: "TypeScript", percent: 30, color: "#3178c6" },
        { name: "SQL", percent: 10, color: "#336791" },
        { name: "Docker", percent: 5, color: "#2496ed" }
    ],
    deployHistory: [
        {
            version: "v2.0",
            msg: "Upgraded OT → Yjs CRDT. Added live cursors, snippet approval, Neon DB.",
            time: "2025",
            status: "success"
        },
        {
            version: "v1.0",
            msg: "Initial OT-based real-time sync, Socket.io, Monaco Editor",
            time: "2025",
            status: "success"
        }
    ],
    snippet: `// TANDEM — Yjs CRDT Real-time Sync
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { MonacoBinding } from 'y-monaco';

// Shared document — one instance per room
const ydoc = new Y.Doc();

// Connect to backend via WebSocket
const provider = new WebsocketProvider(
  'ws://localhost:3001', roomId, ydoc
);

// Yjs Awareness — live cursors + user colors
provider.awareness.setLocalStateField('user', {
  name: username,
  color: generateUserColor(userId),
  colorLight: generateUserColorLight(userId)
});

// Bind Monaco Editor to the shared Yjs text type
const ytext = ydoc.getText('monaco');
const monacoBinding = new MonacoBinding(
  ytext,
  editor.getModel(),
  new Set([editor]),
  provider.awareness
);

// ✓ Any edit by any user is now:
// → Merged mathematically (no conflicts possible)
// → Synced to all peers via WebSocket
// → Persisted to Neon PostgreSQL on disconnect
`,
    architecture: `
TANDEM/ 
├── client/                   # React 18 + Vite Frontend
│   └── src/
│       ├── components/       # Editor (Yjs), Toolbar, UserList,
│       │                     # RoomJoin, OutputPanel, Chat
│       ├── hooks/            # useSocket, useCodeRunner
│       ├── utils/            # colors.js, roomUtils.js
│       └── constants/        # languages.js (JDoodle configs)
│
├── server/                   # Node.js + Express Backend
│   └── src/
│       ├── handlers/         # roomHandler, editorHandler, cursorHandler
│       ├── store/            # roomStore.js (in-memory, Redis-ready)
│       └── middleware/       # rateLimiter.js
│       └── index.js          # Express + Socket.io + Yjs WS server
│
├── shared/
│   └── constants.js          # Socket event names (DRY — both sides)
│
├── DEVLOG.md                 # Day-by-day decisions, bugs, fixes
└── docker-compose.yml        # Local Redis setup

Deploy:
  Frontend  → Vercel
  Backend   → Railway
  Database  → Neon Serverless PostgreSQL
`
};
