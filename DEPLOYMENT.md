# Tech Revision Platform - Deployment Guide

## 🚀 Deploy to GitHub Pages

### Prerequisites

- GitHub account
- Git installed locally

### Step 1: Create GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the **+** icon in the top-right corner
3. Select **New repository**
4. Fill in the details:
   - **Repository name**: `tech-revision-platform` (or your preferred name)
   - **Description**: Tech interview revision platform for JavaScript, React, Next.js, Go, PostgreSQL, Docker, Kubernetes
   - **Visibility**: Public (required for free GitHub Pages)
   - **Do NOT** initialize with README, .gitignore, or license
5. Click **Create repository**

### Step 2: Update Configuration (if using custom repo name)

If your repository name is **NOT** `tech-revision-platform`, update `next.config.js`:

```javascript
const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  basePath: "/your-repo-name", // Uncomment and replace with your repo name
  assetPrefix: "/your-repo-name/", // Uncomment and replace with your repo name
};
```

### Step 3: Push to GitHub

Run these commands from PowerShell (already committed locally):

```bash
# Add remote repository (replace YOUR-USERNAME and REPO-NAME)
git remote add origin https://github.com/YOUR-USERNAME/REPO-NAME.git

# Push to GitHub
git push -u origin master
```

### Step 4: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** tab
3. In the left sidebar, click **Pages**
4. Under **Source**, select:
   - **Source**: GitHub Actions
5. Wait 2-3 minutes for the deployment to complete

### Step 5: Access Your Site

Your site will be available at:

- **Custom domain**: `https://YOUR-USERNAME.github.io/REPO-NAME/`
- **If repo name is `YOUR-USERNAME.github.io`**: `https://YOUR-USERNAME.github.io/`

## 🔄 Automatic Deployments

Every push to the `master` branch will automatically trigger a new deployment via GitHub Actions.

## 📁 Project Structure

```
tech-revision-platform/
├── app/                    # Next.js app router pages
├── components/             # React components
├── data/                   # Content for each technology
├── public/                 # Static assets
├── .github/workflows/      # GitHub Actions deployment
│   └── deploy.yml         # Deployment workflow
├── next.config.js         # Next.js configuration
└── package.json           # Project dependencies
```

## 🛠️ Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## 📚 Technologies Covered

- ✅ JavaScript (Debouncing, Throttling, Currying, etc.)
- ✅ ReactJS (Hooks, State Management, Patterns)
- ✅ Next.js (Routing, SSR, SSG, API routes)
- ✅ Golang (Syntax, Concurrency, Data structures)
- ✅ PostgreSQL (Queries, Joins, Optimization)
- ✅ Docker (Commands, Dockerfile, Compose, Networking)
- ✅ Kubernetes (Pods, Services, Deployments, kubectl)

## 🎯 Features

- 📝 Interview questions with detailed answers
- 💻 Practical exercises with solutions
- 🔄 MCQ quizzes with shuffled questions
- 🌓 Dark mode support
- 📱 Responsive design
- 🔍 Search and filter functionality

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use this project for your learning and interviews!
