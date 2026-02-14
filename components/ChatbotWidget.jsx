"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";

const QUICK_PROMPTS = [
  "Quick revision plan for system design",
  "Ask me 3 React interview questions",
  "Explain consistent hashing simply",
];

const SOURCE_HINTS = [
  { path: "system-design/topics/consistent-hashing", label: "Consistent Hashing" },
  { path: "react/topics/useeffect", label: "useEffect Deep Dive" },
  { path: "golang/topics/channels", label: "Go Channels" },
  { path: "javascript/topics/closures-and-scope", label: "Closures and Scope" },
  { path: "nextjs/topics/server-components", label: "Server Components" },
  { path: "postgresql/topics/indexing", label: "PostgreSQL Indexing" },
  { path: "docker/topics/multi-stage-builds", label: "Docker Multi-stage Builds" },
  { path: "kubernetes/topics/services-and-ingress", label: "K8s Services and Ingress" },
  { path: "system-design/topics/rate-limiter", label: "Rate Limiter Design" },
];

const SOURCE_KEYWORDS = [
  {
    keywords: ["react", "useeffect", "use effect", "hooks", "reconciliation", "jsx"],
    sources: [
      { path: "react/topics/useeffect", label: "useEffect Deep Dive" },
      { path: "react/topics/reconciliation", label: "React Reconciliation" },
    ],
  },
  {
    keywords: ["go", "golang", "goroutine", "channel", "interface"],
    sources: [
      { path: "golang/topics/channels", label: "Go Channels" },
      { path: "golang/topics/goroutines", label: "Goroutines and Scheduler" },
    ],
  },
  {
    keywords: ["javascript", "js", "closure", "event loop", "debounce", "throttle"],
    sources: [
      { path: "javascript/topics/closures-and-scope", label: "Closures and Scope" },
      { path: "javascript/topics/event-loop", label: "Event Loop" },
    ],
  },
  {
    keywords: ["next", "nextjs", "server component", "ssr", "isr", "middleware"],
    sources: [
      { path: "nextjs/topics/server-components", label: "Server Components" },
      { path: "nextjs/topics/ssr-vs-ssg-isr", label: "SSR vs SSG vs ISR" },
    ],
  },
  {
    keywords: ["postgres", "postgresql", "sql", "index", "join", "window function"],
    sources: [
      { path: "postgresql/topics/indexing", label: "PostgreSQL Indexing" },
      { path: "postgresql/topics/window-functions", label: "Window Functions" },
    ],
  },
  {
    keywords: ["docker", "compose", "container", "image", "dockerfile"],
    sources: [
      { path: "docker/topics/multi-stage-builds", label: "Docker Multi-stage Builds" },
      { path: "docker/topics/networking", label: "Docker Networking" },
    ],
  },
  {
    keywords: ["kubernetes", "k8s", "pod", "deployment", "service", "ingress"],
    sources: [
      { path: "kubernetes/topics/core-objects", label: "K8s Core Objects" },
      { path: "kubernetes/topics/services-and-ingress", label: "Services and Ingress" },
    ],
  },
  {
    keywords: ["system design", "consistent hashing", "rate limiter", "scalability", "distributed"],
    sources: [
      { path: "system-design/topics/consistent-hashing", label: "Consistent Hashing" },
      { path: "system-design/topics/rate-limiter", label: "Rate Limiter Design" },
    ],
  },
];

