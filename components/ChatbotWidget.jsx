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

  const hideWidget = pathname === "/login";

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

  const sourceSuggestions = useMemo(() => {
    return SOURCE_HINTS.slice(0, shouldFallback ? 2 : 3);
  }, [shouldFallback]);

  const streamAssistantReply = useCallback(
    (prompt) => {
      if (streamTimerRef.current) {
        clearInterval(streamTimerRef.current);
        streamTimerRef.current = null;
      }

      const fallbackActive = messages.length > 8;
      const selectedProvider = fallbackActive ? "Groq" : "Gemini";
      setProvider(selectedProvider);

      // Use technology-aware mock responses
      const reply = getMockResponse(technology, prompt);

      setIsTyping(true);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "", sources: sourceSuggestions },
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
    [technology, sourceSuggestions, messages.length, isOpen]
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

  // ── Closed state: floating button ───────────────────────────────────────
  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-3 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-amber-500 text-white shadow-lg transition hover:scale-110 hover:bg-amber-600 sm:bottom-6 sm:right-6 sm:h-14 sm:w-14 dark:bg-amber-600 dark:hover:bg-amber-500"
        aria-label="Open AI chat"
      >
        <svg viewBox="0 0 24 24" className="h-6 w-6 sm:h-7 sm:w-7" fill="none" stroke="currentColor" strokeWidth={2}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
        {/* Unread / active indicator */}
        {(hasUnread || userMessageCount > 0) && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white ring-2 ring-white dark:ring-slate-900">
            {userMessageCount > 9 ? "9+" : userMessageCount || "!"}
          </span>
        )}
      </button>
    );
  }

  // ── Open state: full chat panel ─────────────────────────────────────────
  return (
    <>
      {/* Mobile backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm sm:hidden"
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      <div className="fixed bottom-0 right-0 z-50 flex h-[100dvh] w-full flex-col border-l border-slate-200 bg-white shadow-2xl sm:bottom-4 sm:right-4 sm:h-[540px] sm:w-[400px] sm:rounded-2xl sm:border dark:border-slate-700 dark:bg-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-3 sm:rounded-t-2xl dark:border-slate-700 dark:from-amber-600 dark:to-amber-700">
          <div>
            <h3 className="text-sm font-bold text-white">AI Prep Chat</h3>
            <p className="text-[11px] text-amber-100">
              {techLabel ? `${techLabel} · ${provider}` : `Provider: ${provider}`}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleClear}
              className="rounded-lg p-1.5 text-amber-100 transition hover:bg-white/20"
              aria-label="Clear chat"
              title="Clear chat"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-1.5 text-amber-100 transition hover:bg-white/20"
              aria-label="Close chat"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Technology context banner */}
        {techLabel && (
          <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-4 py-1.5 text-[11px] dark:border-slate-800 dark:bg-slate-800/50">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span className="text-slate-500 dark:text-slate-400">
              Context: <strong className="text-slate-700 dark:text-slate-300">{techLabel}</strong> — answers tuned for this topic
            </span>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 space-y-2 overflow-y-auto px-4 py-4">
          {messages.map((msg, i) => (
            <div
              key={`${msg.role}-${i}`}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-amber-500 text-white dark:bg-amber-600"
                    : "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200"
                }`}
              >
                <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                {msg.role === "assistant" && msg.sources?.length > 0 && msg.content.length > 0 && (
                  <div className="mt-2 border-t border-slate-200 pt-2 dark:border-slate-700">
                    <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      Sources
                    </p>
                    {msg.sources.map((src) => (
                      <a
                        key={src.path}
                        href={`/${src.path.split("/topics/")[0]}`}
                        className="block text-xs text-amber-600 hover:underline dark:text-amber-400"
                      >
                        {src.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-center gap-1.5 rounded-2xl bg-slate-100 px-4 py-3 dark:bg-slate-800">
                <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 dark:bg-slate-500" style={{ animationDelay: "0ms" }} />
                <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 dark:bg-slate-500" style={{ animationDelay: "150ms" }} />
                <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 dark:bg-slate-500" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick prompts (shown when few messages) */}
        {messages.length <= 2 && !isTyping && (
          <div className="flex flex-wrap gap-1.5 border-t border-slate-100 px-4 py-2 dark:border-slate-800">
            {QUICK_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => {
                  setInput("");
                  setMessages((prev) => [...prev, { role: "user", content: prompt }]);
                  streamAssistantReply(prompt);
                }}
                className="rounded-full border border-slate-200 px-2.5 py-1 text-[11px] text-slate-600 transition hover:border-amber-300 hover:bg-amber-50 dark:border-slate-700 dark:text-slate-400 dark:hover:border-amber-600 dark:hover:bg-amber-500/10"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="border-t border-slate-200 px-3 py-3 dark:border-slate-700">
          <div className="flex items-end gap-2">
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
              className="flex-1 rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-200 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:placeholder-slate-500 dark:focus:border-amber-500 dark:focus:ring-amber-500/20"
            />
            <button
              type="button"
              onClick={handleSend}
              disabled={isTyping || !input.trim()}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white transition hover:bg-amber-600 disabled:opacity-40 dark:bg-amber-600 dark:hover:bg-amber-500"
              aria-label="Send message"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          <p className="mt-1.5 text-center text-[10px] text-slate-400 dark:text-slate-500">
            AI-powered (mock mode) · Responses may be inaccurate
          </p>
        </div>
      </div>
    </>
  );
}
