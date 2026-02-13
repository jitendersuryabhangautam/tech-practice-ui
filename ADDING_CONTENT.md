# Adding New Content to Tech Revision Platform

## 📁 Data Structure

The platform supports **two data formats** for flexibility:

### 1. JSON Files (Recommended for expansion)

Location: `public/data/`

Structure:

```json
{
  "data": [
    {
      "category": "Category Name",
      "topics": [
        {
          "id": "topic-id",
          "title": "Topic Title",
          "description": "Brief description",
          "code": "// Code examples",
          "example": "// Usage examples",
          "useCase": "When to use this",
          "interviewQuestions": [
            {
              "question": "Question text?",
              "answer": "Detailed answer"
            }
          ],
          "exercises": [
            {
              "type": "command|scenario|debug|output",
              "question": "Exercise description",
              "answer": "Solution"
            }
          ],
          "programExercises": [
            {
              "type": "program",
              "question": "Program description",
              "code": "# Code to run",
              "output": "Expected output"
            }
          ]
        }
      ]
    }
  ],
  "quiz": [
    {
      "question": "Quiz question?",
      "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
      "correctAnswer": 1,
      "explanation": "Why this is correct"
    }
  ]
}
```

### 2. JavaScript Modules (Fallback)

Location: `data/`

Example: `data/docker.js`

```javascript
export const dockerData = [
  /* array of topics */
];
export const dockerQuiz = [
  /* array of quiz questions */
];
```

## 🚀 How to Add New Technology

### Step 1: Create JSON File

Create `public/data/your-technology.json`:

```json
{
  "data": [
    {
      "category": "Basics",
      "topics": [
        {
          "id": "intro",
          "title": "Introduction",
          "description": "Getting started",
          "code": "// Sample code",
          "interviewQuestions": [
            {
              "question": "What is X?",
              "answer": "X is..."
            }
          ]
        }
      ]
    }
  ],
  "quiz": [
    {
      "question": "First quiz question?",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": 0,
      "explanation": "A is correct because..."
    }
  ]
}
```

### Step 2: Create Page Component

Create `app/your-technology/page.jsx`:

```javascript
"use client";

import InterviewTopicPage from "@/components/InterviewTopicPage";
import { useTopicData } from "@/hooks/useTopicData";

export default function YourTechnologyPage() {
  // Load from JSON file (no fallback needed for new content)
  const { data, quiz, loading } = useTopicData("your-technology", [], []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-4">Loading content...</p>
        </div>
      </div>
    );
  }

  return (
    <InterviewTopicPage
      title="Your Technology Interview Preparation"
      description="Description of what users will learn"
      topics={data}
      quiz={quiz}
    />
  );
}
```

### Step 3: Add to Navigation

Update `components/Navbar.jsx`:

```javascript
const NAV_LINKS = [
  { href: "/", label: "Home" },
  // ... existing links
  { href: "/your-technology", label: "Your Tech" },
];
```

### Step 4: Add to Homepage

Update `app/page.jsx` to include your new technology card.

## 📝 Content Guidelines

### Interview Questions

- **Question**: Clear, concise question typically asked in interviews
- **Answer**: Detailed answer with:
  - Core concept explanation
  - Code examples where applicable
  - Edge cases and gotchas
  - Real-world context

### Exercises

Types:

- `command`: CLI/terminal commands
- `scenario`: Real-world problem-solving
- `debug`: Troubleshooting exercises
- `output`: Predict the output questions
- `tricky`: Edge cases and gotchas

### Program Exercises

- Full working code examples
- Expected output
- Explanation of what it demonstrates

### MCQ Quiz

- 4 options minimum
- Clear, unambiguous questions
- Detailed explanations for correct answers
- Include tricky edge cases

## 🔄 Converting Existing JS to JSON

For technologies still using JS modules (docker, kubernetes, postgresql, etc.):

### Manual Method:

1. Open `data/technology.js`
2. Copy the arrays
3. Create `public/data/technology.json`
4. Format as JSON (remove `export const`)
5. Wrap in `{"data": [...], "quiz": [...]}`

### Automated Script (in progress):

```bash
node scripts/convert-to-json.mjs
```

## 🎯 Benefits of JSON Format

1. **Easy to expand**: No need to rebuild, just update JSON
2. **Version control friendly**: Easier to review changes
3. **Portable**: Can be used by other tools/platforms
4. **Dynamic loading**: Fetch only what's needed
5. **API ready**: Can serve as REST API endpoints

## 🔍 Current Status

- ✅ **JavaScript**: JSON (public/data/javascript.json)
- ✅ **React**: JSON (public/data/react.json)
- ⏳ **Docker**: JS module (migration pending)
- ⏳ **Kubernetes**: JS module (migration pending)
- ⏳ **PostgreSQL**: JS module (migration pending)
- ⏳ **Next.js**: JS module (migration pending)
- ⏳ **Golang**: JS module (migration pending)

## 📚 Need Help?

Check existing files:

- Example JSON: `public/data/javascript.json`
- Example Page: `app/javascript/page.jsx`
- Data Hook: `hooks/useTopicData.js`
