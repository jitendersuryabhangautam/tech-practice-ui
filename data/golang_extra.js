export const golangExtraData = [
  {
    category: "Backend Development",
    topics: [
      {
        id: "db-connection",
        title: "Database Connection (database/sql)",
        description:
          "Use database/sql with pooled connections, context-aware queries, and safe parameterized SQL.",
        explanation:
          "Interview focus: sql.Open vs PingContext, connection pool tuning, transactions, and proper error handling (especially sql.ErrNoRows).",
        code: `db, err := sql.Open("postgres", dsn)
if err != nil { return err }
defer db.Close()
db.SetMaxOpenConns(25)
db.SetMaxIdleConns(10)
ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
defer cancel()
if err := db.PingContext(ctx); err != nil { return err }`,
        example: `var name string
err := db.QueryRowContext(ctx, "SELECT name FROM users WHERE id=$1", id).Scan(&name)
if err == sql.ErrNoRows {
  return "", errors.New("not found")
}`,
        useCase:
          "Production APIs with PostgreSQL/MySQL, repository pattern, transactional business logic.",
        interviewQuestions: [
          {
            question: "What does database/sql provide?",
            answer: "A standard abstraction over SQL drivers with pooled connections.",
          },
          {
            question: "Does sql.Open validate connectivity?",
            answer: "Not fully; use Ping/PingContext for actual connectivity checks.",
          },
          {
            question: "Why pass context to DB calls?",
            answer: "To enforce deadlines and cancellation under slow or failing infrastructure.",
          },
          {
            question: "How do you prevent SQL injection?",
            answer: "Use placeholders with query parameters, never string-concatenate user input.",
          },
          {
            question: "When do you use QueryRowContext?",
            answer: "When expecting a single row result.",
          },
          {
            question: "How do you handle missing rows?",
            answer: "Check `err == sql.ErrNoRows` and map to domain error.",
          },
          {
            question: "Why close rows from QueryContext?",
            answer: "To release resources and avoid connection leaks/pool starvation.",
          },
          {
            question: "When should transactions be used?",
            answer: "When multiple writes must succeed or fail as one atomic unit.",
          },
          {
            question: "Should sql.DB be created per request?",
            answer: "No. Create once and reuse globally.",
          },
          {
            question: "What pool settings usually matter?",
            answer:
              "SetMaxOpenConns, SetMaxIdleConns, SetConnMaxLifetime (and optionally max idle lifetime).",
          },
        ],
        exercises: [
          {
            type: "implement",
            question: "Implement DB startup health check with 2 second timeout.",
          },
          {
            type: "implement",
            question: "Write repository GetByID method returning domain not-found error.",
          },
          {
            type: "output",
            question: "What does Scan return when no row exists?",
            answer: "sql.ErrNoRows",
          },
          {
            type: "debug",
            question: "Rows are never closed in loop. What symptom appears?",
            answer: "Connection leak and eventual DB pool exhaustion.",
          },
          {
            type: "debug",
            question: "API hangs under DB load. Which settings do you inspect first?",
          },
          {
            type: "scenario",
            question: "Design transaction rollback strategy for money transfer flow.",
          },
          {
            type: "implement",
            question: "Add parameterized insert with context timeout.",
          },
          {
            type: "scenario",
            question: "Propagate request context from handler to repository.",
          },
          {
            type: "tricky",
            question: "Is sql.DB concurrency-safe?",
            answer: "Yes.",
          },
          {
            type: "tricky",
            question: "Should you build SQL with fmt.Sprintf(userInput)?",
            answer: "No.",
          },
        ],
        programExercises: [
          {
            type: "program",
            question: "Program 1: Ping DB with timeout.",
            code: `ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
defer cancel()
fmt.Println(db.PingContext(ctx) == nil)`,
            output: "true (if DB reachable)",
          },
          {
            type: "program",
            question: "Program 2: Query one row by id.",
            code: `var email string
err := db.QueryRowContext(ctx, "SELECT email FROM users WHERE id=$1", 1).Scan(&email)
fmt.Println(err == nil)`,
            output: "true (if row exists)",
          },
          {
            type: "program",
            question: "Program 3: Insert and rows affected.",
            code: `res, _ := db.ExecContext(ctx, "INSERT INTO logs(message) VALUES($1)", "hello")
n, _ := res.RowsAffected()
fmt.Println(n)`,
            output: "1",
          },
          {
            type: "program",
            question: "Program 4: Handle sql.ErrNoRows branch.",
            code: `err := db.QueryRowContext(ctx, "SELECT id FROM users WHERE id=$1", -1).Scan(new(int64))
fmt.Println(err == sql.ErrNoRows)`,
            output: "true",
          },
          {
            type: "program",
            question: "Program 5: Basic transaction commit/rollback flow.",
            code: `tx, _ := db.BeginTx(ctx, nil)
_, err := tx.ExecContext(ctx, "UPDATE items SET stock=stock-1 WHERE id=$1", 1)
if err != nil { _ = tx.Rollback() } else { _ = tx.Commit() }`,
            output: "transaction path executed",
          },
          {
            type: "program",
            question: "Program 6: Pool setting and stats snapshot.",
            code: `db.SetMaxOpenConns(30)
fmt.Println(db.Stats().MaxOpenConnections)`,
            output: "30",
          },
          {
            type: "program",
            question: "Program 7: Iterate rows with defer Close.",
            code: `rows, _ := db.QueryContext(ctx, "SELECT id FROM users LIMIT 2")
defer rows.Close()
for rows.Next() { var id int; _ = rows.Scan(&id); fmt.Println(id) }`,
            output: "prints ids",
          },
          {
            type: "program",
            question: "Program 8: Prepared statement reuse.",
            code: `stmt, _ := db.PrepareContext(ctx, "SELECT name FROM users WHERE id=$1")
defer stmt.Close()
var name string
_ = stmt.QueryRowContext(ctx, 1).Scan(&name)
fmt.Println(name)`,
            output: "prints user name",
          },
          {
            type: "program",
            question: "Program 9: Timeout cancellation demo.",
            code: `ctx, cancel := context.WithTimeout(context.Background(), time.Nanosecond)
defer cancel()
fmt.Println(db.PingContext(ctx) != nil)`,
            output: "true",
          },
          {
            type: "program",
            question: "Program 10: Repository interface contract.",
            code: `type UserRepo interface {
  GetByID(ctx context.Context, id int64) (User, error)
}`,
            output: "compiles",
          },
        ],
      },
      {
        id: "redis-connection",
        title: "Redis Connection (go-redis)",
        description:
          "Connect Go services to Redis for cache, counters, and lightweight coordination.",
        explanation:
          "Interview focus: redis.Nil behavior, TTL strategy, cache-aside flow, and timeout/circuit fallback under outages.",
        code: `rdb := redis.NewClient(&redis.Options{Addr: "localhost:6379"})
defer rdb.Close()
if err := rdb.Ping(ctx).Err(); err != nil { return err }`,
        example: `_ = rdb.Set(ctx, "k", "v", time.Minute).Err()
v, err := rdb.Get(ctx, "k").Result()`,
        useCase: "Caching expensive reads, rate limiting, OTP/session storage.",
        interviewQuestions: [
          { question: "What does redis.Nil indicate?", answer: "Key miss." },
          {
            question: "Why add TTL to cache keys?",
            answer: "To avoid stale infinite data and control memory.",
          },
          {
            question: "What is cache-aside?",
            answer: "Read cache -> miss -> source -> write cache.",
          },
          {
            question: "Set vs SetNX?",
            answer: "Set writes always, SetNX writes only when absent.",
          },
          {
            question: "Why use context on Redis calls?",
            answer: "Timeout/cancel support under network failure.",
          },
          {
            question: "What is cache stampede?",
            answer: "Many concurrent misses recompute same expensive value.",
          },
          {
            question: "How to reduce stampede risk?",
            answer: "Singleflight lock + jittered TTL + prewarm.",
          },
          {
            question: "When to use Redis pipeline?",
            answer: "Batch commands to reduce round trips.",
          },
          {
            question: "Can Redis replace SQL database completely?",
            answer: "Usually no, it complements primary persistence.",
          },
          {
            question: "What happens if expiration is zero?",
            answer: "Key persists until delete/overwrite.",
          },
        ],
        exercises: [
          {
            type: "implement",
            question: "Implement getOrSet cache helper with loader + TTL.",
          },
          {
            type: "output",
            question: "Get on missing key returns what error?",
            answer: "redis.Nil",
          },
          {
            type: "debug",
            question: "Stale cache persists forever. What was likely missing?",
            answer: "TTL/invalidation.",
          },
          {
            type: "scenario",
            question: "Design login attempt rate limiter using INCR + EXPIRE.",
          },
          {
            type: "implement",
            question: "Store/retrieve JSON payload in Redis.",
          },
          {
            type: "debug",
            question: "Requests hang when Redis is down. What to add?",
            answer: "Timeouts and fallback/circuit strategy.",
          },
          {
            type: "scenario",
            question: "Invalidate cache key after successful DB update.",
          },
          {
            type: "tricky",
            question: "Is redis.Nil == nil?",
            answer: "No.",
          },
          {
            type: "tricky",
            question: "Is Redis data typed automatically in Go?",
            answer: "No, values are serialized/deserialized.",
          },
          {
            type: "implement",
            question: "Use SetNX for short lock key with expiry.",
          },
        ],
        programExercises: [
          {
            type: "program",
            question: "Program 1: Create client and ping.",
            code: `rdb := redis.NewClient(&redis.Options{Addr:"localhost:6379"})
fmt.Println(rdb.Ping(ctx).Err() == nil)`,
            output: "true",
          },
          {
            type: "program",
            question: "Program 2: Set/get key with TTL.",
            code: `_ = rdb.Set(ctx, "k", "v", time.Minute).Err()
v, _ := rdb.Get(ctx, "k").Result()
fmt.Println(v)`,
            output: "v",
          },
          {
            type: "program",
            question: "Program 3: Missing key check.",
            code: `_, err := rdb.Get(ctx, "missing").Result()
fmt.Println(err == redis.Nil)`,
            output: "true",
          },
          {
            type: "program",
            question: "Program 4: Counter increment.",
            code: `n, _ := rdb.Incr(ctx, "hits").Result()
fmt.Println(n)`,
            output: "1 (or incremented value)",
          },
          {
            type: "program",
            question: "Program 5: Conditional set with SetNX.",
            code: `ok, _ := rdb.SetNX(ctx, "lock:key", "1", 5*time.Second).Result()
fmt.Println(ok)`,
            output: "true (if absent)",
          },
          {
            type: "program",
            question: "Program 6: Delete and verify miss.",
            code: `_ = rdb.Del(ctx, "k").Err()
fmt.Println(rdb.Get(ctx, "k").Err() == redis.Nil)`,
            output: "true",
          },
          {
            type: "program",
            question: "Program 7: Pipeline execution.",
            code: `pipe := rdb.Pipeline()
pipe.Set(ctx, "a", "1", 0)
pipe.Incr(ctx, "a")
_, _ = pipe.Exec(ctx)`,
            output: "commands executed",
          },
          {
            type: "program",
            question: "Program 8: Store JSON in Redis.",
            code: `raw, _ := json.Marshal(map[string]string{"name":"go"})
_ = rdb.Set(ctx, "u:1", raw, time.Minute).Err()`,
            output: "stored",
          },
          {
            type: "program",
            question: "Program 9: Read JSON from Redis.",
            code: `b, _ := rdb.Get(ctx, "u:1").Bytes()
var m map[string]string
_ = json.Unmarshal(b, &m)
fmt.Println(m["name"])`,
            output: "go",
          },
          {
            type: "program",
            question: "Program 10: TTL check.",
            code: `ttl, _ := rdb.TTL(ctx, "u:1").Result()
fmt.Println(ttl > 0)`,
            output: "true",
          },
        ],
      },
      {
        id: "api-development",
        title: "API Development (net/http)",
        description:
          "Build HTTP JSON APIs with method guards, validation, middleware, and graceful shutdown.",
        explanation:
          "Interview focus: thin handlers, status code semantics, consistent error models, and context propagation.",
        code: `mux := http.NewServeMux()
mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
  w.Header().Set("Content-Type", "application/json")
  _ = json.NewEncoder(w).Encode(map[string]string{"status":"ok"})
})
log.Fatal(http.ListenAndServe(":8080", mux))`,
        example: `if r.Method != http.MethodPost {
  http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
  return
}`,
        useCase: "Service APIs, webhooks, internal backend endpoints.",
        interviewQuestions: [
          {
            question: "Why keep handlers thin?",
            answer: "Better testability and separation of concerns.",
          },
          {
            question: "Why set Content-Type explicitly?",
            answer: "Clients and gateways parse response correctly as JSON.",
          },
          {
            question: "When to return 201?",
            answer: "After successful resource creation.",
          },
          {
            question: "Method guard purpose?",
            answer: "Return 405 for unsupported methods and enforce contract.",
          },
          {
            question: "How to validate JSON payloads?",
            answer: "Decode + field validation + proper 400/422 response.",
          },
          {
            question: "Why pass r.Context downstream?",
            answer: "Timeout and cancellation propagation.",
          },
          {
            question: "What does middleware solve?",
            answer: "Cross-cutting concerns like logging/auth/recovery.",
          },
          {
            question: "How to protect from oversized payload?",
            answer: "Use http.MaxBytesReader.",
          },
          {
            question: "How to shut down gracefully?",
            answer: "Use http.Server.Shutdown(ctx).",
          },
          {
            question: "Common decode bug?",
            answer: "Ignoring json decode errors and proceeding.",
          },
        ],
        exercises: [
          {
            type: "implement",
            question: "Implement GET /health returning JSON.",
          },
          {
            type: "implement",
            question: "Implement POST /users with decode and validation.",
          },
          {
            type: "output",
            question: "Status code for method not allowed?",
            answer: "405",
          },
          {
            type: "debug",
            question: "API returns text/plain not JSON. What to fix?",
          },
          {
            type: "scenario",
            question: "Add logging middleware with duration.",
          },
          {
            type: "implement",
            question: "Write JSON error helper.",
          },
          {
            type: "debug",
            question: "Huge payload crashes service. What protection?",
          },
          {
            type: "scenario",
            question: "Propagate request timeout to DB layer.",
          },
          {
            type: "tricky",
            question: "Are net/http handlers concurrent?",
            answer: "Yes.",
          },
          {
            type: "tricky",
            question: "Should panic be used for validation errors?",
            answer: "No.",
          },
        ],
        programExercises: [
          {
            type: "program",
            question: "Program 1: Minimal health endpoint.",
            code: `mux := http.NewServeMux()
mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
  _ = json.NewEncoder(w).Encode(map[string]string{"status":"ok"})
})`,
            output: "serves /health",
          },
          {
            type: "program",
            question: "Program 2: Method guard block.",
            code: `if r.Method != http.MethodPost {
  http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
  return
}`,
            output: "405 on invalid method",
          },
          {
            type: "program",
            question: "Program 3: Decode JSON body.",
            code: `var body map[string]string
if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
  http.Error(w, "bad request", http.StatusBadRequest)
  return
}`,
            output: "decoded or 400",
          },
          {
            type: "program",
            question: "Program 4: writeJSON helper.",
            code: `func writeJSON(w http.ResponseWriter, code int, v any) {
  w.Header().Set("Content-Type", "application/json")
  w.WriteHeader(code)
  _ = json.NewEncoder(w).Encode(v)
}`,
            output: "helper ready",
          },
          {
            type: "program",
            question: "Program 5: writeErr helper.",
            code: `func writeErr(w http.ResponseWriter, code int, msg string) {
  writeJSON(w, code, map[string]string{"error": msg})
}`,
            output: "consistent error body",
          },
          {
            type: "program",
            question: "Program 6: Logging middleware.",
            code: `func logging(next http.Handler) http.Handler {
  return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
    start := time.Now()
    next.ServeHTTP(w, r)
    log.Println(r.Method, r.URL.Path, time.Since(start))
  })
}`,
            output: "logs method/path/duration",
          },
          {
            type: "program",
            question: "Program 7: Query param read.",
            code: `id := r.URL.Query().Get("id")
fmt.Fprintln(w, "id:", id)`,
            output: "prints id",
          },
          {
            type: "program",
            question: "Program 8: Limit body size.",
            code: `r.Body = http.MaxBytesReader(w, r.Body, 1<<20)`,
            output: "max 1MB",
          },
          {
            type: "program",
            question: "Program 9: Graceful shutdown skeleton.",
            code: `srv := &http.Server{Addr: ":8080", Handler: mux}
go srv.ListenAndServe()
ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
defer cancel()
_ = srv.Shutdown(ctx)`,
            output: "graceful shutdown flow",
          },
          {
            type: "program",
            question: "Program 10: Not found fallback check.",
            code: `if r.URL.Path != "/" {
  http.NotFound(w, r)
  return
}`,
            output: "404 for unknown routes",
          },
        ],
      },
      {
        id: "inbuilt-functions",
        title: "Inbuilt Functions and Purpose",
        description:
          "Core Go built-ins (len, cap, make, new, append, copy, delete) and common stdlib utility functions.",
        explanation:
          "Interview focus: make vs new, append semantics, nil map behavior, copy return value, and standard utility packages.",
        code: `s := make([]int, 0, 4)
s = append(s, 1, 2)
fmt.Println(len(s), cap(s))`,
        example: `src := []int{1,2,3}
dst := make([]int, len(src))
n := copy(dst, src)
fmt.Println(n, dst)`,
        useCase: "Coding rounds, utility logic, data transformations.",
        interviewQuestions: [
          {
            question: "make vs new?",
            answer:
              "make initializes slice/map/channel and returns T; new returns pointer to zeroed T.",
          },
          {
            question: "Why reassign append result?",
            answer: "append may return a new slice header.",
          },
          {
            question: "copy returns what?",
            answer: "Number of elements copied.",
          },
          {
            question: "Can you write to nil map?",
            answer: "No, it panics.",
          },
          {
            question: "len(nilSlice) ?",
            answer: "0",
          },
          {
            question: "delete missing key panic?",
            answer: "No, safe no-op.",
          },
          {
            question: "When to use panic/recover?",
            answer: "Exceptional boundaries only, not normal control flow.",
          },
          {
            question: "String to int conversion package?",
            answer: "strconv.",
          },
          {
            question: "Efficient string build in loop?",
            answer: "strings.Builder.",
          },
          {
            question: "Is copy deep for nested references?",
            answer: "No, shallow copy of elements.",
          },
        ],
        exercises: [
          { type: "output", question: "len(nilSlice) ?", answer: "0" },
          {
            type: "output",
            question: "delete(map, missingKey) result?",
            answer: "safe no-op",
          },
          {
            type: "implement",
            question: "Write clone helper for []int using copy.",
          },
          {
            type: "implement",
            question: "Parse integer from string with validation.",
          },
          {
            type: "debug",
            question: "append result ignored; what bug appears?",
          },
          {
            type: "scenario",
            question: "Choose strings.Builder vs + in loop and justify.",
          },
          {
            type: "implement",
            question: "Initialize map safely before write.",
          },
          {
            type: "tricky",
            question: "cap meaning for slice?",
            answer: "Max elements before reallocation.",
          },
          { type: "debug", question: "nil map write panic fix?" },
          {
            type: "implement",
            question: "Sort integer slice with stdlib.",
          },
        ],
        programExercises: [
          {
            type: "program",
            question: "Program 1: make slice len/cap.",
            code: `s := make([]int, 0, 5)
fmt.Println(len(s), cap(s))`,
            output: "0 5",
          },
          {
            type: "program",
            question: "Program 2: append values.",
            code: `s := []int{1}
s = append(s, 2, 3)
fmt.Println(s)`,
            output: "[1 2 3]",
          },
          {
            type: "program",
            question: "Program 3: copy slice.",
            code: `src := []int{10,20}
dst := make([]int, len(src))
n := copy(dst, src)
fmt.Println(n, dst)`,
            output: "2 [10 20]",
          },
          {
            type: "program",
            question: "Program 4: delete map key.",
            code: `m := map[string]int{"a":1,"b":2}
delete(m, "b")
fmt.Println(m)`,
            output: "map[a:1]",
          },
          {
            type: "program",
            question: "Program 5: strconv.Atoi parse.",
            code: `n, err := strconv.Atoi("123")
fmt.Println(n, err == nil)`,
            output: "123 true",
          },
          {
            type: "program",
            question: "Program 6: strings.Builder usage.",
            code: `var b strings.Builder
b.WriteString("go")
b.WriteString("lang")
fmt.Println(b.String())`,
            output: "golang",
          },
          {
            type: "program",
            question: "Program 7: sort.Ints usage.",
            code: `nums := []int{3,1,2}
sort.Ints(nums)
fmt.Println(nums)`,
            output: "[1 2 3]",
          },
          {
            type: "program",
            question: "Program 8: time.Parse and format.",
            code: `t, _ := time.Parse("2006-01-02", "2026-02-12")
fmt.Println(t.Format("02 Jan 2006"))`,
            output: "12 Feb 2026",
          },
          {
            type: "program",
            question: "Program 9: recover demo.",
            code: `func safe() {
  defer func() { if recover() != nil { fmt.Println("recovered") } }()
  panic("boom")
}
safe()`,
            output: "recovered",
          },
          {
            type: "program",
            question: "Program 10: cap growth while appending.",
            code: `s := make([]int, 0, 1)
for i := 0; i < 3; i++ {
  s = append(s, i)
  fmt.Println(len(s), cap(s))
}`,
            output: "prints growth sequence",
          },
        ],
      },
    ],
  },
];