// ── Technology-aware mock responses ─────────────────────────────────────────
const TECH_RESPONSES = {
  javascript: [
    "JavaScript closures capture variables from their lexical scope. When a function references a variable from an outer function, the inner function 'closes over' it — keeping it alive even after the outer function returns. This is the foundation of the module pattern, memoization, and most React hooks. In interviews, explain the difference between closure and scope chain, and mention that closures can cause memory leaks if not handled carefully in event listeners.",
    "The event loop is JavaScript's concurrency model. The call stack executes synchronous code, while async callbacks (setTimeout, fetch, etc.) go through the task queue (macrotasks) or microtask queue (Promises). Microtasks always drain before the next macrotask. Understanding this explains why `Promise.resolve().then(...)` runs before `setTimeout(..., 0)`. Key interview question: explain the output order of mixed sync/async code.",
    "Debouncing delays a function call until a pause in events (e.g., search-as-you-type waits 300ms after the last keystroke). Throttling limits calls to at most once per interval (e.g., scroll handlers). Both are implemented with closures and timers. Interview tip: implement both from scratch, explain when to use each, and mention that lodash provides production-ready versions with leading/trailing edge options.",
  ],
  react: [
    "React hooks follow two rules: (1) only call at the top level (no conditionals/loops) and (2) only call from React functions. useEffect's dependency array controls when the effect re-runs — empty array means mount-only, no array means every render. The cleanup function runs before re-running the effect and on unmount. Common interview mistake: forgetting that setState is asynchronous and batched in React 18.",
    "React reconciliation uses a virtual DOM diff algorithm. When state changes, React creates a new VDOM tree and compares it with the previous one. Keys help React identify which elements changed in lists — using array index as key causes bugs when items are reordered or deleted. Interview tip: explain why keys matter, what happens without them, and when `React.memo` helps avoid unnecessary re-renders.",
    "useState vs useReducer: useState is great for simple, independent state values. useReducer shines when state transitions are complex or when next state depends on previous state. useContext provides dependency injection without prop drilling but re-renders all consumers on any context value change. The common pattern is useReducer + useContext together for global state management as a lightweight Redux alternative.",
  ],
  nextjs: [
    "Next.js App Router uses React Server Components by default. Server Components run only on the server — they can directly access databases, read files, and fetch APIs without exposing secrets to the client. 'use client' marks the boundary where client-side interactivity begins. Interview point: Server Components reduce bundle size because their code never ships to the browser.",
    "SSR (getServerSideProps/server components) renders on every request — great for personalized or frequently changing data. SSG (generateStaticParams) pre-renders at build time — optimal for blogs, docs, and marketing pages. ISR (revalidate) combines both: serves static pages but re-generates them in the background after a set interval. Know when to use each and explain the trade-offs between TTFB, caching, and data freshness.",
    "Next.js middleware runs at the edge before a request is completed. Use it for auth checks, redirects, A/B testing, and request rewriting. API routes (route.js in App Router) handle server-side logic like form submissions and webhooks. The key difference: middleware intercepts requests before routing, while API routes are endpoints you call explicitly.",
  ],
  golang: [
    "Goroutines are lightweight threads managed by the Go runtime, not the OS. They start with ~2KB stack (vs 1MB for OS threads) and are multiplexed onto OS threads by the Go scheduler (M:N threading). Launch with `go func()`. Channels are the primary synchronization mechanism — use unbuffered channels for synchronization and buffered channels for producer-consumer patterns. Interview must-know: always handle goroutine lifecycle to prevent leaks.",
    "Go interfaces are satisfied implicitly — no 'implements' keyword needed. If a type has all the methods an interface requires, it satisfies that interface. The empty interface `interface{}` (or `any` in Go 1.18+) accepts any type. Common patterns: io.Reader/io.Writer for streaming, error interface for error handling, and Stringer for custom string representation. Interview tip: explain how interfaces enable dependency injection and testability.",
    "Go's error handling uses explicit return values instead of exceptions. The convention is `result, err := doSomething()` followed by `if err != nil { return err }`. Wrap errors with `fmt.Errorf('context: %w', err)` to add context while preserving the original error for `errors.Is()` and `errors.As()` checks. In interviews, discuss why Go chose this over try-catch and how it makes error paths explicit and visible in code review.",
  ],
  postgresql: [
    "PostgreSQL indexes: B-tree (default, great for equality and range), Hash (equality only, rarely better than B-tree), GIN (full-text search, JSONB, arrays), GiST (geometric, range types). Use EXPLAIN ANALYZE to check if queries use indexes. A composite index on (a, b) helps queries filtering on 'a' or 'a AND b' but NOT 'b' alone — this is the leftmost prefix rule. Interview must-know: indexes speed up reads but slow down writes.",
    "JOIN types: INNER JOIN returns matching rows from both tables. LEFT JOIN returns all left rows + matching right rows (NULL for no match). FULL OUTER JOIN returns all rows from both. CROSS JOIN produces the Cartesian product. In interviews, draw Venn diagrams and explain when each is appropriate. Know that PostgreSQL optimizes joins using Nested Loop, Hash Join, or Merge Join based on table sizes and indexes.",
    "Window functions like ROW_NUMBER(), RANK(), DENSE_RANK(), LAG(), LEAD(), and SUM() OVER() operate on a set of rows related to the current row without collapsing them into a group. Syntax: `function() OVER (PARTITION BY col ORDER BY col)`. Unlike GROUP BY, window functions preserve individual rows. Interview question: find the second highest salary per department — solved elegantly with ROW_NUMBER() OVER (PARTITION BY dept ORDER BY salary DESC).",
  ],
  docker: [
    "A Dockerfile defines how to build an image. Key instructions: FROM (base image), COPY/ADD (files), RUN (execute commands), CMD/ENTRYPOINT (startup command), EXPOSE (document ports), ENV (environment variables). Multi-stage builds use multiple FROM statements to keep final images small — build in a large image, copy only the binary to a minimal image like alpine or distroless. Interview tip: explain layer caching and why instruction order matters.",
    "Docker Compose orchestrates multi-container applications. Define services, networks, and volumes in docker-compose.yml. Key commands: `docker compose up -d` (start), `docker compose down` (stop + remove), `docker compose logs -f` (stream logs). Services communicate via DNS using their service name on a shared network. Interview scenario: explain how you'd set up a web app + database + cache with proper networking and volume persistence.",
    "Docker networking: bridge (default, containers on same host communicate), host (container shares host network stack — no port mapping needed), overlay (multi-host, used in Swarm/K8s), none (no networking). Use `docker network create` for custom networks where containers resolve each other by name. Interview must-know: explain port mapping (-p 8080:80), why containers on different networks can't communicate, and when to use host networking.",
  ],
  kubernetes: [
    "Kubernetes core objects: Pod (smallest deployable unit, 1+ containers sharing network/storage), Deployment (manages ReplicaSets for rolling updates), Service (stable network endpoint — ClusterIP, NodePort, LoadBalancer), ConfigMap/Secret (configuration), PersistentVolumeClaim (storage). Know the relationship: Deployment → ReplicaSet → Pod. Interview essential: explain how a Deployment handles rolling updates and rollbacks.",
    "Services and networking: ClusterIP (internal only), NodePort (exposes on each node's IP at a static port), LoadBalancer (provisions cloud LB). Ingress is an API object that manages external HTTP/HTTPS routing to Services — typically backed by nginx or traefik. DNS: `service-name.namespace.svc.cluster.local`. Interview question: explain how a request from the internet reaches a specific Pod through Ingress → Service → Endpoint → Pod.",
    "Resource management: requests (guaranteed minimum CPU/memory for scheduling) vs limits (maximum allowed — OOM kill if exceeded). HPA (Horizontal Pod Autoscaler) scales replicas based on CPU, memory, or custom metrics. Probes: livenessProbe (restart if failing), readinessProbe (remove from Service if failing), startupProbe (for slow-starting containers). Interview tip: explain what happens when a pod exceeds its memory limit vs CPU limit.",
  ],
  "system-design": [
    "URL shortener design: Generate a unique short code (Base62 encoding of an auto-increment ID or MD5 hash truncated to 7 chars), store mapping in a key-value store (Redis for hot reads, PostgreSQL for persistence). Handle 301 (cacheable) vs 302 (trackable) redirects. For scale: use consistent hashing to shard by short code, add a CDN for popular links, and implement rate limiting. Interview must-discuss: collision handling, analytics tracking, and expiration policies.",
    "Rate limiter patterns: Token Bucket (smooth rate with burst allowance), Sliding Window Log (precise but memory-heavy), Sliding Window Counter (good balance). Implement at API gateway level with Redis INCR + TTL. For distributed systems, use a centralized counter (Redis) or accept approximate counts (local counters synced periodically). Interview key points: discuss where to place the limiter (client, server, middleware), handling distributed rate limiting, and graceful degradation with 429 responses.",
    "Design a chat system: WebSocket connections for real-time messaging. Client connects to a Chat Server which routes messages through a Message Queue (Kafka). Messages stored in Cassandra (write-heavy, eventually consistent) with Redis caching recent conversations. Presence service tracks online/offline status with heartbeats. For group chat, fan-out on write (small groups) or fan-out on read (large channels). Interview must-cover: delivery guarantees (at-least-once), message ordering, read receipts, and offline message sync.",
  ],
};

