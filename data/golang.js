export const golangData = [
  {
    category: "Go Basics",
    topics: [
      {
        id: "syntax",
        title: "Basic Syntax & Types",
        description:
          "Go's fundamental syntax, variable declarations, and basic types.",
        code: `package main

import "fmt"

func main() {
    // Variable declarations
    var name string = "John"
    age := 30 // Short declaration
    
    // Basic types
    var i int = 42
    var f float64 = 3.14
    var b bool = true
    var s string = "Hello"
    
    // Constants
    const Pi = 3.14159
    
    // Multiple declarations
    var x, y int = 1, 2
    a, b := "hello", true
    
    fmt.Println(name, age, i, f, b, s)
}`,
        example: `// Type conversion
var i int = 42
var f float64 = float64(i)
var u uint = uint(f)

// Zero values
var i int      // 0
var f float64  // 0.0
var b bool     // false
var s string   // ""

// Strings
str :=

 "Hello, World"
multiline := \`Line 1
Line 2
Line 3\``,
        useCase: "Basic Go programs, declaring variables, working with types",
        explanation:
          "This topic is the foundation for every Go interview round. Focus on declaration styles (`var` vs `:=`), default zero values, explicit type conversion (Go avoids implicit numeric coercion), and constants with `iota`. Interviewers often test whether you understand compile-time type safety and practical implications of zero values in real services.",
        interviewQuestions: [
          {
            question: "What is the difference between `var` and `:=` in Go?",
            answer:
              "`:=` is short declaration with type inference and can be used only inside functions. `var` works at both package and function scope and optionally allows explicit type.",
          },
          {
            question: "Why does Go avoid implicit type conversions?",
            answer:
              "It reduces hidden bugs and forces explicit intent, especially for numeric conversions where precision or sign may change.",
          },
          {
            question: "What are zero values and why are they useful?",
            answer:
              "Every declared variable gets a deterministic default (`0`, `false`, `\"\"`, `nil`). This reduces uninitialized-memory bugs and simplifies defensive coding.",
          },
          {
            question: "When would you prefer explicit type declarations over inference?",
            answer:
              "When API clarity matters, when literal defaults are ambiguous, or when you want to make contracts obvious for teammates and reviewers.",
          },
          {
            question: "How do constants differ from variables in Go?",
            answer:
              "Constants are immutable and can be untyped, enabling flexible compile-time expressions. Variables are runtime values with concrete types.",
          },
        ],
        exercises: [
          {
            type: "theory",
            question: "Explain zero value behavior for int, string, bool, slice, map, and pointer.",
          },
          {
            type: "tricky",
            question: "Why does `var x int = 3.14` fail while `var y float64 = 3.14` works?",
            answer: "Go does not allow implicit narrowing/precision-loss conversion.",
          },
          {
            type: "implement",
            question: "Write declarations for the same value using `var` and `:=`, then compare inferred types.",
          },
          {
            type: "output",
            question: "What prints: `var s string; fmt.Println(len(s), s == \"\")`?",
            answer: "0 true",
          },
          {
            type: "debug",
            question: "Fix a snippet where `:=` is mistakenly used at package scope.",
          },
          {
            type: "scenario",
            question: "Choose between typed and untyped constants for a reusable math utility package.",
          },
        ],
        programExercises: [
          {
            question: "Program 1: Print zero values for key Go types.",
            code: `var i int
var f float64
var b bool
var s string
var sl []int
fmt.Printf("%d %.1f %t %q %v\\n", i, f, b, s, sl == nil)`,
            output: `0 0.0 false "" true`,
          },
          {
            question: "Program 2: Compare `var` and `:=` declarations.",
            code: `var a int = 10
b := 10
fmt.Printf("%T %T\\n", a, b)`,
            output: "int int",
          },
          {
            question: "Program 3: Explicit conversion demo.",
            code: `var i int = 42
var f float64 = float64(i)
fmt.Printf("%T %.1f\\n", f, f)`,
            output: "float64 42.0",
          },
          {
            question: "Program 4: Untyped constant behavior.",
            code: `const n = 5
var x int64 = n
fmt.Printf("%T %d\\n", x, x)`,
            output: "int64 5",
          },
          {
            question: "Program 5: Multi-variable declaration and swap.",
            code: `x, y := 1, 2
x, y = y, x
fmt.Println(x, y)`,
            output: "2 1",
          },
        ],
      },
      {
        id: "functions",
        title: "Functions",
        description:
          "Function declarations, multiple return values, and variadic functions.",
        code: `package main

import "fmt"

// Basic function
func add(x int, y int) int {
    return x + y
}

// Shortened parameter syntax
func multiply(x, y int) int {
    return x * y
}

// Multiple return values
func swap(x, y string) (string, string) {
    return y, x
}

// Named return values
func split(sum int) (x, y int) {
    x = sum * 4 / 9
    y = sum - x
    return // Naked return
}

// Variadic function
func sum(nums ...int) int {
    total := 0
    for _, num := range nums {
        total += num
    }
    return total
}

func main() {
    fmt.Println(add(42, 13))
    a, b := swap("hello", "world")
    fmt.Println(a, b)
    fmt.Println(sum(1, 2, 3, 4, 5))
}`,
        example: `// Function as value
func compute(fn func(int, int) int) int {
    return fn(3, 4)
}

func main() {
    add := func(a, b int) int {
        return a + b
    }
    fmt.Println(compute(add))
}

// Closures
func counter() func() int {
    i := 0
    return func() int {
        i++
        return i
    }
}`,
        useCase: "Business logic, utilities, error handling, closures",
        explanation:
          "Functions are central in Go interviews because they connect readability, testability, and error handling style. Be strong in multiple returns (`value, err`), variadic signatures, closures, and named return values (and when to avoid naked returns in production for clarity).",
        interviewQuestions: [
          {
            question: "Why does Go prefer multiple return values over exceptions?",
            answer:
              "It makes error flow explicit and local, so call sites must consciously handle success/failure.",
          },
          {
            question: "When are variadic functions useful?",
            answer:
              "For APIs that accept flexible argument counts, such as logging helpers, aggregators, and builders.",
          },
          {
            question: "When should named return values be avoided?",
            answer:
              "In long functions where naked returns reduce readability and make control flow harder to follow.",
          },
          {
            question: "How do closures help in interviews and production?",
            answer:
              "They capture lexical state, useful for counters, middleware, decorators, and dependency injection patterns.",
          },
        ],
        exercises: [
          {
            type: "implement",
            question: "Write a function returning `(User, error)` and handle error in caller idiomatically.",
          },
          {
            type: "tricky",
            question: "Why can `sum(nums []int)` and `sum(nums ...int)` have different call ergonomics?",
            answer: "Variadic function accepts unpacked arguments and slice expansion with `...`.",
          },
          {
            type: "output",
            question: "Output of closure counter called 3 times?",
            answer: "1 2 3",
          },
          {
            type: "debug",
            question: "Fix a bug where a function ignores returned `err` value.",
          },
        ],
        programExercises: [
          {
            question: "Program 1: Value and error return pattern.",
            code: `func divide(a, b int) (int, error) {
  if b == 0 { return 0, fmt.Errorf("divide by zero") }
  return a / b, nil
}
v, err := divide(10, 2)
fmt.Println(v, err == nil)`,
            output: "5 true",
          },
          {
            question: "Program 2: Variadic sum with slice expansion.",
            code: `func sum(nums ...int) int { t := 0; for _, n := range nums { t += n }; return t }
arr := []int{1,2,3}
fmt.Println(sum(arr...))`,
            output: "6",
          },
          {
            question: "Program 3: Closure counter.",
            code: `func counter() func() int {
  i := 0
  return func() int { i++; return i }
}
c := counter()
fmt.Println(c(), c(), c())`,
            output: "1 2 3",
          },
        ],
      },
      {
        id: "structs",
        title: "Structs & Methods",
        description:
          "Define custom types with structs and attach methods to them.",
        code: `package main

import "fmt"

// Define struct
type Person struct {
    Name string
    Age  int
}

// Method on struct
func (p Person) Greet() string {
    return "Hello, " + p.Name
}

// Pointer receiver (can modify)
func (p *Person) HaveBirthday() {
    p.Age++
}

// Constructor function
func NewPerson(name string, age int) *Person {
    return &Person{
        Name: name,
        Age:  age,
    }
}

func main() {
    p := Person{Name: "Alice", Age: 30}
    fmt.Println(p.Greet())
    
    p.HaveBirthday()
    fmt.Println(p.Age) // 31
    
    p2 := NewPerson("Bob", 25)
    fmt.Println(p2)
}`,
        example: `// Embedded structs
type Address struct {
    City  string
    State string
}

type Employee struct {
    Person  // Embedded
    Address // Embedded
    Salary  int
}

emp := Employee{
    Person:  Person{Name: "John", Age: 30},
    Address: Address{City: "NYC", State: "NY"},
    Salary:  100000,
}

// Access embedded fields
fmt.Println(emp.Name) // From Person
fmt.Println(emp.City) // From Address`,
        useCase:
          "Data modeling, OOP-like patterns, API responses, database models",
        explanation:
          "Structs model domain data, while methods provide behavior. Interviews typically test pointer vs value receivers, embedding for composition, and when constructor helpers improve invariants.",
        interviewQuestions: [
          {
            question: "When do you use pointer receiver vs value receiver?",
            answer:
              "Use pointer receiver when mutating state or avoiding copies on large structs; value receiver for immutable small-value semantics.",
          },
          {
            question: "Is embedding inheritance in Go?",
            answer:
              "No, it is composition. Promoted fields/methods provide reuse without classical inheritance hierarchy.",
          },
          {
            question: "Why create constructor-like functions in Go?",
            answer:
              "To validate input and ensure required fields/invariants before exposing values to callers.",
          },
        ],
        exercises: [
          {
            type: "implement",
            question: "Create a `BankAccount` struct with deposit/withdraw methods and balance validation.",
          },
          {
            type: "theory",
            question: "Explain method set differences for type `T` and `*T`.",
          },
          {
            type: "tricky",
            question: "Why might calling a pointer-receiver method on a value still compile?",
            answer: "Go may take the address automatically when value is addressable.",
          },
          {
            type: "debug",
            question: "Fix a bug where a value receiver method tries to mutate struct state but change is lost.",
          },
        ],
        programExercises: [
          {
            question: "Program 1: Value vs pointer receiver behavior.",
            code: `type C struct{ N int }
func (c C) IncV() { c.N++ }
func (c *C) IncP() { c.N++ }
x := C{N:1}
x.IncV(); fmt.Println(x.N)
x.IncP(); fmt.Println(x.N)`,
            output: "1 then 2",
          },
          {
            question: "Program 2: Embedded struct field promotion.",
            code: `type A struct{ Name string }
type B struct{ A; Role string }
b := B{A: A{Name:"go"}, Role:"dev"}
fmt.Println(b.Name, b.Role)`,
            output: "go dev",
          },
        ],
      },
      {
        id: "interfaces",
        title: "Interfaces",
        description:
          "Implicit interfaces that define behavior without explicit implementation.",
        code: `package main

import (
    "fmt"
    "math"
)

// Define interface
type Shape interface {
    Area() float64
    Perimeter() float64
}

// Rectangle implements Shape
type Rectangle struct {
    Width, Height float64
}

func (r Rectangle) Area() float64 {
    return r.Width * r.Height
}

func (r Rectangle) Perimeter() float64 {
    return 2 * (r.Width + r.Height)
}

// Circle implements Shape
type Circle struct {
    Radius float64
}

func (c Circle) Area() float64 {
    return math.Pi * c.Radius * c.Radius
}

func (c Circle) Perimeter() float64 {
    return 2 * math.Pi * c.Radius
}

func printShapeInfo(s Shape) {
    fmt.Printf("Area: %.2f\\n", s.Area())
    fmt.Printf("Perimeter: %.2f\\n", s.Perimeter())
}

func main() {
    r := Rectangle{Width: 10, Height: 5}
    c := Circle{Radius: 7}
    
    printShapeInfo(r)
    printShapeInfo(c)
}`,
        example: `// Empty interface (any type)
func printAnything(v interface{}) {
    fmt.Println(v)
}

// Type assertion
var i interface{} = "hello"
s := i.(string)
s, ok := i.(string) // Safe type assertion

// Type switch
func describe(i interface{}) {
    switch v := i.(type) {
    case int:
        fmt.Printf("Integer: %d\\n", v)
    case string:
        fmt.Printf("String: %s\\n", v)
    default:
        fmt.Printf("Unknown type\\n")
    }
}`,
        useCase: "Polymorphism, dependency injection, mocking, plugin systems",
        explanation:
          "Interfaces in Go are implicit contracts: a type satisfies an interface by implementing required methods. Interviewers often ask about small-interface design, nil-interface pitfalls, and type assertions/switches.",
        interviewQuestions: [
          {
            question: "Why are small interfaces preferred in Go?",
            answer:
              "Small, focused interfaces are easier to implement, mock, and evolve without breaking many consumers.",
          },
          {
            question: "What is the `nil interface` pitfall?",
            answer:
              "An interface can hold a typed nil pointer and still be non-nil because it stores type + value metadata.",
          },
          {
            question: "When should type assertions be used carefully?",
            answer:
              "Use two-value assertion (`v, ok := i.(T)`) when dynamic types may vary to avoid panic.",
          },
        ],
        exercises: [
          {
            type: "implement",
            question: "Design a `Notifier` interface and provide email/sms implementations.",
          },
          {
            type: "scenario",
            question: "Refactor a concrete repository dependency into interface-driven design for testing.",
          },
          {
            type: "tricky",
            question: "Explain why `var r io.Reader = (*bytes.Buffer)(nil); r != nil`.",
            answer: "Interface has dynamic type set, so interface value itself is non-nil.",
          },
        ],
        programExercises: [
          {
            question: "Program 1: Interface satisfaction example.",
            code: `type Speaker interface{ Speak() string }
type Dog struct{}
func (Dog) Speak() string { return "woof" }
var s Speaker = Dog{}
fmt.Println(s.Speak())`,
            output: "woof",
          },
          {
            question: "Program 2: Type switch handling.",
            code: `func kind(v any) string {
  switch v.(type) {
  case int: return "int"
  case string: return "string"
  default: return "other"
  }
}
fmt.Println(kind(10), kind("go"))`,
            output: "int string",
          },
        ],
      },
    ],
  },
  {
    category: "Concurrency",
    topics: [
      {
        id: "goroutines",
        title: "Goroutines",
        description:
          "Lightweight threads managed by Go runtime. Use 'go' keyword to start concurrent execution.",
        code: `package main

import (
    "fmt"
    "time"
)

func say(s string) {
    for i := 0; i < 5; i++ {
        time.Sleep(100 * time.Millisecond)
        fmt.Println(s)
    }
}

func main() {
    // Start goroutine
    go say("world")
    
    // Main goroutine
    say("hello")
    
    // Wait for goroutines
    time.Sleep(time.Second)
}

// Anonymous goroutine
func main() {
    go func() {
        fmt.Println("Running in goroutine")
    }()
    
    time.Sleep(100 * time.Millisecond)
}`,
        example: `// Multiple goroutines
for i := 0; i < 5; i++ {
    go func(n int) {
        fmt.Println("Goroutine", n)
    }(i)
}

// Wait with sync.WaitGroup
var wg sync.WaitGroup

for i := 0; i < 5; i++ {
    wg.Add(1)
    go func(n int) {
        defer wg.Done()
        fmt.Println("Task", n)
    }(i)
}

wg.Wait()`,
        useCase:
          "Concurrent tasks, parallel processing, background jobs, async operations",
        explanation:
          "Goroutines are lightweight units scheduled by Go runtime, not one-to-one OS threads. Interview depth includes lifecycle management, avoiding goroutine leaks, and synchronization with WaitGroup/context instead of arbitrary sleeps.",
        interviewQuestions: [
          {
            question: "Why is `time.Sleep` a weak synchronization strategy?",
            answer:
              "It relies on timing assumptions and can be flaky; WaitGroup/channels/context provide deterministic coordination.",
          },
          {
            question: "What is a goroutine leak?",
            answer:
              "A goroutine blocked forever due to missing cancellation or channel closure, causing resource growth over time.",
          },
          {
            question: "How do you safely wait for multiple goroutines?",
            answer: "Use `sync.WaitGroup` and ensure each worker calls `Done()` via `defer`.",
          },
        ],
        exercises: [
          {
            type: "implement",
            question: "Run 5 workers concurrently and wait deterministically for completion.",
          },
          {
            type: "debug",
            question: "Fix code where loop variable capture causes all goroutines to print same value.",
          },
          {
            type: "scenario",
            question: "Add cancellation to background goroutine processing HTTP requests.",
          },
        ],
        programExercises: [
          {
            question: "Program 1: WaitGroup synchronization.",
            code: `var wg sync.WaitGroup
for i := 0; i < 3; i++ {
  wg.Add(1)
  go func(n int) { defer wg.Done(); fmt.Println("job", n) }(i)
}
wg.Wait()
fmt.Println("done")`,
            output: "prints jobs then done",
          },
          {
            question: "Program 2: Loop capture fix.",
            code: `for i := 0; i < 3; i++ {
  go func(v int) { fmt.Println(v) }(i)
}`,
            output: "prints 0,1,2 (order not guaranteed)",
          },
        ],
      },
      {
        id: "channels",
        title: "Channels",
        description:
          "Typed conduits for communication between goroutines. Send and receive values safely.",
        code: `package main

import "fmt"

func sum(nums []int, c chan int) {
    total := 0
    for _, num := range nums {
        total += num
    }
    c <- total // Send to channel
}

func main() {
    nums := []int{1, 2, 3, 4, 5, 6}
    
    c := make(chan int)
    
    go sum(nums[:len(nums)/2], c)
    go sum(nums[len(nums)/2:], c)
    
    x, y := <-c, <-c // Receive from channel
    
    fmt.Println("Total:", x+y)
}`,
        example: `// Buffered channels
ch := make(chan int, 2)
ch <- 1
ch <- 2
// ch <- 3 // Would block

// Closing channels
close(ch)

// Range over channel
for val := range ch {
    fmt.Println(val)
}

// Select statement
select {
case msg1 := <-ch1:
    fmt.Println("Received from ch1:", msg1)
case msg2 := <-ch2:
    fmt.Println("Received from ch2:", msg2)
case <-time.After(time.Second):
    fmt.Println("Timeout")
default:
    fmt.Println("No data")
}`,
        useCase:
          "Goroutine communication, synchronization, worker pools, pipelines",
        explanation:
          "Channels coordinate goroutines through message passing. Interviewers evaluate blocking semantics, buffered vs unbuffered trade-offs, closure behavior, and safe ownership rules for closing channels.",
        interviewQuestions: [
          {
            question: "Who should close a channel?",
            answer:
              "Typically the sender/producer that knows no more values will be sent.",
          },
          {
            question: "What happens when receiving from a closed channel?",
            answer:
              "Receive succeeds with zero value; in two-value receive, `ok` is false.",
          },
          {
            question: "When are buffered channels useful?",
            answer:
              "To absorb short bursts and decouple producer/consumer speeds, but not as a substitute for design.",
          },
        ],
        exercises: [
          {
            type: "implement",
            question: "Build worker pool with job and result channels.",
          },
          {
            type: "output",
            question: "What are values of `v, ok := <-closedCh`?",
            answer: "zero value of element type, false",
          },
          {
            type: "debug",
            question: "Fix panic caused by sending on a closed channel.",
          },
        ],
        programExercises: [
          {
            question: "Program 1: Buffered channel basic flow.",
            code: `ch := make(chan int, 2)
ch <- 10
ch <- 20
fmt.Println(<-ch, <-ch)`,
            output: "10 20",
          },
          {
            question: "Program 2: Close and range.",
            code: `ch := make(chan int, 2)
ch <- 1; ch <- 2; close(ch)
for v := range ch { fmt.Println(v) }`,
            output: "1 then 2",
          },
        ],
      },
      {
        id: "select",
        title: "Select Statement",
        description:
          "Multiplexing goroutine communications. Wait on multiple channel operations.",
        code: `package main

import (
    "fmt"
    "time"
)

func main() {
    c1 := make(chan string)
    c2 := make(chan string)
    
    go func() {
        time.Sleep(1 * time.Second)
        c1 <- "one"
    }()
    
    go func() {
        time.Sleep(2 * time.Second)
        c2 <- "two"
    }()
    
    for i := 0; i < 2; i++ {
        select {
        case msg1 := <-c1:
            fmt.Println("Received", msg1)
        case msg2 := <-c2:
            fmt.Println("Received", msg2)
        }
    }
}`,
        example: `// Timeout pattern
select {
case res := <-ch:
    fmt.Println(res)
case <-time.After(1 * time.Second):
    fmt.Println("Timeout")
}

// Non-blocking receive
select {
case msg := <-ch:
    fmt.Println("Received:", msg)
default:
    fmt.Println("No message")
}

// Non-blocking send
select {
case ch <- value:
    fmt.Println("Sent")
default:
    fmt.Println("Channel full")
}`,
        useCase:
          "Timeouts, non-blocking operations, multiplexing channels, cancellation",
        explanation:
          "Select lets one goroutine wait on multiple channel operations and proceed with whichever is ready. In interviews, show timeout patterns, default branch implications, and cancellation-aware flow.",
        interviewQuestions: [
          {
            question: "What does `default` do in select?",
            answer:
              "Makes select non-blocking by executing immediately when no channel case is ready.",
          },
          {
            question: "How do you model timeouts in select?",
            answer:
              "Use `case <-time.After(d):` or a context Done channel to enforce deadline behavior.",
          },
          {
            question: "Is case selection deterministic when multiple are ready?",
            answer: "No, Go pseudo-randomly chooses one ready case.",
          },
        ],
        exercises: [
          {
            type: "implement",
            question: "Read from two channels and timeout after 500ms.",
          },
          {
            type: "scenario",
            question: "Design a fan-in aggregator using select.",
          },
          {
            type: "tricky",
            question: "What bug can an always-on default case introduce?",
            answer: "Busy loop/high CPU usage due to no blocking.",
          },
        ],
        programExercises: [
          {
            question: "Program 1: Select timeout.",
            code: `ch := make(chan string)
select {
case m := <-ch:
  fmt.Println(m)
case <-time.After(50 * time.Millisecond):
  fmt.Println("timeout")
}`,
            output: "timeout",
          },
          {
            question: "Program 2: Non-blocking receive with default.",
            code: `ch := make(chan int)
select {
case v := <-ch:
  fmt.Println(v)
default:
  fmt.Println("no value")
}`,
            output: "no value",
          },
        ],
      },
      {
        id: "sync",
        title: "Sync Package (Mutex, WaitGroup)",
        description: "Synchronization primitives for coordinating goroutines.",
        code: `package main

import (
    "fmt"
    "sync"
)

type SafeCounter struct {
    mu sync.Mutex
    v  map[string]int
}

func (c *SafeCounter) Inc(key string) {
    c.mu.Lock()
    c.v[key]++
    c.mu.Unlock()
}

func (c *SafeCounter) Value(key string) int {
    c.mu.Lock()
    defer c.mu.Unlock()
    return c.v[key]
}

func main() {
    c := SafeCounter{v: make(map[string]int)}
    var wg sync.WaitGroup
    
    for i := 0; i < 1000; i++ {
        wg.Add(1)
        go func() {
            defer wg.Done()
            c.Inc("key")
        }()
    }
    
    wg.Wait()
    fmt.Println(c.Value("key"))
}`,
        example: `// RWMutex (reader/writer lock)
var rwMu sync.RWMutex

// Read lock (multiple readers allowed)
rwMu.RLock()
value := data[key]
rwMu.RUnlock()

// Write lock (exclusive)
rwMu.Lock()
data[key] = newValue
rwMu.Unlock()

// Once (execute only once)
var once sync.Once
once.Do(func() {
    fmt.Println("This runs only once")
})`,
        useCase:
          "Protecting shared data, preventing race conditions, one-time initialization",
        explanation:
          "Synchronization primitives coordinate shared-memory concurrency. Interviews test mutex correctness, lock granularity, RWMutex trade-offs, WaitGroup lifecycle, and `go test -race` usage.",
        interviewQuestions: [
          {
            question: "When is `RWMutex` better than `Mutex`?",
            answer:
              "Read-heavy workloads with infrequent writes, though contention patterns must be measured.",
          },
          {
            question: "Why use `defer mu.Unlock()` often?",
            answer:
              "It guarantees unlock on all return paths, reducing deadlock risk from missed unlocks.",
          },
          {
            question: "How do you detect data races in Go?",
            answer: "Run with race detector: `go test -race` or `go run -race`.",
          },
        ],
        exercises: [
          {
            type: "implement",
            question: "Write thread-safe in-memory counter with Mutex and unit test using -race.",
          },
          {
            type: "debug",
            question: "Fix deadlock due to double lock in nested call path.",
          },
          {
            type: "scenario",
            question: "Choose atomic increment vs mutex for shared request counter and justify.",
          },
        ],
        programExercises: [
          {
            question: "Program 1: Mutex-guarded counter.",
            code: `type Counter struct { mu sync.Mutex; n int }
func (c *Counter) Inc() { c.mu.Lock(); c.n++; c.mu.Unlock() }
func (c *Counter) Value() int { c.mu.Lock(); defer c.mu.Unlock(); return c.n }`,
            output: "thread-safe methods defined",
          },
          {
            question: "Program 2: sync.Once initialization.",
            code: `var once sync.Once
count := 0
for i := 0; i < 3; i++ { once.Do(func(){ count++ }) }
fmt.Println(count)`,
            output: "1",
          },
        ],
      },
    ],
  },
  {
    category: "Data Structures",
    topics: [
      {
        id: "arrays-slices",
        title: "Arrays & Slices",
        description:
          "Fixed-size arrays and dynamic slices. Slices are more commonly used.",
        code: `package main

import "fmt"

func main() {
    // Array (fixed size)
    var arr [5]int
    arr[0] = 1
    arr[1] = 2
    
    // Array literal
    primes := [6]int{2, 3, 5, 7, 11, 13}
    
    // Slice (dynamic)
    var s []int
    s = append(s, 1, 2, 3)
    
    // Make slice with capacity
    nums := make([]int, 5)    // len=5, cap=5
    nums2 := make([]int, 0, 5) // len=0, cap=5
    
    // Slice literal
    foods := []string{"pizza", "burger", "pasta"}
    
    // Slicing
    subSlice := primes[1:4] // [3 5 7]
    
    fmt.Println(arr, primes, s, nums, foods, subSlice)
}`,
        example: `// Append to slice
nums := []int{1, 2}
nums = append(nums, 3, 4, 5)
nums = append(nums, []int{6, 7, 8}...)

// Copy slice
src := []int{1, 2, 3}
dst := make([]int, len(src))
copy(dst, src)

// Iterate
for i, v := range nums {
    fmt.Printf("Index: %d, Value: %d\\n", i, v)
}

// Length and capacity
len(nums) // Number of elements
cap(nums) // Capacity`,
        useCase: "Collections, lists, dynamic arrays, data processing",
        explanation:
          "Arrays are fixed-length values; slices are lightweight descriptors over arrays (pointer, length, capacity). Interviewers often probe append reallocation effects, shared backing array side effects, and copy-based isolation.",
        interviewQuestions: [
          {
            question: "Why are slices preferred over arrays in Go APIs?",
            answer:
              "Slices are flexible and ergonomic for variable-size data; arrays include length in type and are less convenient to pass around.",
          },
          {
            question: "What does capacity represent for slices?",
            answer:
              "Maximum length before reallocation from current starting point in backing array.",
          },
          {
            question: "Why can modifying one slice affect another?",
            answer:
              "Different slices may share the same backing array, so writes can be visible across views.",
          },
        ],
        exercises: [
          {
            type: "output",
            question: "Find len/cap for `s := make([]int, 2, 5)`.",
            answer: "len=2, cap=5",
          },
          {
            type: "debug",
            question: "Fix a bug where helper appends to slice but caller doesn’t see expected updates.",
          },
          {
            type: "implement",
            question: "Clone a slice defensively before mutation in a function.",
          },
          {
            type: "tricky",
            question: "Why can append trigger allocation and break shared data assumptions?",
            answer: "Capacity overflow causes new backing array allocation.",
          },
        ],
        programExercises: [
          {
            question: "Program 1: Observe len/cap changes during append.",
            code: `s := make([]int, 0, 1)
for i := 0; i < 4; i++ {
  s = append(s, i)
  fmt.Println(len(s), cap(s))
}`,
            output: "capacity grows as needed",
          },
          {
            question: "Program 2: Shared backing array side effect.",
            code: `base := []int{1,2,3,4}
a := base[:2]
b := base[1:3]
a[1] = 99
fmt.Println(base, b)`,
            output: "[1 99 3 4] [99 3]",
          },
          {
            question: "Program 3: Safe clone before mutation.",
            code: `src := []int{1,2,3}
dst := append([]int(nil), src...)
dst[0] = 100
fmt.Println(src, dst)`,
            output: "[1 2 3] [100 2 3]",
          },
        ],
      },
      {
        id: "maps",
        title: "Maps",
        description: "Key-value pairs (hash tables). Dynamic and unordered.",
        code: `package main

import "fmt"

func main() {
    // Create map
    m := make(map[string]int)
    
    // Set values
    m["apple"] = 5
    m["banana"] = 3
    
    // Map literal
    ages := map[string]int{
        "Alice": 25,
        "Bob":   30,
    }
    
    // Get value
    age := ages["Alice"]
    
    // Check if key exists
    val, ok := ages["Charlie"]
    if ok {
        fmt.Println("Found:", val)
    } else {
        fmt.Println("Not found")
    }
    
    // Delete key
    delete(ages, "Bob")
    
    // Iterate
    for key, value := range ages {
        fmt.Printf("%s: %d\\n", key, value)
    }
}`,
        example: `// Map of structs
type User struct {
    Name string
    Age  int
}

users := map[int]User{
    1: {Name: "Alice", Age: 25},
    2: {Name: "Bob", Age: 30},
}

// Map of slices
data := map[string][]int{
    "even": {2, 4, 6, 8},
    "odd":  {1, 3, 5, 7},
}

// Nested maps
config := map[string]map[string]string{
    "database": {
        "host": "localhost",
        "port": "5432",
    },
}`,
        useCase: "Lookups, caching, counting, grouping, configuration",
        explanation:
          "Maps are hash-based key/value containers with O(1)-average lookup semantics. Interviewers usually check map initialization rules, missing-key behavior, iteration non-determinism, and concurrency safety limitations.",
        interviewQuestions: [
          {
            question: "What is returned for missing map key access?",
            answer:
              "The zero value of value type; use two-value form (`v, ok := m[k]`) to distinguish existence.",
          },
          {
            question: "Is map iteration order stable in Go?",
            answer: "No, iteration order is intentionally randomized.",
          },
          {
            question: "Can maps be read/written concurrently without locks?",
            answer:
              "Concurrent writes or read-write access without synchronization is unsafe and may panic or race.",
          },
        ],
        exercises: [
          {
            type: "implement",
            question: "Build frequency counter for words in a string slice.",
          },
          {
            type: "output",
            question: "What happens on `delete(m, missing)`?",
            answer: "Safe no-op",
          },
          {
            type: "tricky",
            question: "Why does writing to a nil map panic but reading does not?",
            answer:
              "Read can return zero value from absent storage, but write needs allocated hash table.",
          },
          {
            type: "debug",
            question: "Fix panic from writing to an uninitialized map field in struct.",
          },
        ],
        programExercises: [
          {
            question: "Program 1: Frequency map.",
            code: `words := []string{"go","go","api"}
freq := make(map[string]int)
for _, w := range words { freq[w]++ }
fmt.Println(freq["go"], freq["api"])`,
            output: "2 1",
          },
          {
            question: "Program 2: Presence check pattern.",
            code: `m := map[string]int{"x": 1}
v, ok := m["y"]
fmt.Println(v, ok)`,
            output: "0 false",
          },
          {
            question: "Program 3: Grouping values by key.",
            code: `groups := map[string][]int{}
for _, n := range []int{1,2,3,4} {
  k := "odd"; if n%2==0 { k = "even" }
  groups[k] = append(groups[k], n)
}
fmt.Println(groups["even"], groups["odd"])`,
            output: "[2 4] [1 3]",
          },
        ],
      },
    ],
  },
];