export const golangExtraQuiz = [
  {
    question: "Which package is standard for SQL abstraction in Go?",
    options: ["database/core", "database/sql", "sql/go", "db/stdlib"],
    correctAnswer: 1,
    explanation: "database/sql is the standard SQL abstraction package.",
  },
  {
    question: "sql.Open verifies connectivity immediately?",
    options: [
      "Yes",
      "No, use Ping/PingContext",
      "Only for postgres",
      "Only after first query",
    ],
    correctAnswer: 1,
    explanation: "Use Ping for connectivity check.",
  },
  {
    question: "redis.Nil usually means:",
    options: ["Redis down", "Auth failed", "Missing key", "Timeout"],
    correctAnswer: 2,
    explanation: "redis.Nil indicates key not found.",
  },
  {
    question: "Status code for successful creation is:",
    options: ["200", "201", "204", "400"],
    correctAnswer: 1,
    explanation: "Use 201 Created.",
  },
  {
    question: "Which built-in may require reassignment of result?",
    options: ["len", "cap", "append", "delete"],
    correctAnswer: 2,
    explanation: "append can return a new slice header/backing array.",
  },
  {
    question: "Writing to nil map causes:",
    options: ["No-op", "Compile error", "Runtime panic", "Deadlock"],
    correctAnswer: 2,
    explanation: "Nil map write panics.",
  },
  {
    question: "db.QueryRowContext missing row should be checked against:",
    options: ["io.EOF", "sql.ErrNoRows", "redis.Nil", "nil"],
    correctAnswer: 1,
    explanation: "Missing SQL row returns sql.ErrNoRows.",
  },
  {
    question: "SetNX behavior in Redis is:",
    options: [
      "Always overwrite",
      "Set only when key absent",
      "Delete if exists",
      "Set without expiry only",
    ],
    correctAnswer: 1,
    explanation: "SetNX writes only if key does not already exist.",
  },
  {
    question: "Malformed JSON request body should usually return:",
    options: ["200", "201", "400", "500"],
    correctAnswer: 2,
    explanation: "Malformed body is a client error: 400 Bad Request.",
  },
  {
    question: "Output-oriented: len(make([]int, 0, 5)) equals:",
    options: ["0", "5", "1", "panic"],
    correctAnswer: 0,
    explanation: "Length is 0, capacity is 5.",
  },
  {
    question: "Output-oriented: cap(make([]int, 0, 5)) equals:",
    options: ["0", "5", "1", "panic"],
    correctAnswer: 1,
    explanation: "Capacity is 5.",
  },
  {
    question: "delete(map, missingKey) behavior is:",
    options: ["panic", "no-op", "error returned", "deletes all keys"],
    correctAnswer: 1,
    explanation: "Delete on missing key is safe.",
  },
  {
    question: "Why pass r.Context() to repository layer?",
    options: [
      "For syntax",
      "For timeout/cancel propagation",
      "For static typing",
      "For panic recovery",
    ],
    correctAnswer: 1,
    explanation: "Request context carries deadlines and cancellation.",
  },
];
