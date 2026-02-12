# Tech Revision Platform 🚀

A comprehensive Next.js-based learning platform for revising JavaScript, ReactJS, Next.js, Golang, PostgreSQL, Docker, and Kubernetes concepts with an interactive card-based UI, MCQ quizzes, and light/dark themes.

## 📋 Features

### 🎓 7 Technology Categories

- **JavaScript** 💛 (Debouncing, Throttling, Currying, Array/Object operations, Async programming)
- **ReactJS** ⚛️ (Hooks, Component Patterns, Performance Optimization)
- **Next.js** ▲ (App Router, SSR, SSG, ISR, Server Components, Server Actions)
- **Golang** 🐹 (Syntax, Concurrency, Goroutines, Channels, Data Structures)
- **PostgreSQL** 🐘 (Queries, Joins, Indexes, Transactions, Optimization)
- **Docker** 🐳 (Commands, Dockerfile, Compose, Networking, Volumes)
- **Kubernetes** ☸️ (Pods, Services, Deployments, ConfigMaps, kubectl commands)

### ✨ New Features

- **🌓 Light/Dark Theme Toggle**: Switch between themes with persistent localStorage
- **📝 Interactive MCQ Quizzes**: Test your knowledge with 5-8 questions per topic
  - Progressive question flow
  - Instant feedback with explanations
  - Score tracking and review
  - Retry option
- **📚 Enhanced Explanations**: Detailed descriptions with real-world context
- **🎨 Modern UI**: Clean design with smooth transitions
- **📱 Fully Responsive**: Optimized for all screen sizes

### 💡 Learning Features

- **Interactive Card-Based UI**: Expandable cards with code examples, commands, and use cases
- **Detailed Explanations**: Each concept includes why, when, and how to use it
- **Code Examples**: Syntax-highlighted code blocks with practical examples
- **Visual Feedback**: Color-coded quiz answers (green/red)
- **Progress Tracking**: Visual progress bars in quizzes
- **Easy Navigation**: Quick navigation between topics with back buttons

## 🛠️ Tech Stack

- **Next.js 15** with App Router
- **JavaScript** (no TypeScript)
- **Tailwind CSS** for styling
- **React 18** for UI components

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone or navigate to the project directory:

```bash
cd "Practice throug UI"
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open your browser and visit:

```
http://localhost:3000
```

## 📁 Project Structure

```
├── app/                      # Next.js app directory
│   ├── layout.jsx           # Root layout with ThemeProvider
│   ├── page.jsx             # Home page with technology cards
│   ├── globals.css          # Global styles and Tailwind
│   ├── javascript/          # JavaScript concepts page
│   ├── react/               # React concepts page
│   ├── nextjs/              # Next.js concepts page
│   ├── golang/              # Golang concepts page
│   ├── postgresql/          # PostgreSQL concepts page
│   ├── docker/              # Docker concepts page
│   └── kubernetes/          # Kubernetes concepts page
├── components/              # Reusable React components
│   ├── Card.jsx            # Expandable content card (theme-aware)
│   ├── BackButton.jsx      # Navigation button
│   ├── Quiz.jsx            # Interactive MCQ quiz component
│   ├── ThemeProvider.jsx   # Theme context provider
│   └── ThemeToggle.jsx     # Light/Dark theme toggle button
├── data/                    # Content data files
│   ├── javascript.js       # JavaScript topics + quiz
│   ├── react.js            # React topics + quiz
│   ├── nextjs.js           # Next.js topics + quiz
│   ├── golang.js           # Golang topics + quiz
│   ├── postgresql.js       # PostgreSQL topics + quiz
│   ├── docker.js           # Docker topics + quiz
│   └── kubernetes.js       # Kubernetes topics
├── public/                  # Static assets
├── .github/                 # GitHub configuration
│   └── copilot-instructions.md
├── jsconfig.json           # JavaScript configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── postcss.config.mjs      # PostCSS configuration
├── next.config.js          # Next.js configuration
└── package.json            # Project dependencies

