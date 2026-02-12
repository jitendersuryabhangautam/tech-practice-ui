# Adding New Content to JSON Files

## JSON File Structure

Each technology has a JSON file in `public/data/` folder with this structure:

```json
{
  "title": "Technology Name",
  "description": "Brief overview of what you'll learn",
  "topics": [
    {
      "id": "unique-topic-id",
      "title": "Topic Title",
      "description": "One-line description",
      "explanation": "Detailed explanation with:\n- How it works\n- Key concepts\n- Best practices\n- Common pitfalls",
      "implementation": "// Basic implementation code",
      "example": "// Practical examples with comments",
      "useCase": "When and where to use this"
    }
  ],
  "quiz": [
    {
      "id": 1,
      "question": "Your question here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Detailed explanation of the correct answer"
    }
  ]
}
```

## Adding a New Topic

1. Open the appropriate JSON file (e.g., `public/data/javascript.json`)
2. Add a new object to the `topics` array:

```json
{
  "id": "unique-id",
  "title": "Your Topic Title",
  "description": "Brief one-liner",
  "explanation": "Multi-line detailed explanation.\n\nUse \\n for new lines.\n\nInclude:\n- Key concepts\n- How it works\n- Why it's important",
  "implementation": "// Your code implementation\nfunction example() {\n  // code here\n}",
  "example": "// Practical usage example\nconst result = example();\nconsole.log(result);",
  "useCase": "When to use this, real-world scenarios"
}
```

## Adding Quiz Questions

Add new questions to the `quiz` array:

```json
{
  "id": 6,
  "question": "What is the main purpose of X?",
  "options": [
    "First option",
    "Second option (correct)",
    "Third option",
    "Fourth option"
  ],
  "correctAnswer": 1,
  "explanation": "Explain why option 2 is correct and why others are wrong"
}
```

## Tips for Writing Content

### Explanations

- Start with what it is
- Explain how it works
- List key concepts with bullet points
- Include best practices
- Mention common mistakes

### Code Examples

- Use proper indentation
- Add helpful comments
- Show realistic use cases
- Include edge cases

### Use Cases

- Be specific (not just "for X operations")
- Give real-world examples
- Explain when NOT to use it

## Example: Adding a New JavaScript Topic

```json
{
  "id": "event-loop",
  "title": "Event Loop",
  "description": "The mechanism that enables JavaScript to perform non-blocking operations despite being single-threaded.",
  "explanation": "The Event Loop is JavaScript's concurrency model that handles asynchronous operations. JavaScript is single-threaded, meaning it can only execute one thing at a time, but the Event Loop allows it to handle async operations like API calls without blocking.\n\nHow it works:\n1. Call Stack executes synchronous code\n2. Async operations (setTimeout, fetch) go to Web APIs\n3. When complete, callbacks go to Task Queue\n4. Event Loop checks if Call Stack is empty\n5. If empty, moves tasks from Queue to Call Stack\n\nKey concepts:\n- Call Stack: Where code executes\n- Task Queue: Where callbacks wait\n- Microtask Queue: Priority queue (Promises)\n- Event Loop: Moves tasks to Call Stack",
  "implementation": "// Demonstrating Event Loop\nconsole.log('1');\n\nsetTimeout(() => {\n  console.log('2');\n}, 0);\n\nPromise.resolve().then(() => {\n  console.log('3');\n});\n\nconsole.log('4');\n\n// Output: 1, 4, 3, 2\n// Explanation:\n// - Sync code (1, 4) runs first\n// - Promises (microtasks) run next (3)\n// - setTimeout (macrotask) runs last (2)",
  "example": "// Real-world example: Fetching data\nfunction fetchData() {\n  console.log('Start fetching');\n  \n  fetch('/api/data')\n    .then(res => res.json())\n    .then(data => {\n      console.log('Data received:', data);\n    });\n  \n  console.log('Fetch initiated');\n}\n\n// Output:\n// Start fetching\n// Fetch initiated\n// Data received: {...}\n\n// The fetch doesn't block execution!",
  "useCase": "Understanding async behavior, debugging timing issues, optimizing performance, handling multiple async operations"
}
```

## Available JSON Files

- `javascript.json` - JavaScript fundamentals
- `react.json` - React concepts (add more hooks, patterns)
- `nextjs.json` - Next.js features (to be created)
- `golang.json` - Go programming (to be created)
- `postgresql.json` - Database concepts (to be created)
- `docker.json` - Docker commands (to be created)
- `kubernetes.json` - K8s resources (to be created)

## Formatting Tips

- Use `\n` for new lines in strings
- Use `\n\n` for paragraph breaks
- Indent code with 2 spaces
- Keep lines under 80 characters when possible
- Use bullet points with `- ` for lists
- Bold important terms (works in markdown sections)

## Validation

After adding content, check:

- ✅ Valid JSON syntax (use a JSON validator)
- ✅ Unique IDs for topics and quiz questions
- ✅ All required fields present
- ✅ correctAnswer index is valid (0-3)
- ✅ Code examples are properly escaped
- ✅ No trailing commas

## Need Help?

Run your JSON through a validator:

```bash
# Using Node.js
node -e "console.log(JSON.parse(require('fs').readFileSync('public/data/javascript.json')))"
```

Or use online tools like jsonlint.com