export const golangQuiz = [
  {
    question: "What is a goroutine in Go?",
    options: [
      "A type of loop",
      "A lightweight thread managed by the Go runtime",
      "A data structure",
      "A package manager",
    ],
    correctAnswer: 1,
    explanation:
      "A goroutine is a lightweight thread of execution managed by the Go runtime. Goroutines are much cheaper than OS threads and thousands can run concurrently.",
  },
  {
    question: "What is the purpose of channels in Go?",
    options: [
      "To store data permanently",
      "To enable communication and synchronization between goroutines",
      "To import packages",
      "To handle errors",
    ],
    correctAnswer: 1,
    explanation:
      "Channels are the pipes that connect concurrent goroutines. They allow you to send and receive values between goroutines, providing both communication and synchronization.",
  },
  {
    question: "What does 'defer' keyword do in Go?",
    options: [
      "Delays execution until the surrounding function returns",
      "Creates a goroutine",
      "Handles errors",
      "Imports a package",
    ],
    correctAnswer: 0,
    explanation:
      "The defer keyword postpones the execution of a function until the surrounding function returns. It's commonly used for cleanup operations like closing files or unlocking mutexes.",
  },
  {
    question: "What's the difference between buffered and unbuffered channels?",
    options: [
      "Buffered channels can hold values without a receiver, unbuffered require immediate receive",
      "Buffered channels are faster",
      "Unbuffered channels don't work",
      "There is no difference",
    ],
    correctAnswer: 0,
    explanation:
      "Unbuffered channels block the sender until a receiver is ready. Buffered channels allow sending up to N values without blocking, where N is the buffer size.",
  },
  {
    question: "What does the 'select' statement do in Go?",
    options: [
      "Selects a random number",
      "Waits on multiple channel operations",
      "Filters arrays",
      "Chooses a goroutine",
    ],
    correctAnswer: 1,
    explanation:
      "The select statement lets a goroutine wait on multiple channel operations. It blocks until one of its cases can proceed, enabling powerful concurrent patterns.",
  },
  {
    question: "What is the zero value of a slice in Go?",
    options: ["An empty slice []", "nil", "0", "false"],
    correctAnswer: 1,
    explanation:
      "The zero value of a slice is nil. A nil slice has length and capacity 0 and has no underlying array. However, you can still call len() and cap() on it safely.",
  },
  {
    question: "What are the basic data types in Go?",
    options: [
      "Only int and string",
      "bool, string, int, float64, complex128",
      "Any type from other languages",
      "Go has no types",
    ],
    correctAnswer: 1,
    explanation:
      "Go has basic types including bool, string, int/int8/int16/int32/int64, uint variants, float32/float64, complex64/complex128, byte, and rune.",
  },
  {
    question: "What is the difference between := and var?",
    options: [
      "No difference",
      ":= is short declaration only in functions, var works anywhere",
      "var is deprecated",
      ":= is slower",
    ],
    correctAnswer: 1,
    explanation:
      ":= is short variable declaration syntax that only works inside functions and infers type. var can be used at package or function level and allows explicit type declaration.",
  },
  {
    question: "What is a slice in Go?",
    options: [
      "A fixed-size array",
      "A dynamic-size, flexible view into arrays",
      "A string operation",
      "A goroutine",
    ],
    correctAnswer: 1,
    explanation:
      "A slice is a dynamically-sized, flexible view into the elements of an array. It has a pointer, length, and capacity. Slices are more common than arrays.",
  },
  {
    question: "How do you create a slice with initial capacity?",
    options: [
      "slice := []int",
      "slice := make([]int, 0, 10)",
      "slice := new([]int)",
      "slice := array[:]",
    ],
    correctAnswer: 1,
    explanation:
      "make([]int, 0, 10) creates a slice with length 0 and capacity 10. The first number is length, second is capacity (optional).",
  },
  {
    question: "What is the difference between array and slice?",
    options: [
      "No difference",
      "Arrays have fixed size, slices are dynamic",
      "Arrays are deprecated",
      "Slices are slower",
    ],
    correctAnswer: 1,
    explanation:
      "Arrays have a fixed size that's part of their type. Slices are dynamic, can grow/shrink, and are references to underlying arrays. Slices are more flexible.",
  },
  {
    question: "What does the range keyword do?",
    options: [
      "Creates a range of numbers",
      "Iterates over elements in arrays, slices, maps, channels",
      "Defines a numeric range",
      "Validates ranges",
    ],
    correctAnswer: 1,
    explanation:
      "range iterates over elements in arrays, slices, strings, maps, or channels. Returns index/key and value for each iteration.",
  },
  {
    question: "What is a map in Go?",
    options: [
      "Geographic map",
      "Hash table that maps keys to values",
      "Array index",
      "Function mapper",
    ],
    correctAnswer: 1,
    explanation:
      "A map is Go's built-in hash table/dictionary type that maps keys of one type to values of another type. Created with make(map[KeyType]ValueType).",
  },
  {
    question: "What is the zero value of a map?",
    options: ["Empty map {}", "nil", "0", "false"],
    correctAnswer: 1,
    explanation:
      "The zero value of a map is nil. A nil map has no keys and can't have keys added. Use make() to create a usable map.",
  },
  {
    question: "How do you check if a key exists in a map?",
    options: [
      "map.has(key)",
      "value, ok := map[key]",
      "map.contains(key)",
      "key in map",
    ],
    correctAnswer: 1,
    explanation:
      "Use the two-value assignment: value, ok := map[key]. If key exists, ok is true and value is the map value. Otherwise, ok is false and value is zero value.",
  },
  {
    question: "What is a struct in Go?",
    options: [
      "A class",
      "A collection of fields/properties grouped together",
      "A function",
      "An interface",
    ],
    correctAnswer: 1,
    explanation:
      "A struct is a composite data type that groups together zero or more named fields of arbitrary types under a single name. Similar to classes but without inheritance.",
  },
  {
    question: "How do you define a method on a struct?",
    options: [
      "func (s Struct) method() {}",
      "Struct.method = func() {}",
      "method Struct() {}",
      "def method(self)",
    ],
    correctAnswer: 0,
    explanation:
      "Methods are functions with a receiver argument between func keyword and function name: func (s Struct) method() {}. The receiver can be value or pointer type.",
  },
  {
    question: "What's the difference between value and pointer receivers?",
    options: [
      "No difference",
      "Pointer receivers can modify the receiver, value receivers can't",
      "Value receivers are faster",
      "Pointer receivers are deprecated",
    ],
    correctAnswer: 1,
    explanation:
      "Pointer receivers (*T) can modify the receiver and avoid copying large structs. Value receivers (T) operate on a copy and can't modify the original.",
  },
  {
    question: "What is an interface in Go?",
    options: [
      "A class",
      "A set of method signatures that a type can implement",
      "A network interface",
      "A user interface",
    ],
    correctAnswer: 1,
    explanation:
      "An interface is a type that specifies a set of method signatures. A type implements an interface by implementing its methods (implicitly, no 'implements' keyword).",
  },
  {
    question: "What is the empty interface interface{}?",
    options: [
      "A broken interface",
      "Can hold values of any type",
      "An error",
      "A null interface",
    ],
    correctAnswer: 1,
    explanation:
      "The empty interface interface{} has no methods, so all types implement it. It can hold values of any type. Similar to 'any' in other languages (Go 1.18+ has 'any' alias).",
  },
  {
    question: "How do you check the type of an interface value?",
    options: [
      "typeof(value)",
      "value.(Type) and type assertion or type switch",
      "value.type()",
      "getType(value)",
    ],
    correctAnswer: 1,
    explanation:
      "Use type assertion: value.(Type) or type switch: switch v := i.(type). Type assertion returns value and boolean indicating success.",
  },
  {
    question: "What is a pointer in Go?",
    options: [
      "A cursor",
      "A variable that stores memory address of another variable",
      "An array index",
      "A reference",
    ],
    correctAnswer: 1,
    explanation:
      "A pointer holds the memory address of a value. Use & to get pointer to value and * to dereference pointer. Go has pointers but no pointer arithmetic.",
  },
  {
    question: "What does the & operator do?",
    options: [
      "Bitwise AND",
      "Gets the memory address (pointer) of a variable",
      "Logical AND",
      "Concatenation",
    ],
    correctAnswer: 1,
    explanation:
      "The & operator generates a pointer to its operand. &x gives you the memory address of x, creating a pointer to x.",
  },
  {
    question: "What does the * operator do with pointers?",
    options: [
      "Multiplication",
      "Dereferences pointer to access the value it points to",
      "Creates pointer",
      "Pointer arithmetic",
    ],
    correctAnswer: 1,
    explanation:
      "The * operator dereferences a pointer, giving access to the value at that address. *p accesses the value pointed to by pointer p.",
  },
  {
    question: "What is error handling in Go?",
    options: [
      "Try-catch blocks",
      "Functions return error as last return value",
      "Exceptions",
      "No error handling",
    ],
    correctAnswer: 1,
    explanation:
      "Go uses explicit error handling. Functions return error as the last return value. Caller checks if error is nil to determine success or failure.",
  },
  {
    question: "What is the error interface?",
    options: [
      "A bug",
      "An interface with Error() string method",
      "An exception type",
      "A logging mechanism",
    ],
    correctAnswer: 1,
    explanation:
      "The error interface is a built-in interface with a single method: Error() string. Any type implementing this method satisfies the error interface.",
  },
  {
    question: "How do you create a custom error?",
    options: [
      "throw new Error()",
      "errors.New('message') or fmt.Errorf()",
      "error('message')",
      "raise Exception",
    ],
    correctAnswer: 1,
    explanation:
      "Use errors.New('message') for simple errors or fmt.Errorf('format %v', value) for formatted errors. Can also create custom error types.",
  },
  {
    question: "What does panic do in Go?",
    options: [
      "Logs a warning",
      "Stops normal execution and begins panicking",
      "Creates an error",
      "Exits gracefully",
    ],
    correctAnswer: 1,
    explanation:
      "panic stops normal execution of current goroutine and begins panicking. Deferred functions run, then program crashes. Use for unrecoverable errors.",
  },
  {
    question: "What does recover do?",
    options: [
      "Recovers memory",
      "Regains control of panicking goroutine when called in defer",
      "Restores data",
      "Fixes errors",
    ],
    correctAnswer: 1,
    explanation:
      "recover regains control of a panicking goroutine. Must be called inside a deferred function. Returns the value passed to panic or nil if not panicking.",
  },
  {
    question: "What is the defer, panic, recover pattern?",
    options: [
      "Design pattern",
      "Error handling mechanism similar to try-catch-finally",
      "Concurrency pattern",
      "Testing pattern",
    ],
    correctAnswer: 1,
    explanation:
      "defer/panic/recover is Go's mechanism similar to try-catch-finally. defer runs cleanup, panic raises errors, recover catches panics in deferred functions.",
  },
  {
    question: "What is a package in Go?",
    options: [
      "A zip file",
      "A way to organize and reuse code",
      "A container",
      "A module",
    ],
    correctAnswer: 1,
    explanation:
      "A package is a collection of Go source files in the same directory. Packages are Go's way of organizing and reusing code. Every Go file belongs to a package.",
  },
  {
    question: "What is the init function?",
    options: [
      "Constructor",
      "Special function that runs automatically when package is imported",
      "Initializer method",
      "Setup function",
    ],
    correctAnswer: 1,
    explanation:
      "init() is a special function that runs automatically when the package is imported, before main(). Used for initialization. Multiple init() functions can exist.",
  },
  {
    question: "What is the main package?",
    options: [
      "Most important package",
      "Entry point package that defines executable program",
      "Main library",
      "Root package",
    ],
    correctAnswer: 1,
    explanation:
      "The main package defines an executable program (not a library). Must have a main() function which is the entry point of the program.",
  },
  {
    question: "How do you export identifiers from a package?",
    options: [
      "export keyword",
      "Capitalize the first letter",
      "public keyword",
      "Use exports object",
    ],
    correctAnswer: 1,
    explanation:
      "In Go, identifiers are exported by capitalizing the first letter. Lowercase identifiers are private to the package. No explicit export keyword needed.",
  },
  {
    question: "What are Go modules?",
    options: [
      "Code modules",
      "Dependency management system for Go projects",
      "Import statements",
      "Package managers",
    ],
    correctAnswer: 1,
    explanation:
      "Go modules is the official dependency management system. go.mod file defines module path and dependencies. Introduced in Go 1.11, standard since 1.13.",
  },
  {
    question: "What does go mod init do?",
    options: [
      "Initializes variables",
      "Creates a new go.mod file for a module",
      "Installs modules",
      "Imports modules",
    ],
    correctAnswer: 1,
    explanation:
      "go mod init <module-path> creates a new go.mod file, initializing a new module. The module path is typically the repository path where code will be published.",
  },
  {
    question: "What does go mod tidy do?",
    options: [
      "Cleans code",
      "Adds missing and removes unused module dependencies",
      "Formats code",
      "Organizes imports",
    ],
    correctAnswer: 1,
    explanation:
      "go mod tidy adds missing module dependencies and removes unused ones from go.mod and go.sum. It ensures dependencies match the source code.",
  },
  {
    question: "What is go.sum file?",
    options: [
      "Summary file",
      "Contains cryptographic checksums of module dependencies",
      "Sum calculations",
      "Build output",
    ],
    correctAnswer: 1,
    explanation:
      "go.sum contains cryptographic checksums of specific module versions. It ensures that future downloads produce the same bits, providing security and reproducibility.",
  },
  {
    question: "What is a WaitGroup?",
    options: [
      "A waiting room",
      "Sync primitive to wait for collection of goroutines to finish",
      "A time delay",
      "A channel type",
    ],
    correctAnswer: 1,
    explanation:
      "sync.WaitGroup waits for a collection of goroutines to finish. Add() increments counter, Done() decrements, Wait() blocks until counter is zero.",
  },
  {
    question: "What is a Mutex?",
    options: [
      "Musical term",
      "Mutual exclusion lock for protecting shared data",
      "Multiple execution",
      "A channel",
    ],
    correctAnswer: 1,
    explanation:
      "sync.Mutex (mutual exclusion) provides a locking mechanism to protect shared data from concurrent access. Lock() acquires, Unlock() releases the lock.",
  },
  {
    question: "What's the difference between Mutex and RWMutex?",
    options: [
      "No difference",
      "RWMutex allows multiple readers or one writer, Mutex allows only one",
      "RWMutex is deprecated",
      "Mutex is faster",
    ],
    correctAnswer: 1,
    explanation:
      "sync.RWMutex allows multiple concurrent readers or a single writer. sync.Mutex allows only one goroutine at a time. RWMutex is better when reads are more frequent.",
  },
  {
    question: "What does close() do with channels?",
    options: [
      "Deletes channel",
      "Closes channel indicating no more values will be sent",
      "Stops goroutine",
      "Blocks channel",
    ],
    correctAnswer: 1,
    explanation:
      "close(ch) closes a channel, indicating no more values will be sent. Receivers can detect closure with v, ok := <-ch. Only sender should close, never receiver.",
  },
  {
    question: "What happens when you receive from a closed channel?",
    options: [
      "Error",
      "Returns zero value and false for ok",
      "Blocks forever",
      "Panics",
    ],
    correctAnswer: 1,
    explanation:
      "Receiving from a closed channel immediately returns the zero value of the channel's type and false for the second ok value. Never panics on receive.",
  },
  {
    question: "What happens when you send to a closed channel?",
    options: ["Nothing", "Panics", "Returns error", "Blocks"],
    correctAnswer: 1,
    explanation:
      "Sending to a closed channel causes a panic. This is why only the sender should close channels, and only when absolutely necessary.",
  },
  {
    question: "What is the context package used for?",
    options: [
      "Text context",
      "Carries deadlines, cancellation signals, and request-scoped values",
      "Application context",
      "Background jobs",
    ],
    correctAnswer: 1,
    explanation:
      "context package carries deadlines, cancellation signals, and request-scoped values across API boundaries and between goroutines. Essential for managing goroutine lifecycles.",
  },
  {
    question: "What does context.Background() return?",
    options: [
      "Background color",
      "An empty, non-nil context used as root context",
      "A goroutine",
      "Background process",
    ],
    correctAnswer: 1,
    explanation:
      "context.Background() returns non-nil, empty Context. Used as root context for main function, initialization, and tests. Never canceled, has no values or deadline.",
  },
  {
    question: "What does context.WithTimeout do?",
    options: [
      "Sets timeout",
      "Returns context that automatically cancels after specified duration",
      "Delays execution",
      "Waits for duration",
    ],
    correctAnswer: 1,
    explanation:
      "context.WithTimeout returns a context and cancel function. The context automatically cancels after the specified duration, useful for limiting operation time.",
  },
  {
    question: "What does context.WithCancel return?",
    options: [
      "Cancel button",
      "A context and cancel function to manually cancel context",
      "Cancellation token",
      "Stop signal",
    ],
    correctAnswer: 1,
    explanation:
      "context.WithCancel returns a copy of parent context and a cancel function. Calling cancel closes Done channel, signaling operations to stop.",
  },
  {
    question: "How do you test if a channel is closed?",
    options: [
      "ch.closed()",
      "value, ok := <-ch; ok is false if closed",
      "isClosed(ch)",
      "ch == nil",
    ],
    correctAnswer: 1,
    explanation:
      "Use two-value receive: value, ok := <-ch. If ok is false, channel is closed and value is zero value. This is the idiomatic way to detect closure.",
  },
  {
    question: "What is the blank identifier _?",
    options: [
      "Space character",
      "Used to ignore values you don't need",
      "Empty string",
      "Null value",
    ],
    correctAnswer: 1,
    explanation:
      "The blank identifier _ is a special identifier that ignores values. Used when syntax requires a variable but you don't need the value (e.g., for _, v := range slice).",
  },
  {
    question: "What does := operator do?",
    options: [
      "Assignment only",
      "Short variable declaration with type inference",
      "Comparison",
      "Equality check",
    ],
    correctAnswer: 1,
    explanation:
      ":= is short variable declaration that declares and initializes variables with type inference. Only works inside functions, not at package level.",
  },
  {
    question: "What is the difference between = and :=?",
    options: [
      "No difference",
      "= assigns to existing variables, := declares and assigns new variables",
      "= is older syntax",
      ":= is slower",
    ],
    correctAnswer: 1,
    explanation:
      "= is simple assignment to existing variables. := declares new variables and assigns values (type inferred). Can't use := at package level.",
  },
  {
    question: "What is a variadic function?",
    options: [
      "Variable function",
      "Function that accepts variable number of arguments",
      "Varying return types",
      "Multiple functions",
    ],
    correctAnswer: 1,
    explanation:
      "Variadic function accepts variable number of arguments using ...Type syntax. Example: func sum(nums ...int). Arguments are received as a slice.",
  },
  {
    question: "How do you pass a slice to a variadic function?",
    options: [
      "Just pass the slice",
      "Use ... operator: function(slice...)",
      "Convert to array",
      "Loop and pass elements",
    ],
    correctAnswer: 1,
    explanation:
      "Use ... operator after slice name: function(slice...). This unpacks the slice elements as individual arguments to the variadic function.",
  },
  {
    question: "What is type alias in Go?",
    options: [
      "Alternate name",
      "An alternative name for an existing type using =",
      "New type",
      "Type conversion",
    ],
    correctAnswer: 1,
    explanation:
      "Type alias creates an alternative name for existing type: type MyInt = int. It's identical to the original type, not a new type.",
  },
  {
    question: "What is a type definition versus type alias?",
    options: [
      "Same thing",
      "Type definition creates new type, alias is just another name",
      "No difference",
      "Alias is deprecated",
    ],
    correctAnswer: 1,
    explanation:
      "type MyInt int creates a new type (requires conversion). type MyInt = int creates an alias (same type). Definitions give type safety, aliases don't.",
  },
  {
    question: "What does make() do?",
    options: [
      "Makes variables",
      "Allocates and initializes slices, maps, and channels",
      "Makes structs",
      "Compiles code",
    ],
    correctAnswer: 1,
    explanation:
      "make() allocates and initializes slices, maps, and channels. Unlike new(), make returns initialized (not zeroed) value of type T, not *T.",
  },
  {
    question: "What does new() do?",
    options: [
      "Creates new variables",
      "Allocates zeroed memory and returns pointer",
      "Makes slices",
      "Initializes structs",
    ],
    correctAnswer: 1,
    explanation:
      "new(T) allocates zeroed storage for a new item of type T and returns its address, a value of type *T. The value is zeroed but not initialized.",
  },
  {
    question: "What's the difference between make and new?",
    options: [
      "No difference",
      "make initializes slices/maps/channels and returns type T, new zeros memory and returns *T",
      "new is deprecated",
      "make is faster",
    ],
    correctAnswer: 1,
    explanation:
      "make() is for slices, maps, channels and returns initialized value of type T. new() works with any type, returns pointer to zeroed memory *T.",
  },
  {
    question: "What is embedding in Go?",
    options: [
      "Nested loops",
      "Including one struct/interface in another for composition",
      "Inheritance",
      "Import statements",
    ],
    correctAnswer: 1,
    explanation:
      "Embedding is Go's composition mechanism. An embedded type's methods are promoted to the outer type. It's composition without inheritance.",
  },
  {
    question: "What is the len() function?",
    options: [
      "Length of string only",
      "Returns length of arrays, slices, maps, strings, channels",
      "Line count",
      "Loop length",
    ],
    correctAnswer: 1,
    explanation:
      "len() returns the number of elements in arrays, slices, maps, strings, or buffered elements in channels. Built-in function that works with various types.",
  },
  {
    question: "What is the cap() function?",
    options: [
      "Capacity of strings",
      "Returns capacity of slices and channels",
      "Capital letters",
      "Maximum value",
    ],
    correctAnswer: 1,
    explanation:
      "cap() returns capacity (maximum size without reallocation) of slices, arrays, and channels. For slices, it's the size of the underlying array.",
  },
  {
    question: "What is the append() function?",
    options: [
      "Adds to strings",
      "Adds elements to slice end, returns new slice",
      "Appends files",
      "Concatenates arrays",
    ],
    correctAnswer: 1,
    explanation:
      "append() adds elements to the end of a slice. Returns a new slice. If capacity exceeded, a new underlying array is allocated with larger capacity.",
  },
  {
    question: "What is copy() function for?",
    options: [
      "Duplicates variables",
      "Copies elements from source slice to destination slice",
      "Copies files",
      "Clones objects",
    ],
    correctAnswer: 1,
    explanation:
      "copy(dst, src) copies elements from source slice to destination slice. Returns number of elements copied (minimum of len(dst) and len(src)).",
  },
  {
    question: "What is testing package used for?",
    options: [
      "Production tests",
      "Writing unit tests and benchmarks",
      "Test data",
      "Testing environments",
    ],
    correctAnswer: 1,
    explanation:
      "testing package provides support for automated testing. Test files end with _test.go. Test functions start with Test, benchmarks with Benchmark.",
  },
  {
    question: "How do you run tests in Go?",
    options: ["test run", "go test", "run tests", "go check"],
    correctAnswer: 1,
    explanation:
      "go test runs all tests in the current package. Use go test ./... to test all packages recursively. Tests must be in *_test.go files.",
  },
  {
    question: "What is t.Run() in tests?",
    options: [
      "Runs tests",
      "Defines a subtest with a name",
      "Runs goroutines",
      "Executes functions",
    ],
    correctAnswer: 1,
    explanation:
      "t.Run() runs a subtest with a given name. Useful for table-driven tests where you can group related test cases and run them individually.",
  },
  {
    question: "What does t.Error() do in tests?",
    options: [
      "Creates errors",
      "Reports error but continues test execution",
      "Stops test",
      "Throws exception",
    ],
    correctAnswer: 1,
    explanation:
      "t.Error() marks test as failed and logs message but continues executing the test. Use t.Fatal() to stop test immediately after failure.",
  },
  {
    question: "What's the difference between t.Error() and t.Fatal()?",
    options: [
      "No difference",
      "t.Error() continues execution, t.Fatal() stops immediately",
      "t.Fatal() is deprecated",
      "t.Error() is for errors only",
    ],
    correctAnswer: 1,
    explanation:
      "t.Error() marks failure but continues test. t.Fatal() marks failure and stops test immediately. Use Fatal for critical failures where continuing is pointless.",
  },
  {
    question: "What is table-driven testing?",
    options: [
      "Database testing",
      "Using slice of test cases with input/expected output pairs",
      "Testing tables",
      "Excel testing",
    ],
    correctAnswer: 1,
    explanation:
      "Table-driven testing uses a slice of structs containing test inputs and expected outputs. Iterate and run each case, making tests more maintainable.",
  },
  {
    question: "What is reflection in Go?",
    options: [
      "Mirror image",
      "Runtime inspection of types and values using reflect package",
      "Code reflection",
      "Self-documentation",
    ],
    correctAnswer: 1,
    explanation:
      "Reflection allows runtime inspection and manipulation of types and values. reflect package provides TypeOf() and ValueOf() for examining interface values.",
  },
  {
    question: "What is the reflect.TypeOf() function?",
    options: [
      "Type conversion",
      "Returns the reflection Type of the value",
      "Type checking",
      "Type definition",
    ],
    correctAnswer: 1,
    explanation:
      "reflect.TypeOf() returns the reflection Type that represents the dynamic type of the interface value. Used for runtime type inspection.",
  },
  {
    question: "What is the reflect.ValueOf() function?",
    options: [
      "Value conversion",
      "Returns the reflection Value of the interface value",
      "Gets value",
      "Value checking",
    ],
    correctAnswer: 1,
    explanation:
      "reflect.ValueOf() returns a new reflect.Value initialized to the concrete value stored in the interface. Allows inspection and manipulation of values.",
  },
  {
    question: "What is the go keyword?",
    options: [
      "Go language",
      "Starts a new goroutine",
      "Goto statement",
      "Go function",
    ],
    correctAnswer: 1,
    explanation:
      "The go keyword starts a new goroutine. go function() executes function concurrently in a new lightweight thread managed by Go runtime.",
  },
  {
    question: "What is a buffered channel created with?",
    options: [
      "make(chan Type)",
      "make(chan Type, capacity)",
      "new(chan Type)",
      "chan Type{size}",
    ],
    correctAnswer: 1,
    explanation:
      "Buffered channels are created with make(chan Type, capacity). The capacity is buffer size. make(chan Type) or make(chan Type, 0) creates unbuffered channel.",
  },
  {
    question:
      "What happens when a goroutine tries to send on a full buffered channel?",
    options: [
      "Message is dropped",
      "Goroutine blocks until space is available",
      "Creates larger buffer",
      "Returns error",
    ],
    correctAnswer: 1,
    explanation:
      "When a buffered channel is full, sending goroutine blocks until another goroutine receives from channel, making space available in the buffer.",
  },
  {
    question: "What is a deadlock in Go?",
    options: [
      "Locked code",
      "All goroutines are blocked waiting, program can't proceed",
      "Security lock",
      "Mutex lock",
    ],
    correctAnswer: 1,
    explanation:
      "Deadlock occurs when all goroutines are blocked waiting for something that will never happen. Go runtime detects deadlocks and panics with 'fatal error: all goroutines are asleep'.",
  },
  {
    question: "What is the select default case?",
    options: [
      "Default channel",
      "Executed when no other case is ready, prevents blocking",
      "Default value",
      "Fallback option",
    ],
    correctAnswer: 1,
    explanation:
      "The default case in select is executed when no other case is ready. Makes select non-blocking. Useful for polling or implementing timeouts.",
  },
  {
    question: "What does time.After() return?",
    options: [
      "Time value",
      "A channel that sends time after duration",
      "Timer object",
      "Delay function",
    ],
    correctAnswer: 1,
    explanation:
      "time.After(duration) returns a channel that sends the current time after the specified duration. Commonly used in select for timeouts.",
  },
  {
    question: "What is the difference between time.Sleep() and time.After()?",
    options: [
      "No difference",
      "Sleep blocks goroutine, After returns channel for select",
      "After is deprecated",
      "Sleep is faster",
    ],
    correctAnswer: 1,
    explanation:
      "time.Sleep() blocks the current goroutine. time.After() returns a channel for use in select, allowing timeout patterns without blocking.",
  },
  {
    question: "What is a race condition?",
    options: [
      "Racing goroutines",
      "Multiple goroutines access shared data concurrently without synchronization",
      "Speed competition",
      "Timing issue",
    ],
    correctAnswer: 1,
    explanation:
      "Race condition occurs when multiple goroutines access shared data concurrently and at least one modifies it, without proper synchronization. Results are unpredictable.",
  },
  {
    question: "How do you detect race conditions?",
    options: [
      "Visual inspection",
      "Run tests with -race flag: go test -race",
      "Use debugger",
      "Log everything",
    ],
    correctAnswer: 1,
    explanation:
      "Go's race detector finds race conditions at runtime. Run with -race flag: go run -race or go test -race. Reports concurrent conflicting accesses.",
  },
  {
    question: "What is the sync.Once type?",
    options: [
      "One-time variable",
      "Ensures action is performed exactly once across multiple goroutines",
      "Single goroutine",
      "One channel",
    ],
    correctAnswer: 1,
    explanation:
      "sync.Once ensures a function is executed exactly once, even when called from multiple goroutines. Useful for one-time initialization.",
  },
  {
    question: "What is the sync.Pool type?",
    options: [
      "Connection pool",
      "Cache for reusing objects to reduce memory allocations",
      "Thread pool",
      "Goroutine pool",
    ],
    correctAnswer: 1,
    explanation:
      "sync.Pool is a cache for temporary objects that can be reused. Reduces memory allocations and garbage collection pressure. Objects may be removed automatically.",
  },
  {
    question: "What is the atomic package for?",
    options: [
      "Physics calculations",
      "Atomic operations on primitive types for lock-free synchronization",
      "Small operations",
      "Molecular operations",
    ],
    correctAnswer: 1,
    explanation:
      "sync/atomic provides low-level atomic memory operations for primitive types. Useful for lock-free data structures and counters without mutexes.",
  },
  {
    question: "What is a channel direction?",
    options: [
      "Data flow direction",
      "Restricting channel to send-only or receive-only",
      "Channel orientation",
      "Message direction",
    ],
    correctAnswer: 1,
    explanation:
      "Channel direction restricts channel use. chan<- T is send-only, <-chan T is receive-only. Used in function signatures to enforce correct usage and prevent mistakes.",
  },
  {
    question: "What does struct{}{} represent?",
    options: [
      "Empty struct value",
      "Zero-size empty struct value, uses no memory",
      "Null struct",
      "Broken syntax",
    ],
    correctAnswer: 1,
    explanation:
      "struct{}{} is the value of empty struct type. Takes zero bytes of storage. Useful for signaling in channels when no data needs to be sent.",
  },
  {
    question: "What is the iota identifier?",
    options: [
      "Iterator variable",
      "Constant generator that increments in const blocks",
      "Index variable",
      "Interface identifier",
    ],
    correctAnswer: 1,
    explanation:
      "iota is a predeclared identifier used in const declarations. Represents successive untyped integer constants starting from 0, incrementing by 1 each line.",
  },
  {
    question: "What is Go's convention for package naming?",
    options: [
      "CamelCase",
      "Short, lowercase, single-word names",
      "snake_case",
      "kebab-case",
    ],
    correctAnswer: 1,
    explanation:
      "Package names should be short, concise, lowercase, single-word names without underscores or mixed caps. Should be evocative and clear about purpose.",
  },
  {
    question: "What is the purpose of go fmt?",
    options: [
      "Format strings",
      "Automatically formats Go source code to standard style",
      "Format output",
      "File formatting",
    ],
    correctAnswer: 1,
    explanation:
      "go fmt formats Go source code according to standard style. Ensures consistent code formatting across projects. gofmt is the underlying tool.",
  },
  {
    question: "What does go vet do?",
    options: [
      "Veterinary checks",
      "Examines code for suspicious constructs and potential bugs",
      "Version check",
      "Validates syntax",
    ],
    correctAnswer: 1,
    explanation:
      "go vet examines Go source code and reports suspicious constructs like unreachable code, incorrect function signatures, or common mistakes. Static analysis tool.",
  },
  {
    question: "Output: What is printed by `fmt.Println(len(make([]int, 2, 5)), cap(make([]int, 2, 5)))`?",
    options: ["2 2", "2 5", "5 5", "0 5"],
    correctAnswer: 1,
    explanation: "Length is initialized as 2 while capacity is 5.",
  },
  {
    question: "Output: `m := map[string]int{\"a\":1}; v, ok := m[\"b\"];` what are `v` and `ok`?",
    options: ["1 true", "0 false", "0 true", "panic"],
    correctAnswer: 1,
    explanation: "Missing key returns zero value and `ok=false`.",
  },
  {
    question: "Tricky: Which statement about interfaces is correct?",
    options: [
      "Types must explicitly declare implemented interfaces",
      "Interface implementation is implicit in Go",
      "Only structs can implement interfaces",
      "Interfaces cannot be composed",
    ],
    correctAnswer: 1,
    explanation: "Go uses structural typing with implicit interface satisfaction.",
  },
  {
    question: "Tricky: What usually causes goroutine leaks?",
    options: [
      "Using WaitGroup",
      "Blocked sends/receives with no cancellation path",
      "Using buffered channels",
      "Using select statement",
    ],
    correctAnswer: 1,
    explanation:
      "Leaks happen when goroutines block forever due to missing receiver/sender or no cancellation.",
  },
  {
    question: "Which is idiomatic for operation timeout in Go services?",
    options: [
      "Infinite retry loop",
      "context.WithTimeout + select/propagation",
      "Thread sleep in loop",
      "panic and recover",
    ],
    correctAnswer: 1,
    explanation:
      "Context-based deadlines are idiomatic for cancellable operations across call boundaries.",
  },
  {
    question: "Output: What prints? `s := []int{1,2}; t := s; t[0]=9; fmt.Println(s[0])`",
    options: ["1", "9", "0", "panic"],
    correctAnswer: 1,
    explanation:
      "Slices share backing arrays, so mutation through one view is visible in the other.",
  },
  {
    question: "Which map operation is concurrency-safe without locking?",
    options: [
      "Concurrent writes",
      "Concurrent read and write",
      "Only read-only concurrent access",
      "None, not even reads",
    ],
    correctAnswer: 2,
    explanation:
      "Read-only concurrent access is safe; writes require synchronization.",
  },
  {
    question: "Output: What prints? `x := 1; defer fmt.Println(x); x = 2`",
    options: ["1", "2", "panic", "depends"],
    correctAnswer: 0,
    explanation:
      "Deferred call arguments are evaluated at defer time, so it prints original value 1.",
  },
];