```

## 🎯 Usage

### Getting Started

1. **Home Page**: Browse all available technology categories
2. **Theme Toggle**: Click the sun/moon icon (top-right) to switch between light/dark themes
3. **Topic Pages**: Click on any technology card to view detailed topics

### Taking Quizzes

1. Each topic page features an interactive quiz at the top
2. Answer multiple-choice questions one at a time
3. Get instant feedback with detailed explanations
4. Review your final score and answers
5. Retry the quiz to improve your understanding

### Exploring Content

1. **Expandable Cards**: Click any card to view:
   - Detailed explanations
   - Code examples with syntax highlighting
   - Practical examples
   - Commands (for Docker/Kubernetes/PostgreSQL)
   - Real-world use cases
2. **Back Navigation**: Use the back button to return to home
3. **Responsive Design**: Works on all devices (desktop, tablet, mobile)

## 📚 Content Coverage

### JavaScript

- Function techniques (Debouncing, Throttling, Currying)
- Array methods (map, filter, reduce, find)
- Object operations (Destructuring, Spread/Rest)
- Async programming (Promises, Async/Await)

### ReactJS

- React Hooks (useState, useEffect, useMemo, useCallback, useRef, useContext)
- Component patterns (Controlled Components, HOC, Render Props, Compound Components)
- Performance optimization (React.memo, Code Splitting, Virtualization)

### Next.js

- App Router & Routing (Dynamic routes, Navigation, Route Groups)
- Data Fetching (Server Components, Client Components, SSG, SSR, ISR)
- API Routes (Route Handlers, Middleware, Server Actions)

### Golang

- Go Basics (Syntax, Functions, Structs, Interfaces)
- Concurrency (Goroutines, Channels, Select, Sync)
- Data Structures (Arrays, Slices, Maps)

### PostgreSQL

- Basic Queries (SELECT, INSERT, UPDATE, DELETE, Aggregations)
- Joins & Relationships (INNER, LEFT, RIGHT, FULL OUTER, Subqueries)
- Performance & Optimization (Indexes, Query Optimization, Transactions)

### Docker

- Docker Basics (Containers, Images, Core commands)
- Dockerfile (Building custom images, Multi-stage builds)
- Networking & Volumes (Networks, Persistent storage)
- Docker Compose (Multi-container apps, Service orchestration)

### Kubernetes

- Kubernetes Basics (Pods, Deployments, Services, Namespaces)
- Configuration & Storage (ConfigMaps, Secrets, Persistent Volumes)
- kubectl Commands (Essential and advanced operations)

## 🎨 Customization

### Adding New Topics

1. Create or edit a data file in the `data/` directory:

```javascript
export const myData = [
  {
    category: "Category Name",
    topics: [
      {
        id: "unique-id",
        title: "Topic Title",
        description: "Detailed description with context and explanations",
        code: `// Code example`,
        example: `// Additional example`,
        command: "# Command for Docker/K8s/PostgreSQL",
        useCase: "Real-world scenarios when to use this",
      },
    ],
  },
];

// Add quiz questions for the topic
export const myQuiz = [
  {
    question: "Your quiz question here?",
    options: ["Option A", "Option B", "Option C", "Option D"],
    correctAnswer: 0, // Index of correct option (0-3)
    explanation: "Detailed explanation of why this is the correct answer",
  },
  // Add more questions...
];
```

2. Import and use in your page component:

```javascript
import { myData, myQuiz } from "@/data/mydata";
import Card from "@/components/Card";
import Quiz from "@/components/Quiz";

export default function MyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-12">
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
            My Topic
          </h1>
          <p className="text-gray-700 dark:text-gray-400">
            Description of your topic
          </p>
        </header>

        <Quiz questions={myQuiz} />

        {myData.map((category) => (
          <section key={category.category} className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
              {category.category}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {category.topics.map((topic) => (
                <Card key={topic.id} card={topic} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
```

## 🔧 Available Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## 🤝 Contributing

Feel free to add more topics, improve existing content, or enhance the UI!

## 📝 License

This project is open source and available for learning purposes.

## 🌟 Acknowledgments

Built with Next.js, React, and Tailwind CSS for an optimal learning experience.

---

Happy Learning! 🎓