const DEFAULT_RESPONSES = [
  "Great question! Let me break this down: Start with the core definition, then understand the 'why' behind it, and finally consider the trade-offs. In interviews, show that you think in layers — concept → implementation → edge cases → production considerations. Would you like me to dive deeper into any specific aspect?",
  "For interview prep, I recommend the following approach: (1) Understand the concept well enough to explain to a junior dev, (2) Know at least one real-world use case, (3) Be ready to discuss alternatives and trade-offs, (4) Have a code example or diagram ready. Which technology area would you like to focus on?",
  "Here is a structured way to think about this: First, clarify the problem scope and constraints. Then, identify the key data structures and algorithms involved. Finally, analyze time/space complexity and discuss optimizations. The best interview answers show systematic thinking, not just the right answer.",
];

function getMockResponse(technology, question) {
  const responses = TECH_RESPONSES[technology] || DEFAULT_RESPONSES;
  // Simple deterministic hash to pick a response based on question text
  let hash = 0;
  for (let i = 0; i < question.length; i++) {
    hash = (hash * 31 + question.charCodeAt(i)) | 0;
  }
  return responses[Math.abs(hash) % responses.length];
}

function getStableHash(text) {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = (hash * 31 + text.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

function pickSourcesForPrompt(prompt, count = 3) {
  const normalizedPrompt = prompt.toLowerCase();
  const pickedByKeyword = [];
  const seen = new Set();

  for (const group of SOURCE_KEYWORDS) {
    const matched = group.keywords.some((keyword) => normalizedPrompt.includes(keyword));
    if (!matched) continue;

    for (const source of group.sources) {
      if (seen.has(source.path)) continue;
      seen.add(source.path);
      pickedByKeyword.push(source);
      if (pickedByKeyword.length >= count) {
        return pickedByKeyword;
      }
    }
  }

  const fallback = [...pickedByKeyword];
  const hash = getStableHash(prompt);
  const start = SOURCE_HINTS.length === 0 ? 0 : hash % SOURCE_HINTS.length;

  for (let i = 0; i < SOURCE_HINTS.length && fallback.length < count; i++) {
    const candidate = SOURCE_HINTS[(start + i) % SOURCE_HINTS.length];
    if (seen.has(candidate.path)) continue;
    seen.add(candidate.path);
    fallback.push(candidate);
  }

  return fallback;
}

export default function ChatbotWidget() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [provider, setProvider] = useState("Gemini");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! I'm your interview prep assistant. Ask about any topic and I'll answer with grounded notes.",
      sources: [],
    },
  ]);
  const streamTimerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const hideWidget = pathname === "/login" || pathname === "/";

  // Detect technology from URL for context-aware responses
  const technology = useMemo(() => {
    const seg = pathname?.split("/")[1];
    if (seg && TECH_RESPONSES[seg]) return seg;
    if (seg === "system-design") return "system-design";
    return null;
  }, [pathname]);

  const techLabel = useMemo(() => {
    const map = {
      javascript: "JavaScript",
      react: "React",
      nextjs: "Next.js",
      "system-design": "System Design",
      golang: "Go",
      postgresql: "PostgreSQL",
      docker: "Docker",
      kubernetes: "Kubernetes",
    };
    return technology ? map[technology] || null : null;
  }, [technology]);

  // Unread indicator for FAB
  const [hasUnread, setHasUnread] = useState(false);
  const userMessageCount = messages.filter((m) => m.role === "user").length;

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (streamTimerRef.current) {
        clearInterval(streamTimerRef.current);
      }
    };
  }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when opened, clear unread
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setHasUnread(false);
    }
  }, [isOpen]);

  const shouldFallback = messages.length > 8;

  const streamAssistantReply = useCallback(
    (prompt) => {
      if (streamTimerRef.current) {
        clearInterval(streamTimerRef.current);
        streamTimerRef.current = null;
      }

      const fallbackActive = messages.length > 8;
      const selectedProvider = fallbackActive ? "Groq" : "Gemini";
      setProvider(selectedProvider);
      const sources = pickSourcesForPrompt(prompt, fallbackActive ? 2 : 3);

      // Use technology-aware mock responses
      const reply = getMockResponse(technology, prompt);

      setIsTyping(true);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "", sources },
      ]);

      let idx = 0;
      streamTimerRef.current = setInterval(() => {
        idx += 1;
        setMessages((prev) => {
          const next = [...prev];
          const target = next[next.length - 1];
          target.content = reply.slice(0, idx);
          return next;
        });

        if (idx >= reply.length) {
          clearInterval(streamTimerRef.current);
          streamTimerRef.current = null;
          setIsTyping(false);
          if (!isOpen) setHasUnread(true);
        }
      }, 12);
    },
    [technology, messages.length, isOpen]
  );

  const handleSend = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed || isTyping) return;

    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
    setInput("");
    streamAssistantReply(trimmed);
  }, [input, isTyping, streamAssistantReply]);

  const handleClear = () => {
    if (streamTimerRef.current) {
      clearInterval(streamTimerRef.current);
      streamTimerRef.current = null;
    }
    setIsTyping(false);
    setHasUnread(false);
    setMessages([
      {
        role: "assistant",
        content: "Chat cleared! Ask me anything about interview topics.",
        sources: [],
      },
    ]);
  };

  if (hideWidget) return null;

  // ── Closed state: floating action button ────────────────────────────────
  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="group fixed bottom-20 right-3 z-50 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500 text-white shadow-xl shadow-amber-500/25 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/30 sm:bottom-20 sm:right-6 sm:h-14 sm:w-14 dark:from-amber-500 dark:via-amber-600 dark:to-orange-600 dark:shadow-amber-600/20"
        aria-label="Open AI chat"
      >
        {/* Animated ring */}
        <span className="absolute inset-0 animate-ping rounded-2xl bg-amber-400/30 duration-1000 dark:bg-amber-500/20" style={{ animationDuration: "3s" }} />
        {/* Bot face icon */}
        <svg viewBox="0 0 28 28" className="relative h-7 w-7 transition-transform duration-300 group-hover:rotate-6" fill="none">
          <rect x="3" y="5" width="22" height="18" rx="6" fill="white" fillOpacity="0.25" />
          <rect x="3" y="5" width="22" height="18" rx="6" stroke="white" strokeWidth="1.5" />
          <circle cx="10.5" cy="14" r="2" fill="white" />
          <circle cx="17.5" cy="14" r="2" fill="white" />
          <path d="M10 19c1.5 1.5 6.5 1.5 8 0" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M14 5V2" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="14" cy="1.5" r="1" fill="white" />
        </svg>
        {/* Unread badge */}
        {(hasUnread || userMessageCount > 0) && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white ring-2 ring-white dark:ring-slate-900">
            {userMessageCount > 9 ? "9+" : userMessageCount || "!"}
          </span>
        )}
      </button>
    );
  }

  // ── Open state: chat panel ──────────────────────────────────────────────
  return (
    <>
      {/* Mobile backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-md sm:hidden"
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      <div className="fixed bottom-0 right-0 z-50 flex h-[100dvh] w-full flex-col overflow-hidden bg-white shadow-2xl sm:bottom-4 sm:right-4 sm:h-[580px] sm:w-[420px] sm:rounded-3xl sm:border sm:border-slate-200/80 dark:bg-slate-900 dark:sm:border-slate-700/80">
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="relative flex items-center justify-between bg-gradient-to-br from-amber-500 via-amber-500 to-orange-500 px-4 py-3.5 sm:rounded-t-3xl dark:from-amber-600 dark:via-amber-600 dark:to-orange-600">
          {/* Decorative dots */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden sm:rounded-t-3xl">
            <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10" />
            <div className="absolute -bottom-2 left-8 h-16 w-16 rounded-full bg-white/5" />
          </div>
          <div className="relative flex items-center gap-3">
            {/* Bot avatar */}
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
                <rect x="3" y="5" width="18" height="14" rx="5" stroke="white" strokeWidth="1.5" />
                <circle cx="9" cy="12" r="1.5" fill="white" />
                <circle cx="15" cy="12" r="1.5" fill="white" />
                <path d="M9 16c1.2 1.2 4.8 1.2 6 0" stroke="white" strokeWidth="1.3" strokeLinecap="round" />
                <path d="M12 5V3" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-tight text-white">Interview Buddy</h3>
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-sm shadow-emerald-400/50" />
                <p className="text-[11px] font-medium text-white/80">
                  {techLabel ? `${techLabel} · ${provider}` : `${provider} · Ready`}
                </p>
              </div>
            </div>
          </div>
          <div className="relative flex items-center gap-0.5">
            <button
              type="button"
              onClick={handleClear}
              className="rounded-xl p-2 text-white/70 transition hover:bg-white/15 hover:text-white"
              aria-label="Clear chat"
              title="Clear chat"
            >
              <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor">
                <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-xl p-2 text-white/70 transition hover:bg-white/15 hover:text-white"
              aria-label="Close chat"
            >
              <svg viewBox="0 0 20 20" className="h-5 w-5" fill="currentColor">
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </button>
          </div>
        </div>

        {/* ── Tech context pill ──────────────────────────────────────────── */}
        {techLabel && (
          <div className="flex items-center gap-2 border-b border-slate-100 bg-amber-50/60 px-4 py-1.5 dark:border-slate-800 dark:bg-amber-500/5">
            <svg viewBox="0 0 16 16" className="h-3 w-3 text-amber-600 dark:text-amber-400" fill="currentColor">
              <path d="M9.58 1.077a.75.75 0 01.405.82L8.77 6h4.48a.75.75 0 01.592 1.21l-5.5 7a.75.75 0 01-1.327-.74L8.23 9.5H3.75a.75.75 0 01-.592-1.21l5.5-7a.75.75 0 01.922-.213z" />
            </svg>
            <span className="text-[11px] font-medium text-amber-700 dark:text-amber-400">
              Tuned for <strong>{techLabel}</strong> interview prep
            </span>
          </div>
        )}

        {/* ── Messages ───────────────────────────────────────────────────── */}
        <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50/50 px-4 py-4 dark:bg-slate-900/50">
          {messages.map((msg, i) => {
            const isUser = msg.role === "user";
            return (
              <div
                key={`${msg.role}-${i}`}
                className={`flex items-end gap-2 ${isUser ? "flex-row-reverse" : "flex-row"}`}
              >
                {/* Avatar */}
                {!isUser && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-orange-400 shadow-sm dark:from-amber-500 dark:to-orange-500">
                    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="white">
                      <rect x="2" y="4" width="12" height="9" rx="3.5" />
                      <circle cx="6" cy="8.5" r="1" fill="#f59e0b" />
                      <circle cx="10" cy="8.5" r="1" fill="#f59e0b" />
                      <path d="M8 4V2.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
                    </svg>
                  </div>
                )}
                {/* Bubble */}
                <div
                  className={`max-w-[80%] text-sm leading-relaxed ${
                    isUser
                      ? "rounded-2xl rounded-br-md bg-gradient-to-br from-amber-500 to-orange-500 px-3.5 py-2.5 text-white shadow-sm dark:from-amber-600 dark:to-orange-600"
                      : "rounded-2xl rounded-bl-md border border-slate-200/80 bg-white px-3.5 py-2.5 text-slate-700 shadow-sm dark:border-slate-700/60 dark:bg-slate-800 dark:text-slate-200"
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                  {!isUser && msg.sources?.length > 0 && msg.content.length > 0 && (
                    <div className="mt-2.5 flex flex-wrap gap-1.5 border-t border-slate-100 pt-2 dark:border-slate-700/60">
                      {msg.sources.map((src) => (
                        <a
                          key={src.path}
                          href={`/${src.path.split("/topics/")[0]}`}
                          className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-700 transition hover:bg-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:hover:bg-amber-500/20"
                        >
                          <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" fill="currentColor">
                            <path d="M5.25 1.5a.75.75 0 01.75.75v3h3a.75.75 0 010 1.5h-3v3a.75.75 0 01-1.5 0v-3h-3a.75.75 0 010-1.5h3v-3a.75.75 0 01.75-.75z" />
                          </svg>
                          {src.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
                {isUser && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-200 dark:bg-slate-700">
                    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" fill="currentColor">
                      <path d="M8 8a3 3 0 100-6 3 3 0 000 6zM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 00-11.215 0c-.22.578.254 1.139.872 1.139h9.47z" />
                    </svg>
                  </div>
                )}
              </div>
            );
          })}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex items-end gap-2">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-orange-400 shadow-sm dark:from-amber-500 dark:to-orange-500">
                <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="white">
                  <rect x="2" y="4" width="12" height="9" rx="3.5" />
                  <circle cx="6" cy="8.5" r="1" fill="#f59e0b" />
                  <circle cx="10" cy="8.5" r="1" fill="#f59e0b" />
                  <path d="M8 4V2.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
              </div>
              <div className="flex items-center gap-1 rounded-2xl rounded-bl-md border border-slate-200/80 bg-white px-4 py-3 shadow-sm dark:border-slate-700/60 dark:bg-slate-800">
                <span className="h-2 w-2 animate-bounce rounded-full bg-amber-400" style={{ animationDelay: "0ms" }} />
                <span className="h-2 w-2 animate-bounce rounded-full bg-amber-400" style={{ animationDelay: "150ms" }} />
                <span className="h-2 w-2 animate-bounce rounded-full bg-amber-400" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* ── Quick prompts ──────────────────────────────────────────────── */}
        {messages.length <= 2 && !isTyping && (
          <div className="border-t border-slate-100 bg-white px-3 py-2.5 dark:border-slate-800 dark:bg-slate-900">
            <p className="mb-1.5 px-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Try asking
            </p>
            <div className="flex flex-col gap-1">
              {QUICK_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => {
                    setInput("");
                    setMessages((prev) => [...prev, { role: "user", content: prompt }]);
                    streamAssistantReply(prompt);
                  }}
                  className="group flex items-center gap-2 rounded-xl border border-slate-150 bg-slate-50/80 px-3 py-2 text-left text-xs text-slate-600 transition hover:border-amber-200 hover:bg-amber-50/80 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-400 dark:hover:border-amber-600/50 dark:hover:bg-amber-500/5"
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-amber-100 text-amber-600 transition group-hover:bg-amber-200 dark:bg-amber-500/15 dark:text-amber-400">
                    <svg viewBox="0 0 12 12" className="h-3 w-3" fill="currentColor">
                      <path fillRule="evenodd" d="M6 1.5a.75.75 0 01.75.75v3h3a.75.75 0 010 1.5h-3v3a.75.75 0 01-1.5 0v-3h-3a.75.75 0 010-1.5h3v-3A.75.75 0 016 1.5z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <span className="truncate">{prompt}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Input bar ──────────────────────────────────────────────────── */}
        <div className="border-t border-slate-200 bg-white px-3 pb-3 pt-2.5 dark:border-slate-700 dark:bg-slate-900">
          <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 pr-1.5 transition-colors focus-within:border-amber-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-amber-200/50 dark:border-slate-700 dark:bg-slate-800 dark:focus-within:border-amber-500 dark:focus-within:bg-slate-800 dark:focus-within:ring-amber-500/15">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder={techLabel ? `Ask about ${techLabel}...` : "Ask an interview question..."}
              disabled={isTyping}
              className="min-w-0 flex-1 bg-transparent px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none disabled:opacity-50 dark:text-slate-200 dark:placeholder-slate-500"
            />
            <button
              type="button"
              onClick={handleSend}
              disabled={isTyping || !input.trim()}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-sm transition hover:from-amber-500 hover:to-orange-600 disabled:opacity-30 disabled:shadow-none dark:from-amber-500 dark:to-orange-600"
              aria-label="Send message"
            >
              <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor">
                <path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.925A1.5 1.5 0 005.135 9.25h6.115a.75.75 0 010 1.5H5.135a1.5 1.5 0 00-1.442 1.086l-1.414 4.926a.75.75 0 00.826.95 28.896 28.896 0 0015.293-7.154.75.75 0 000-1.115A28.897 28.897 0 003.105 2.289z" />
              </svg>
            </button>
          </div>
          <p className="mt-1.5 text-center text-[10px] text-slate-400 dark:text-slate-500">
            Mock mode · Responses are pre-written
          </p>
        </div>
      </div>
    </>
  );
}
