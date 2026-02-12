export const dockerData = [
  {
    category: "Docker Basics",
    topics: [
      {
        id: "docker-basics",
        title: "Docker Core Concepts",
        category: "Docker Fundamentals",
        description:
          "Understanding containers, images, and the Docker architecture.",
        explanation:
          "Docker is a platform for developing, shipping, and running applications in containers. A container is a lightweight, standalone package that includes everything needed to run software: code, runtime, libraries, and system tools. Unlike virtual machines, containers share the host OS kernel, making them faster and more efficient.\n\nInterview focus:\n- Difference between containers and VMs\n- Docker architecture (daemon, client, registry)\n- Container lifecycle management\n- Image vs Container distinction\n- Port mapping and networking basics\n- Common troubleshooting patterns",
        code: `# Pull an image from Docker Hub
docker pull nginx:latest

# List local images
docker images

# Run a container
docker run -d -p 80:80 --name my-nginx nginx

# List running containers
docker ps

# List all containers (including stopped)
docker ps -a

# Stop a container
docker stop my-nginx

# Start a stopped container
docker start my-nginx

# Remove a container
docker rm my-nginx

# Remove an image
docker rmi nginx:latest`,
        example: `# Run container with environment variables
docker run -d -e POSTGRES_PASSWORD=secret postgres

# Run container with volume mount
docker run -d -v /host/path:/container/path nginx

# Execute command in running container
docker exec -it my-nginx bash

# View container logs
docker logs my-nginx
docker logs -f my-nginx  # Follow log output

# Inspect container details
docker inspect my-nginx`,
        useCase:
          "Containerizing applications, development environments, microservices",
        interviewQuestions: [
          {
            question:
              "What is the difference between a Docker image and a container?",
            answer:
              "An image is a read-only template with instructions for creating a container, like a class. A container is a runnable instance of an image, like an object. Images are stored, containers are executed.",
          },
          {
            question: "How does Docker differ from a virtual machine?",
            answer:
              "Containers share the host OS kernel and isolate at the process level, making them lighter and faster. VMs include a full OS copy with hypervisor overhead, providing stronger isolation but consuming more resources.",
          },
          {
            question: "What happens when you run docker pull?",
            answer:
              "Docker pulls image layers from the registry (Docker Hub by default), verifies checksums, and stores them locally. If layers already exist, they're reused.",
          },
          {
            question: "Explain docker run -d -p 8080:80 nginx",
            answer:
              "-d runs detached (background), -p maps host port 8080 to container port 80, nginx is the image name. Starts nginx container accessible at localhost:8080.",
          },
          {
            question: "How do you debug a failing container?",
            answer:
              "Use docker logs to view output, docker inspect for configuration, docker exec -it container sh to enter and investigate, check resource limits and network connectivity.",
          },
          {
            question: "What is Docker daemon?",
            answer:
              "The Docker daemon (dockerd) is a background service that manages Docker containers, images, networks, and volumes. The Docker client communicates with it via REST API.",
          },
          {
            question:
              "Why would docker ps show no containers but docker ps -a shows stopped ones?",
            answer:
              "docker ps shows only running containers. -a flag shows all containers including stopped, exited, and created but not started.",
          },
          {
            question: "What does docker rm vs docker rmi do?",
            answer:
              "docker rm removes containers (instances), docker rmi removes images (templates). Must remove containers using an image before removing the image.",
          },
          {
            question: "How do you restart a container automatically?",
            answer:
              "Use --restart flag: docker run --restart unless-stopped. Options: no, on-failure, always, unless-stopped. Useful for production services.",
          },
          {
            question: "What is the purpose of docker exec?",
            answer:
              "Executes a command inside a running container without starting a new container. Commonly used for debugging (docker exec -it container bash) or running maintenance tasks.",
          },
        ],
        exercises: [
          {
            type: "command",
            question:
              "Write command to run nginx detached on port 3000 named web-server",
            answer: "docker run -d -p 3000:80 --name web-server nginx",
          },
          {
            type: "command",
            question:
              "How to view last 50 lines of logs from container named api?",
            answer: "docker logs --tail 50 api",
          },
          {
            type: "debug",
            question:
              "Container exits immediately after docker run. How to investigate?",
            answer:
              "Use docker logs container-name to see error output. Check if CMD in Dockerfile is valid. Try docker run -it image sh to enter interactively.",
          },
          {
            type: "scenario",
            question:
              "You need to copy a config file into a running container. What command?",
            answer: "docker cp local-config.yml container-name:/app/config.yml",
          },
          {
            type: "explain",
            question: "What happens when you docker stop vs docker kill?",
            answer:
              "docker stop sends SIGTERM (graceful shutdown, allows cleanup), waits 10s, then SIGKILL. docker kill sends SIGKILL immediately (force termination).",
          },
          {
            type: "troubleshoot",
            question: "Error: port is already allocated. How to resolve?",
            answer:
              "Another container or process is using that port. Find using docker ps or netstat, stop conflicting container, or use different port mapping (-p 8081:80).",
          },
          {
            type: "command",
            question: "Remove all stopped containers in one command",
            answer: "docker container prune",
          },
          {
            type: "scenario",
            question: "How to run a container that auto-removes after exit?",
            answer:
              "docker run --rm image-name. Useful for temporary tasks, testing, CI/CD pipelines.",
          },
          {
            type: "explain",
            question: "What does docker inspect reveal?",
            answer:
              "Full container/image details in JSON: config, mounts, network settings, resource limits, environment variables, state, metadata.",
          },
          {
            type: "command",
            question:
              "Start an interactive Alpine container and remove after exit",
            answer: "docker run -it --rm alpine sh",
          },
        ],
        programExercises: [
          {
            type: "scenario",
            question:
              "Program 1: Pull postgres:15 image and verify it's downloaded",
            code: "docker pull postgres:15\ndocker images | grep postgres",
            output: "postgres   15   <image-id>   <time-ago>   <size>",
          },
          {
            type: "scenario",
            question:
              "Program 2: Run Redis container in background named cache on default port",
            code: "docker run -d --name cache redis:alpine\ndocker ps | grep cache",
            output:
              "CONTAINER ID   IMAGE         STATUS    PORTS      NAMES\n<id>          redis:alpine   Up       6379/tcp   cache",
          },
          {
            type: "scenario",
            question:
              "Program 3: Execute command inside running container to check Redis version",
            code: "docker exec cache redis-cli --version",
            output: "redis-cli 7.x.x",
          },
          {
            type: "scenario",
            question:
              "Program 4: Stop container, verify stopped, then remove it",
            code: "docker stop cache\ndocker ps -a | grep cache\ndocker rm cache",
            output: "Exited status shown, then cache removed",
          },
          {
            type: "scenario",
            question: "Program 5: Run nginx mapped to port 8080, verify access",
            code: "docker run -d -p 8080:80 --name web nginx\ncurl http://localhost:8080",
            output: "Welcome to nginx! HTML page returned",
          },
          {
            type: "scenario",
            question: "Program 6: Check container logs for last 10 lines",
            code: "docker logs --tail 10 web",
            output: "Last 10 log entries from nginx access/error logs",
          },
          {
            type: "scenario",
            question: "Program 7: Inspect container to find IP address",
            code: 'docker inspect web --format="{{.NetworkSettings.IPAddress}}"',
            output: "172.17.0.2 (or container's IP address)",
          },
        ],
      },
      {
        id: "dockerfile",
        title: "Dockerfile",
        category: "Image Building",
        description:
          "Create custom Docker images using Dockerfile instructions.",
        explanation:
          "A Dockerfile is a text document containing commands to assemble an image. Each instruction creates a layer in the image. Understanding layer caching, multi-stage builds, and instruction order is critical for creating efficient images.\n\nInterview focus:\n- Dockerfile instructions (FROM, RUN, COPY, ADD, ENV, etc.)\n- Layer caching and build optimization\n- Multi-stage builds for smaller images\n- ENTRYPOINT vs CMD\n- Best practices for security and size\n- .dockerignore usage",
        code: `# Dockerfile example
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy application code
COPY . .

# Expose port
EXPOSE 3000

# Set environment variable
ENV NODE_ENV=production

# Define the command to run the app
CMD ["node", "server.js"]`,
        example: `# Multi-stage build
FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY package*.json ./
RUN npm install --production
CMD ["node", "dist/server.js"]

# Python Dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["python", "app.py"]`,
        useCase: "Creating custom images, reproducible builds, CI/CD pipelines",
        interviewQuestions: [
          {
            question:
              "What is the difference between COPY and ADD in Dockerfile?",
            answer:
              "COPY simply copies files/directories from source to destination. ADD has additional features: can extract tar files and download files from URLs. Best practice is to use COPY unless you specifically need ADD's extra features.",
          },
          {
            question: "What is the difference between CMD and ENTRYPOINT?",
            answer:
              "CMD provides default arguments that can be overridden at runtime. ENTRYPOINT defines the executable and can't be easily overridden. Often used together: ENTRYPOINT for executable, CMD for default arguments. Example: ENTRYPOINT ['python'] CMD ['app.py']",
          },
          {
            question:
              "How does Docker layer caching work and why does it matter?",
            answer:
              "Docker caches each layer. If an instruction hasn't changed, it reuses cached layer. Order matters: put frequently changing instructions last. Example: COPY package.json before COPY . so dependency installs are cached even when code changes.",
          },
          {
            question: "What is a multi-stage build and why use it?",
            answer:
              "Multi-stage builds use multiple FROM statements in one Dockerfile. Build artifacts from earlier stages can be copied to later stages. Benefits: much smaller final images (no build tools), cleaner separation of concerns, better security (fewer attack vectors).",
          },
          {
            question: "How do you minimize Docker image size?",
            answer:
              "Use alpine base images, multi-stage builds, combine RUN commands with &&, remove cache files (apt-get clean, npm cache clean), use .dockerignore, avoid installing unnecessary packages, leverage layer caching properly.",
          },
          {
            question: "What is .dockerignore and why is it important?",
            answer:
              ".dockerignore excludes files from build context, similar to .gitignore. Reduces build context size, speeds up builds, prevents sensitive files from being copied. Include node_modules, .git, logs, test files.",
          },
          {
            question:
              "Explain the exec form vs shell form for CMD and ENTRYPOINT.",
            answer:
              "Exec form: CMD ['executable', 'param'] - runs directly, no shell processing, PID 1 is the app. Shell form: CMD executable param - runs in /bin/sh -c, enables variable substitution but app isn't PID 1. Exec form is preferred.",
          },
          {
            question: "What is the purpose of ARG instruction?",
            answer:
              "ARG defines build-time variables passed via --build-arg. Only available during build, not in running container. Use for versions, build configs. Example: ARG NODE_VERSION=18, then FROM node:${NODE_VERSION}.",
          },
          {
            question: "Why should you avoid running containers as root?",
            answer:
              "Security risk: if container is compromised, attacker has root privileges. Best practice: create non-root user with RUN useradd, then USER username. Limits damage from security vulnerabilities.",
          },
          {
            question: "How do you handle secrets in Dockerfile?",
            answer:
              "Never hardcode secrets. Use: Docker secrets (swarm), build-time secrets with --secret mount (BuildKit), ENV vars at runtime, external secret management (Vault). Don't use ARG for secrets (visible in image history).",
          },
        ],
        exercises: [
          {
            type: "write",
            question:
              "Write a Dockerfile for Node.js app with proper layer caching for npm install.",
            answer:
              "FROM node:18-alpine\nWORKDIR /app\nCOPY package*.json ./\nRUN npm install\nCOPY . .\nEXPOSE 3000\nCMD ['node', 'server.js']",
          },
          {
            type: "optimize",
            question:
              "How would you optimize a Dockerfile that runs apt-get update and apt-get install in separate RUN commands?",
            answer:
              "Combine into one RUN: RUN apt-get update && apt-get install -y package && rm -rf /var/lib/apt/lists/* - reduces layers, prevents stale cache, cleans up.",
          },
          {
            type: "debug",
            question:
              "Dockerfile builds successfully but container exits immediately. CMD is 'npm start'. What to check?",
            answer:
              "Check if npm start runs in foreground (not daemon). Verify package.json has start script. Check logs with docker logs. Ensure process doesn't exit. Try running interactively first.",
          },
          {
            type: "scenario",
            question:
              "You need different Dockerfiles for dev and prod. How to organize?",
            answer:
              "Create Dockerfile.dev and Dockerfile.prod. Use docker build -f Dockerfile.prod. Or use multi-stage with target: docker build --target production. Or docker-compose with different build contexts.",
          },
          {
            type: "security",
            question:
              "Review: FROM ubuntu, RUN apt-get install curl, USER root. What's wrong?",
            answer:
              "Ubuntu base is large (use alpine), missing apt-get update before install, running as root (create non-root user), no cleanup. Should minimize base image and use USER.",
          },
          {
            type: "write",
            question:
              "Create multi-stage Dockerfile for Go app: build in one stage, run in alpine.",
            answer:
              "FROM golang:1.21 AS builder\nWORKDIR /app\nCOPY . .\nRUN go build -o main .\n\nFROM alpine\nCOPY --from=builder /app/main .\nCMD ['./main']",
          },
          {
            type: "explain",
            question:
              "What happens if you have multiple FROM instructions without AS names?",
            answer:
              "Only the last stage is built by default. Previous stages are only built if referenced with --from. Each FROM starts a new build stage.",
          },
          {
            type: "scenario",
            question:
              "How to pass database URL at build time without exposing it in image?",
            answer:
              "Don't. Pass at runtime with -e or env_file. Build-time secrets stay in layers. Use ARG only for non-sensitive build configs. Use runtime ENV for secrets.",
          },
          {
            type: "optimize",
            question:
              "Image is 800MB. How to reduce size for Python Flask app?",
            answer:
              "Use python:3.11-slim or alpine instead of full python image, multi-stage build, remove pip cache with --no-cache-dir, use .dockerignore, remove test/dev dependencies.",
          },
          {
            type: "troubleshoot",
            question:
              "Build fails with 'COPY failed: stat /var/lib/docker/tmp/file: no such file'. Why?",
            answer:
              "File not in build context. Check if file exists relative to Dockerfile location. Verify .dockerignore isn't excluding it. Build context is the directory passed to docker build.",
          },
        ],
        programExercises: [
          {
            type: "program",
            question:
              "Program 1: Create Dockerfile for Python app with requirements.txt",
            code: "FROM python:3.11-slim\nWORKDIR /app\nCOPY requirements.txt .\nRUN pip install --no-cache-dir -r requirements.txt\nCOPY . .\nEXPOSE 5000\nCMD ['python', 'app.py']",
            output: "Successfully builds Python Flask/Django app image",
          },
          {
            type: "program",
            question:
              "Program 2: Multi-stage build for React app (build then serve with nginx)",
            code: "FROM node:18 AS build\nWORKDIR /app\nCOPY package*.json ./\nRUN npm install\nCOPY . .\nRUN npm run build\n\nFROM nginx:alpine\nCOPY --from=build /app/build /usr/share/nginx/html\nEXPOSE 80\nCMD ['nginx', '-g', 'daemon off;']",
            output:
              "Production-ready React app served by nginx, small image size",
          },
          {
            type: "program",
            question: "Program 3: Dockerfile with non-root user for security",
            code: "FROM node:18-alpine\nRUN addgroup -g 1001 appgroup && adduser -D -u 1001 -G appgroup appuser\nWORKDIR /app\nCOPY --chown=appuser:appgroup . .\nUSER appuser\nEXPOSE 3000\nCMD ['node', 'app.js']",
            output: "Container runs as non-root user appuser",
          },
          {
            type: "program",
            question:
              "Program 4: Dockerfile with ARG for configurable Node version",
            code: "ARG NODE_VERSION=18\nFROM node:${NODE_VERSION}-alpine\nWORKDIR /app\nCOPY package*.json ./\nRUN npm install\nCOPY . .\nCMD ['npm', 'start']\n\n# Build: docker build --build-arg NODE_VERSION=20 -t myapp .",
            output: "Builds with specified Node version from build arg",
          },
          {
            type: "program",
            question:
              "Program 5: Create .dockerignore to exclude node_modules, .git, tests",
            code: "node_modules\n.git\n.gitignore\n*.md\n.env\n.DS_Store\ntests\n__tests__\n*.test.js\ncoverage",
            output: "Build context excludes development files, faster builds",
          },
          {
            type: "program",
            question:
              "Program 6: Dockerfile combining multiple RUN commands efficiently",
            code: "FROM ubuntu:22.04\nRUN apt-get update && \\\n    apt-get install -y curl git && \\\n    rm -rf /var/lib/apt/lists/*\nWORKDIR /app",
            output: "Single layer with multiple commands, cleaned cache",
          },
          {
            type: "program",
            question:
              "Program 7: ENTRYPOINT and CMD together for flexible container",
            code: 'FROM python:3.11-slim\nWORKDIR /app\nCOPY . .\nENTRYPOINT ["python"]\nCMD ["app.py"]\n\n# Run: docker run image\n# Or: docker run image script.py',
            output: "Default runs app.py, can override with different script",
          },
        ],
      },
      {
        id: "docker-build",
        title: "Building Images",
        category: "Image Management",
        description: "Build Docker images from Dockerfile and manage them.",
        explanation:
          "Building Docker images is the process of creating runnable containers from Dockerfiles. Understanding build context, layer caching, tagging strategies, and registry operations is essential for efficient CI/CD pipelines.\n\nInterview focus:\n- Build context and optimization\n- Image tagging and versioning strategies\n- Registry operations (push/pull)\n- BuildKit features\n- Multi-platform builds\n- Build caching and optimization",
        command: `# Build image from Dockerfile
docker build -t myapp:1.0 .

# Build with build arguments
docker build --build-arg VERSION=1.0 -t myapp:1.0 .

# Build with specific Dockerfile
docker build -f Dockerfile.prod -t myapp:prod .

# Build without cache
docker build --no-cache -t myapp:1.0 .

# Tag an image
docker tag myapp:1.0 myapp:latest
docker tag myapp:1.0 myregistry.com/myapp:1.0

# Push image to registry
docker push myregistry.com/myapp:1.0

# Save image to tar file
docker save myapp:1.0 > myapp.tar

# Load image from tar file
docker load < myapp.tar`,
        example: `# Build arg in Dockerfile
ARG NODE_VERSION=18
FROM node:\${NODE_VERSION}
ARG APP_VERSION
ENV VERSION=\${APP_VERSION}

# Build with args
docker build --build-arg NODE_VERSION=20 --build-arg APP_VERSION=2.0 -t myapp .

# Multi-platform build
docker buildx build --platform linux/amd/64,linux/arm64 -t myapp .`,
        useCase: "Creating deployable images, versioning, registry management",
        interviewQuestions: [
          {
            question: "What is the Docker build context?",
            answer:
              "Build context is the set of files at the specified PATH or URL sent to Docker daemon. Everything in context is available to COPY/ADD. Large contexts slow builds. Use .dockerignore to exclude unnecessary files.",
          },
          {
            question:
              "How does Docker determine if it can use cache for a layer?",
            answer:
              "Docker checks if instruction and files haven't changed. For COPY/ADD, checks file checksums. For RUN, checks command string. If parent layers changed, cache is invalidated for all subsequent layers.",
          },
          {
            question:
              "What is the difference between docker save and docker export?",
            answer:
              "docker save saves images with all layers, tags, and history (use with docker load). docker export exports container filesystem as flat tar (loses history, use with docker import). Save for images, export for containers.",
          },
          {
            question: "Explain semantic versioning for Docker image tags.",
            answer:
              "Use major.minor.patch format (e.g., 1.2.3). Tag with specific version, update minor/major tags: myapp:1.2.3, myapp:1.2, myapp:1, myapp:latest. Allows users to pin to specific version or track updates.",
          },
          {
            question: "What is Docker BuildKit and its advantages?",
            answer:
              "BuildKit is the improved Docker build backend. Features: parallel builds, build secrets, SSH forwarding, better caching, build progress output. Enable with DOCKER_BUILDKIT=1 or in daemon config.",
          },
          {
            question: "How do you handle image tags in CI/CD?",
            answer:
              "Tag with commit SHA, branch name, semantic version. Example: myapp:sha-abc123, myapp:main, myapp:v1.2.3, myapp:latest. Use immutable tags (SHA) for production, mutable (latest) for dev.",
          },
          {
            question:
              "What is a Docker registry and how does authentication work?",
            answer:
              "Registry stores Docker images (Docker Hub, ECR, GCR). docker login stores credentials. docker push uploads images, docker pull downloads. Private registries require authentication via login or config.json.",
          },
          {
            question: "How do you build images for multiple architectures?",
            answer:
              "Use docker buildx with --platform flag: docker buildx build --platform linux/amd64,linux/arm64,linux/arm/v7 -t myapp --push. Requires BuildKit and buildx. Creates manifest list.",
          },
          {
            question: "What is the purpose of docker build --target?",
            answer:
              "In multi-stage builds, --target stops at specific stage. Example: docker build --target development for dev image with debug tools, --target production for optimized prod image. Same Dockerfile, different outputs.",
          },
          {
            question: "How do you inspect image layers and history?",
            answer:
              "Use docker history imagename to see layers, commands, and sizes. Use docker inspect for detailed JSON metadata. Tools like dive can analyze and optimize layer sizes interactively.",
          },
        ],
        exercises: [
          {
            type: "command",
            question:
              "Build image tagged as myapp:v2.1.0 from current directory",
            answer: "docker build -t myapp:v2.1.0 .",
          },
          {
            type: "command",
            question:
              "Build without cache using Dockerfile.production, tag as myapp:prod",
            answer:
              "docker build --no-cache -f Dockerfile.production -t myapp:prod .",
          },
          {
            type: "scenario",
            question:
              "You need to pass DB_VERSION=postgres:15 at build time. How?",
            answer:
              "Add ARG DB_VERSION in Dockerfile. Build with: docker build --build-arg DB_VERSION=postgres:15 -t myapp .",
          },
          {
            type: "command",
            question:
              "Tag existing image localhost:5000/myapp:1.0 to push to Docker Hub as username/myapp:latest",
            answer: "docker tag localhost:5000/myapp:1.0 username/myapp:latest",
          },
          {
            type: "troubleshoot",
            question:
              "Build is very slow, sending 2GB context. How to diagnose and fix?",
            answer:
              "Check build context size with docker build output. Add .dockerignore to exclude node_modules, .git, logs, test files. Only include necessary files.",
          },
          {
            type: "scenario",
            question:
              "How to save image to file for offline transfer to another machine?",
            answer:
              "docker save myapp:1.0 -o myapp.tar (or > myapp.tar). Transfer file. Load with: docker load -i myapp.tar (or < myapp.tar).",
          },
          {
            type: "explain",
            question:
              "What's the benefit of tagging with both specific version and latest?",
            answer:
              "Specific version for reproducibility and rollback. Latest for convenience and dev environments. Tag both: docker tag myapp:1.2.3 myapp:latest.",
          },
          {
            type: "command",
            question:
              "View detailed build history and layer sizes for nginx image",
            answer: "docker history nginx",
          },
          {
            type: "scenario",
            question:
              "Build only the 'builder' stage from multi-stage Dockerfile",
            answer: "docker build --target builder -t myapp-builder .",
          },
          {
            type: "security",
            question:
              "Why shouldn't you use docker commit for production images?",
            answer:
              "Not reproducible, no version control, includes all container changes (may include secrets/temp files), can't leverage caching. Always use Dockerfile.",
          },
        ],
        programExercises: [
          {
            type: "program",
            question:
              "Program 1: Build image with version tag and latest tag in one command",
            code: "docker build -t myapp:1.0.0 -t myapp:latest .\n# Or build once then tag:\ndocker build -t myapp:1.0.0 .\ndocker tag myapp:1.0.0 myapp:latest",
            output: "Image tagged with both specific version and latest",
          },
          {
            type: "program",
            question:
              "Program 2: Build with build arg, verify ENV is set in container",
            code: "docker build --build-arg APP_ENV=production -t myapp .\ndocker run --rm myapp env | grep APP_ENV",
            output: "Shows APP_ENV=production in container environment",
          },
          {
            type: "program",
            question:
              "Program 3: Save image to tar, remove image, reload from tar",
            code: "docker save myapp:1.0 -o myapp.tar\ndocker rmi myapp:1.0\ndocker load -i myapp.tar\ndocker images | grep myapp",
            output: "Image successfully restored from tar file",
          },
          {
            type: "program",
            question:
              "Program 4: View image history to identify largest layers",
            code: 'docker history myapp --format "table {{.Size}}\\t{{.CreatedBy}}" --no-trunc',
            output: "Shows layer sizes and commands that created them",
          },
          {
            type: "program",
            question:
              "Program 5: Build without cache, compare build time with cached build",
            code: "time docker build --no-cache -t myapp:nocache .\ntime docker build -t myapp:cached .",
            output:
              "Shows significant time difference, cached build much faster",
          },
          {
            type: "program",
            question:
              "Program 6: Tag image for different registries (Docker Hub and private)",
            code: "docker tag myapp:1.0 username/myapp:1.0\ndocker tag myapp:1.0 registry.company.com/myapp:1.0\ndocker images | grep myapp",
            output: "Same image ID with multiple registry tags",
          },
          {
            type: "program",
            question:
              "Program 7: Build target stage from multi-stage Dockerfile",
            code: "docker build --target development -t myapp:dev .\ndocker build --target production -t myapp:prod .\ndocker images | grep myapp",
            output:
              "Two different images from same Dockerfile, different stages",
          },
        ],
      },
    ],
  },
  {
    category: "Docker Networking & Volumes",
    topics: [
      {
        id: "networks",
        title: "Docker Networks",
        category: "Networking",
        description:
          "Container networking for communication between containers.",
        explanation:
          "Docker networking enables containers to communicate with each other and external systems. Understanding network drivers (bridge, host, overlay, macvlan), DNS resolution, and port mapping is crucial for building distributed applications.\n\nInterview focus:\n- Network drivers and when to use each\n- Container-to-container communication\n- Port mapping and exposure\n- DNS and service discovery\n- Network isolation and security\n- Overlay networks for Swarm",
        command: `# List networks
docker network ls

# Create network
docker network create my-network

# Create bridge network
docker network create --driver bridge my-bridge

# Inspect network
docker network inspect my-network

# Connect container to network
docker network connect my-network container-name

# Disconnect container from network
docker network disconnect my-network container-name

# Run container on specific network
docker run -d --network my-network --name web nginx

# Remove network
docker network rm my-network`,
        example: `# Create custom bridge network
docker network create --subnet=172.18.0.0/16 my-custom-network

# Run containers on same network
docker run -d --network my-network --name db postgres
docker run -d --network my-network --name web -p 80:80 nginx

# Containers can communicate using names
# From 'web' container: curl http://db:5432

# Host network (share host's network)
docker run -d --network host nginx`,
        useCase:
          "Microservices communication, container isolation, service discovery",
        interviewQuestions: [
          {
            question: "What are the different Docker network drivers?",
            answer:
              "Bridge (default, isolated network), host (share host network), overlay (multi-host Swarm), macvlan (assign MAC addresses), none (no networking). Each suits different use cases.",
          },
          {
            question:
              "How do containers on the same custom bridge network communicate?",
            answer:
              "By container name via Docker's embedded DNS server. Example: curl http://container-name:port. Default bridge requires --link or IP addresses. Custom bridge is recommended.",
          },
          {
            question: "What is the difference between -p and --expose?",
            answer:
              "-p publishes port to host (accessible externally): -p 8080:80. --expose only documents port (doesn't publish). EXPOSE in Dockerfile also just documents, needs -P or -p to publish.",
          },
          {
            question: "When would you use host network mode?",
            answer:
              "For maximum performance (no network overhead), when container needs host network stack, or binding to many ports. Drawback: loses network isolation, port conflicts possible.",
          },
          {
            question: "How does Docker DNS work?",
            answer:
              "Docker runs embedded DNS server (127.0.0.11). Containers on custom networks can resolve each other by name. Maps container names to IP addresses automatically. Default bridge doesn't have DNS (needs --link).",
          },
          {
            question: "What is an overlay network?",
            answer:
              "Overlay networks span multiple Docker hosts in Swarm mode. Enables container communication across hosts. Uses VXLAN tunneling. Required for multi-host deployments and orchestration.",
          },
          {
            question: "How do you isolate containers from each other?",
            answer:
              "Put them on different networks. Containers can only communicate if on same network. Use network segmentation for microservices. Connect containers to multiple networks if needed.",
          },
          {
            question:
              "What happens to container networking when you docker stop?",
            answer:
              "Container keeps its IP and network connections but stops responding. Network interface stays registered. On restart with docker start, same IP is typically reassigned (not guaranteed).",
          },
          {
            question:
              "How do you connect a running container to a new network?",
            answer:
              "Use docker network connect: docker network connect my-network container-name. Container can be on multiple networks. Each network assigns separate IP address.",
          },
          {
            question: "What is the default Docker bridge network?",
            answer:
              "docker0 bridge, created automatically. Containers use it by default. Limited features: no DNS, requires --link. Best practice: create custom bridge networks with docker network create.",
          },
        ],
        exercises: [
          {
            type: "command",
            question: "Create custom bridge network named app-network",
            answer: "docker network create app-network",
          },
          {
            type: "scenario",
            question:
              "Run nginx and postgres on same network so nginx can connect to postgres by name",
            answer:
              "docker network create mynet\ndocker run -d --network mynet --name db postgres\ndocker run -d --network mynet --name web nginx\n# Web can access: http://db:5432",
          },
          {
            type: "command",
            question: "Inspect network to see connected containers and subnet",
            answer: "docker network inspect my-network",
          },
          {
            type: "troubleshoot",
            question: "Container can't resolve other container by name. Why?",
            answer:
              "Likely on default bridge network (no DNS). Create custom bridge network and put both containers on it, or use --link (deprecated).",
          },
          {
            type: "command",
            question:
              "Connect running container named api to network named backend",
            answer: "docker network connect backend api",
          },
          {
            type: "explain",
            question: "What is the output of docker network ls?",
            answer:
              "Lists all networks: NETWORK ID, NAME, DRIVER, SCOPE. Shows bridge, host, none by default, plus any custom networks.",
          },
          {
            type: "scenario",
            question:
              "You need container to access host services on localhost. How?",
            answer:
              "Use host.docker.internal (Mac/Windows) or host network mode (--network host on Linux). Or use host IP address.",
          },
          {
            type: "security",
            question: "Why is network isolation important?",
            answer:
              "Prevents unauthorized access between containers. Apply least privilege: only connect containers that need to communicate. Separate frontend/backend/database networks.",
          },
          {
            type: "command",
            question:
              "Remove network (but it fails if containers are connected)",
            answer:
              "docker network rm my-network\n# If fails: disconnect containers first or docker network rm -f",
          },
          {
            type: "scenario",
            question:
              "Create network with custom subnet 10.0.0.0/24 and gateway 10.0.0.1",
            answer:
              "docker network create --subnet=10.0.0.0/24 --gateway=10.0.0.1 my-network",
          },
        ],
        programExercises: [
          {
            type: "program",
            question:
              "Program 1: Create network, run two containers, verify they can ping each other by name",
            code: "docker network create testnet\ndocker run -d --network testnet --name c1 alpine sleep 3600\ndocker run -d --network testnet --name c2 alpine sleep 3600\ndocker exec c1 ping -c 2 c2",
            output: "Successful ping from c1 to c2 using container name",
          },
          {
            type: "program",
            question:
              "Program 2: Inspect network to find container IP addresses",
            code: 'docker network inspect testnet --format="{{json .Containers}}" | jq',
            output: "JSON showing containers with their IPs on the network",
          },
          {
            type: "program",
            question:
              "Program 3: Run container on host network, verify it uses host IP",
            code: "docker run --rm --network host alpine ip addr show\n# Compare with host:\nip addr show",
            output: "Container shows same network interfaces as host",
          },
          {
            type: "program",
            question:
              "Program 4: Connect existing container to additional network",
            code: "docker network create net1\ndocker network create net2\ndocker run -d --network net1 --name multi alpine sleep 3600\ndocker network connect net2 multi\ndocker inspect multi --format='{{range .NetworkSettings.Networks}}{{.IPAddress}} {{end}}'",
            output: "Container has IP address on both networks",
          },
          {
            type: "program",
            question:
              "Program 5: Port mapping - map container port 80 to host port 8080",
            code: "docker run -d -p 8080:80 --name web nginx\ncurl http://localhost:8080",
            output: "Nginx welcome page accessible on host port 8080",
          },
          {
            type: "program",
            question:
              "Program 6: Test network isolation - containers on different networks can't communicate",
            code: "docker network create net-a\ndocker network create net-b\ndocker run -d --network net-a --name container-a alpine sleep 3600\ndocker run -d --network net-b --name container-b alpine sleep 3600\ndocker exec container-a ping -c 2 container-b",
            output: "Ping fails - containers isolated on separate networks",
          },
          {
            type: "program",
            question:
              "Program 7: Create network with custom subnet and run container in it",
            code: "docker network create --subnet=192.168.100.0/24 custom-subnet\ndocker run -d --network custom-subnet --ip 192.168.100.10 --name static-ip nginx\ndocker inspect static-ip --format='{{.NetworkSettings.Networks.custom-subnet.IPAddress}}'",
            output: "Container assigned static IP 192.168.100.10",
          },
        ],
      },
      {
        id: "volumes",
        title: "Docker Volumes",
        category: "Storage",
        description: "Persistent data storage for containers.",
        explanation:
          "Docker volumes provide persistent storage that exists independently of container lifecycles. Understanding volumes vs bind mounts, volume drivers, and data management patterns is essential for stateful applications.\n\nInterview focus:\n- Volumes vs bind mounts vs tmpfs\n- Named volumes vs anonymous volumes\n- Volume drivers and plugins\n- Data persistence strategies\n- Backup and restore patterns\n- Volume sharing between containers",
        command: `# Create volume
docker volume create my-data

# List volumes
docker volume ls

# Inspect volume
docker volume inspect my-data

# Run container with volume
docker run -d -v my-data:/app/data postgres

# Run with bind mount (host directory)
docker run -d -v /host/path:/container/path nginx

# Run with read-only volume
docker run -d -v my-data:/app/data:ro nginx

# Remove volume
docker volume rm my-data

# Remove all unused volumes
docker volume prune`,
        example: `# Named volume
docker run -d \\
  -v postgres-data:/var/lib/postgresql/data \\
  --name db \\
  postgres

# Bind mount for development
docker run -d \\
  -v $(pwd):/app \\
  -v /app/node_modules \\
  --name dev-server \\
  node:18

# Anonymous volume
docker run -d -v /app/data nginx

# Volume from another container
docker run -d --volumes-from container1 container2`,
        useCase: "Data persistence, sharing data between containers, backups",
        interviewQuestions: [
          {
            question: "What is the difference between volumes and bind mounts?",
            answer:
              "Volumes are managed by Docker (stored in /var/lib/docker/volumes), work cross-platform, can use volume drivers. Bind mounts map any host path, depend on host directory structure. Volumes are recommended for production.",
          },
          {
            question: "When would you use a bind mount instead of a volume?",
            answer:
              "Development (live code reload), sharing host config files, accessing host logs, when you need specific host path. Example: -v $(pwd):/app for live development with hot reload.",
          },
          {
            question: "What is an anonymous volume and when is it created?",
            answer:
              "Volume without a name, created with VOLUME in Dockerfile or -v /container/path. Docker generates random name. Hard to manage, can't easily reuse. Named volumes are preferred.",
          },
          {
            question: "How do you backup data from a Docker volume?",
            answer:
              "Run temporary container with volume mounted and backup destination: docker run --rm -v mydata:/data -v $(pwd):/backup alpine tar czf /backup/backup.tar.gz /data",
          },
          {
            question: "What happens to volume data when container is removed?",
            answer:
              "Volume persists even after container deletion. Data is preserved. Use docker volume rm to delete volume, or docker-compose down -v to remove volumes with containers.",
          },
          {
            question: "What is tmpfs mount and when to use it?",
            answer:
              "Temporary filesystem stored in host memory (RAM), not persisted. Use for sensitive data (never touches disk) or temp files. Example: --mount type=tmpfs,destination=/app/cache",
          },
          {
            question: "How can multiple containers share the same volume?",
            answer:
              "Mount same named volume in multiple containers: docker run -v shared-data:/data. All containers can read/write. Useful for shared config, logging, or data processing pipelines.",
          },
          {
            question: "What is the ro flag in volume mounts?",
            answer:
              "Read-only mount: -v mydata:/data:ro. Container can read but not write. Security best practice for config files, code in production, or data that shouldn't be modified.",
          },
          {
            question: "What is --volumes-from and when to use it?",
            answer:
              "Mounts all volumes from another container: docker run --volumes-from container1 image. Useful for data containers pattern, backup containers, or sharing volumes without knowing volume names.",
          },
          {
            question:
              "How do volume drivers extend Docker storage capabilities?",
            answer:
              "Volume drivers enable remote storage (NFS, cloud storage), encryption, replication. Examples: local (default), nfs, rexray for EBS/EFS. Specified with --driver or VOLUME_DRIVER in compose.",
          },
        ],
        exercises: [
          {
            type: "command",
            question: "Create named volume called postgres-data",
            answer: "docker volume create postgres-data",
          },
          {
            type: "command",
            question:
              "Run postgres container with named volume for data persistence",
            answer:
              "docker run -d -v postgres-data:/var/lib/postgresql/data --name db postgres",
          },
          {
            type: "scenario",
            question:
              "Mount current directory as bind mount for live development",
            answer: "docker run -d -v $(pwd):/app --name dev node:18",
          },
          {
            type: "command",
            question: "Inspect volume to see mount point and options",
            answer: "docker volume inspect postgres-data",
          },
          {
            type: "scenario",
            question:
              "How to prevent container from writing to mounted volume?",
            answer:
              "Add :ro flag: docker run -v myvolume:/data:ro image. Makes mount read-only.",
          },
          {
            type: "troubleshoot",
            question: "Volume data disappeared after docker-compose down. Why?",
            answer:
              "Used docker-compose down -v which removes volumes. Use docker-compose down (without -v) to preserve volumes.",
          },
          {
            type: "backup",
            question: "Backup volume named appdata to tar file",
            answer:
              "docker run --rm -v appdata:/data -v $(pwd):/backup alpine tar czf /backup/appdata-backup.tar.gz -C /data .",
          },
          {
            type: "restore",
            question: "Restore backup.tar.gz to volume",
            answer:
              "docker run --rm -v appdata:/data -v $(pwd):/backup alpine tar xzf /backup/backup.tar.gz -C /data",
          },
          {
            type: "command",
            question: "Remove all unused volumes to free space",
            answer: "docker volume prune",
          },
          {
            type: "scenario",
            question:
              "Share volume between nginx and app container for static files",
            answer:
              "docker run -v static-files:/static app\ndocker run -v static-files:/usr/share/nginx/html:ro nginx",
          },
        ],
        programExercises: [
          {
            type: "program",
            question:
              "Program 1: Create volume, write file from container, verify persistence",
            code: "docker volume create testdata\ndocker run --rm -v testdata:/data alpine sh -c 'echo Hello > /data/test.txt'\ndocker run --rm -v testdata:/data alpine cat /data/test.txt",
            output: "Hello - data persists across different containers",
          },
          {
            type: "program",
            question:
              "Program 2: Bind mount local directory, modify file from container",
            code: "mkdir -p testdir\ndocker run --rm -v $(pwd)/testdir:/work alpine sh -c 'echo mounted > /work/file.txt'\ncat testdir/file.txt",
            output: "File created in container appears in host directory",
          },
          {
            type: "program",
            question: "Program 3: Test read-only volume - write should fail",
            code: "docker volume create readonly-test\ndocker run --rm -v readonly-test:/data:ro alpine sh -c 'echo test > /data/file.txt'",
            output: "Error: Read-only file system - write operation fails",
          },
          {
            type: "program",
            question: "Program 4: Share volume between two containers",
            code: "docker volume create shared\ndocker run -d --name writer -v shared:/data alpine sh -c 'while true; do date > /data/time.txt; sleep 2; done'\ndocker run --rm -v shared:/data alpine watch -n 1 cat /data/time.txt",
            output: "Second container reads data written by first container",
          },
          {
            type: "program",
            question: "Program 5: Backup volume to tar, remove volume, restore",
            code: "docker run --rm -v mydata:/data -v $(pwd):/backup alpine tar czf /backup/data.tar.gz /data\ndocker volume rm mydata\ndocker volume create mydata\ndocker run --rm -v mydata:/data -v $(pwd):/backup alpine tar xzf /backup/data.tar.gz -C /",
            output: "Data successfully backed up and restored",
          },
          {
            type: "program",
            question:
              "Program 6: Use --volumes-from to access another container's volumes",
            code: "docker run -d --name data-container -v /data alpine sleep 3600\ndocker run --rm --volumes-from data-container alpine ls /data",
            output: "Second container accesses first container's volume mount",
          },
          {
            type: "program",
            question: "Program 7: Inspect volume to find host mount point",
            code: 'docker volume create inspect-test\ndocker volume inspect inspect-test --format="{{.Mountpoint}}"',
            output:
              "/var/lib/docker/volumes/inspect-test/_data (Linux) or similar",
          },
        ],
      },
    ],
  },
  {
    category: "Docker Compose",
    topics: [
      {
        id: "docker-compose",
        title: "Docker Compose Basics",
        category: "Orchestration",
        description:
          "Define and run multi-container applications with YAML configuration.",
        explanation:
          "Docker Compose is a tool for defining and running multi-container applications using YAML. It simplifies development workflows by managing multiple services, networks, and volumes together. Understanding compose file syntax, service orchestration, and lifecycle management is key.\n\nInterview focus:\n- docker-compose.yml syntax and structure\n- Service dependencies and startup order\n- Environment variables and configs\n- Networking and volume management\n- Development vs production setups\n- Scaling services",
        code: `# docker-compose.yml
version: '3.8'

services:
  web:
    image: nginx:latest
    ports:
      - "80:80"
    volumes:
      - ./html:/usr/share/nginx/html
    networks:
      - app-network
  
  db:
    image: postgres:15
    environment:
      POSTGRES_PASSWORD: secret
      POSTGRES_DB: myapp
    volumes:
      - db-data:/var/lib/postgresql/data
    networks:
      - app-network

networks:
  app-network:
    driver: bridge

volumes:
  db-data:`,
        command: `# Start services
docker-compose up

# Start in detached mode
docker-compose up -d

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# View logs
docker-compose logs
docker-compose logs -f web

# List services
docker-compose ps

# Execute command in service
docker-compose exec web bash

# Rebuild services
docker-compose up --build`,
        example: `# Full stack example
version: '3.8'

services:
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend
    environment:
      - API_URL=http://backend:5000
  
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    depends_on:
      - db
      - redis
    env_file:
      - .env
  
  db:
    image: postgres:15
    volumes:
      - db-data:/var/lib/postgresql/data
    environment:
      POSTGRES_PASSWORD: \${DB_PASSWORD}
  
  redis:
    image: redis:alpine
    ports:
      - "6379:6379"

volumes:
  db-data:`,
        useCase:
          "Local development, testing, defining multi-container applications",
        interviewQuestions: [
          {
            question: "What is Docker Compose and when should you use it?",
            answer:
              "Docker Compose is a tool for defining multi-container applications using YAML. Use it for local development, testing, simple deployments. For production: consider Kubernetes, Docker Swarm, or ECS for better scaling and orchestration.",
          },
          {
            question:
              "What is the purpose of depends_on in docker-compose.yml?",
            answer:
              "depends_on controls startup order. Database starts before app. Warning: only waits for container to start, not for service to be ready. Use healthchecks or wait-for scripts for true readiness.",
          },
          {
            question: "How do environment variables work in Compose?",
            answer:
              "Three ways: environment key (hardcoded), env_file (.env file), shell substitution (\${VAR}). Priority: shell > env_file > environment. Use .env for local dev, pass vars in production.",
          },
          {
            question:
              "What is the difference between docker-compose up and docker-compose start?",
            answer:
              "up creates and starts containers, networks, volumes. start only starts existing stopped containers. up is typically used, start for restarting after docker-compose stop.",
          },
          {
            question: "How do you scale services in Docker Compose?",
            answer:
              "docker-compose up --scale web=3 starts 3 web instances. Remove port mappings (conflicts) or use range (8000-8002:80). Better for stateless services. Load balancer needed for traffic distribution.",
          },
          {
            question:
              "What is the difference between docker-compose down and docker-compose down -v?",
            answer:
              "down stops and removes containers, networks. down -v also removes named volumes, deleting all data. Use -v carefully in development, never in production without backups.",
          },
          {
            question:
              "How do you override compose file for different environments?",
            answer:
              "Use multiple files: docker-compose.yml (base), docker-compose.override.yml (auto-merged), docker-compose.prod.yml (docker-compose -f base.yml -f prod.yml up). Override ports, volumes, env vars.",
          },
          {
            question: "What is the build context in docker-compose?",
            answer:
              "build: ./path sets build context. Can specify Dockerfile with dockerfile option, build args with args. Context determines COPY/ADD source paths. Keep context small with .dockerignore.",
          },
          {
            question: "How does networking work in Docker Compose?",
            answer:
              "Compose creates default network for all services. Services communicate by service name (DNS). Can define custom networks for isolation. Example: frontend network for web, backend for db.",
          },
          {
            question: "What are healthchecks in Compose and why use them?",
            answer:
              "healthcheck tests service health (e.g., HTTP endpoint). Used with depends_on in v3.9+ for true dependency management. Service waits until dependency is healthy before starting. Critical for databases.",
          },
        ],
        exercises: [
          {
            type: "write",
            question:
              "Write docker-compose.yml for nginx and postgres with network",
            answer:
              "version: '3.8'\nservices:\n  web:\n    image: nginx\n    ports: ['80:80']\n    networks: [app]\n  db:\n    image: postgres\n    networks: [app]\nnetworks:\n  app:",
          },
          {
            type: "command",
            question:
              "Start all services defined in docker-compose.yml in background",
            answer: "docker-compose up -d",
          },
          {
            type: "command",
            question: "View logs for service named 'api' in real-time",
            answer: "docker-compose logs -f api",
          },
          {
            type: "scenario",
            question: "App depends on database. How to ensure DB starts first?",
            answer:
              "Use depends_on: services:\n  app:\n    depends_on:\n      - db\n  db:\n    image: postgres\n\nBetter: add healthcheck to db and use condition: service_healthy",
          },
          {
            type: "command",
            question: "Execute bash inside running service named 'backend'",
            answer: "docker-compose exec backend bash",
          },
          {
            type: "troubleshoot",
            question:
              "docker-compose up fails with 'port already allocated'. How to fix?",
            answer:
              "Port conflict. Check with docker ps, netstat, or lsof. Stop conflicting container or change port mapping in compose file: ports: ['8080:80'].",
          },
          {
            type: "command",
            question: "Stop and remove all containers, networks (keep volumes)",
            answer: "docker-compose down",
          },
          {
            type: "scenario",
            question: "How to rebuild service after Dockerfile changes?",
            answer:
              "docker-compose up --build or docker-compose build service-name then docker-compose up",
          },
          {
            type: "write",
            question:
              "Add volume for postgres data persistence in compose file",
            answer:
              "services:\n  db:\n    image: postgres\n    volumes:\n      - db-data:/var/lib/postgresql/data\nvolumes:\n  db-data:",
          },
          {
            type: "command",
            question: "Scale web service to run 3 instances",
            answer: "docker-compose up --scale web=3",
          },
        ],
        programExercises: [
          {
            type: "program",
            question:
              "Program 1: Create compose file for Node app with Redis cache",
            code: 'version: "3.8"\nservices:\n  app:\n    build: .\n    ports:\n      - "3000:3000"\n    depends_on:\n      - redis\n    environment:\n      REDIS_URL: redis://redis:6379\n  redis:\n    image: redis:alpine',
            output:
              "App starts after Redis, can connect to redis via hostname 'redis'",
          },
          {
            type: "program",
            question:
              "Program 2: Full-stack app - frontend, backend, database with networks",
            code: 'version: "3.8"\nservices:\n  frontend:\n    build: ./client\n    ports: ["3000:3000"]\n    networks: [frontend]\n  backend:\n    build: ./server\n    ports: ["5000:5000"]\n    networks: [frontend, backend]\n  db:\n    image: postgres\n    networks: [backend]\nnetworks:\n  frontend:\n  backend:',
            output:
              "Frontend can't reach DB (isolated), backend can reach both",
          },
          {
            type: "program",
            question: "Program 3: Use env_file for environment variables",
            code: "# .env file:\nDB_USER=admin\nDB_PASS=secret\n\n# docker-compose.yml:\nservices:\n  db:\n    image: postgres\n    env_file: .env\n\n# docker-compose up -d\n# docker-compose exec db env | grep DB_",
            output:
              "Environment variables loaded from .env file into container",
          },
          {
            type: "program",
            question: "Program 4: Override compose file for production",
            code: '# docker-compose.yml (base):\nservices:\n  app:\n    build: .\n    ports: ["3000:3000"]\n\n# docker-compose.prod.yml:\nservices:\n  app:\n    restart: always\n    environment:\n      NODE_ENV: production\n\n# Run: docker-compose -f docker-compose.yml -f docker-compose.prod.yml up',
            output: "Production-specific configs applied (restart policy, env)",
          },
          {
            type: "program",
            question: "Program 5: Use healthcheck to ensure database is ready",
            code: 'version: "3.8"\nservices:\n  app:\n    build: .\n    depends_on:\n      db:\n        condition: service_healthy\n  db:\n    image: postgres\n    healthcheck:\n      test: ["CMD", "pg_isready", "-U", "postgres"]\n      interval: 5s\n      timeout: 3s\n      retries: 5',
            output: "App waits for DB healthcheck to pass before starting",
          },
          {
            type: "program",
            question:
              "Program 6: Mount local code for development with hot reload",
            code: 'version: "3.8"\nservices:\n  app:\n    build: .\n    ports: ["3000:3000"]\n    volumes:\n      - ./src:/app/src\n      - /app/node_modules\n    environment:\n      NODE_ENV: development',
            output: "Code changes on host immediately reflected in container",
          },
          {
            type: "program",
            question:
              "Program 7: Scale web service and verify multiple instances",
            code: "docker-compose up -d --scale web=3\ndocker-compose ps",
            output: "Shows 3 instances of web service running",
          },
        ],
      },
      {
        id: "docker-swarm",
        title: "Docker Commands Reference",
        category: "Advanced Commands",
        description:
          "Essential Docker commands for container management and troubleshooting.",
        explanation:
          "Mastering Docker CLI commands is essential for effective container management, debugging, and optimization. This includes container lifecycle, resource management, monitoring, and system maintenance commands that are frequently asked in interviews.\n\nInterview focus:\n- Container lifecycle commands\n- Resource monitoring and limits\n- System maintenance and cleanup\n- Debugging and troubleshooting\n- Image management and optimization\n- Performance tuning",
        command: `# Container management
docker run -it --rm alpine sh  # Interactive, remove after exit
docker attach container-name   # Attach to running container
docker cp file.txt container:/path  # Copy files
docker export container > backup.tar  # Export container

# System commands
docker system df  # Show disk usage
docker system prune  # Remove unused data
docker system prune -a  # Remove all unused images

# Image management
docker history image-name  # Show image layers
docker commit container new-image  # Create image from container

# Container stats and monitoring
docker stats  # Live resource usage
docker top container-name  # Running processes
docker port container-name  # Port mappings
docker diff container-name # File system changes`,
        example: `# Clean up everything
docker system prune -a --volumes

# Run with resource limits
docker run -d \\
  --memory="512m" \\
  --cpus="1.5" \\
  --name limited-container \\
  nginx

# Health check in Dockerfile
HEALTHCHECK --interval=30s --timeout=3s \\
  CMD curl -f http://localhost/ || exit 1

# Update container restart policy
docker update --restart unless-stopped container-name

# View real-time events
docker events

# Format output
docker ps --format "table {{.Names}}\\t{{.Status}}\\t{{.Ports}}"`,
        useCase:
          "Troubleshooting, monitoring, resource management, maintenance",
        interviewQuestions: [
          {
            question:
              "What is the difference between docker attach and docker exec?",
            answer:
              "docker attach connects to container's main process (PID 1), shares stdin/stdout, exiting kills container. docker exec runs new process in container, can run commands without affecting main process. Use exec for debugging.",
          },
          {
            question: "How do you limit container memory and CPU usage?",
            answer:
              "Use --memory and --cpus flags: docker run --memory='512m' --cpus='1.5' image. Also: --memory-swap, --memory-reservation, --cpu-shares. Monitor with docker stats. Prevents resource exhaustion.",
          },
          {
            question: "What does docker system prune do and when to use it?",
            answer:
              "Removes unused data: stopped containers, dangling images, unused networks. docker system prune -a removes all unused images (not just dangling). Use regularly to free disk space, especially in CI/CD.",
          },
          {
            question: "How do you copy files between host and container?",
            answer:
              "docker cp: host to container: docker cp file.txt container:/path, container to host: docker cp container:/path/file.txt ./. Works with running or stopped containers. No volume needed.",
          },
          {
            question: "What is docker diff and what does it show?",
            answer:
              "Shows filesystem changes in container vs image. A=added, D=deleted, C=changed files. Useful for debugging, understanding container state, or deciding what to include in new image.",
          },
          {
            question:
              "How do you view real-time resource usage for all containers?",
            answer:
              "docker stats shows live CPU, memory, network I/O, disk I/O for all running containers. docker stats container-name for specific container. Press Ctrl+C to exit. Useful for performance monitoring.",
          },
          {
            question:
              "What is docker commit and why is it generally discouraged?",
            answer:
              "Creates new image from container's changes. Discouraged because: not reproducible, no version control, can include secrets/temp files, can't leverage caching. Use Dockerfile instead for production.",
          },
          {
            question: "How do you view what ports a container is listening on?",
            answer:
              "docker port container-name shows port mappings. docker inspect container --format='{{.NetworkSettings.Ports}}' for detailed info in JSON. Lists container ports and their host mappings.",
          },
          {
            question: "What does docker update do and what can you update?",
            answer:
              "Updates container configuration without recreating: --restart policy, --memory, --cpu-shares, --cpus. Example: docker update --restart=always container. Useful for adjusting running containers.",
          },
          {
            question: "How do you monitor Docker events in real-time?",
            answer:
              "docker events shows real-time stream of Docker daemon events: start, stop, die, kill, create, destroy, etc. Filter with --filter event=start. Useful for debugging, auditing, automation.",
          },
        ],
        exercises: [
          {
            type: "command",
            question: "Show disk usage by Docker (images, containers, volumes)",
            answer: "docker system df",
          },
          {
            type: "command",
            question:
              "Remove all stopped containers, unused networks, dangling images",
            answer: "docker system prune",
          },
          {
            type: "scenario",
            question:
              "Run container with memory limit of 256MB and 0.5 CPU cores",
            answer: "docker run --memory='256m' --cpus='0.5' image-name",
          },
          {
            type: "command",
            question: "Copy log file from container to current host directory",
            answer: "docker cp container-name:/var/log/app.log ./",
          },
          {
            type: "troubleshoot",
            question: "Container using 100% CPU. How to investigate?",
            answer:
              "docker stats container-name to confirm, docker top container-name to see processes, docker exec -it container sh to enter and investigate. Check application logs.",
          },
          {
            type: "command",
            question: "View changes made to container filesystem",
            answer: "docker diff container-name",
          },
          {
            type: "command",
            question:
              "Update restart policy of running container to always restart",
            answer: "docker update --restart=always container-name",
          },
          {
            type: "scenario",
            question: "View all Docker events related to container starts",
            answer: "docker events --filter event=start",
          },
          {
            type: "command",
            question: "Format docker ps output to show only names and status",
            answer: 'docker ps --format "table {{.Names}}\\t{{.Status}}"',
          },
          {
            type: "cleanup",
            question:
              "Remove all Docker data (containers, images, volumes, networks)",
            answer: "docker system prune -a --volumes",
          },
        ],
        programExercises: [
          {
            type: "program",
            question: "Program 1: Monitor resource usage of running containers",
            code: "docker run -d --name web nginx\ndocker run -d --name db postgres\ndocker stats --no-stream",
            output:
              "Shows CPU, memory, network, and disk usage for all containers",
          },
          {
            type: "program",
            question: "Program 2: Copy file into container, verify it exists",
            code: "echo 'test content' > test.txt\ndocker run -d --name mycontainer alpine sleep 3600\ndocker cp test.txt mycontainer:/tmp/\ndocker exec mycontainer cat /tmp/test.txt",
            output: "test content - file successfully copied and read",
          },
          {
            type: "program",
            question: "Program 3: Run container with memory limit, trigger OOM",
            code: "docker run -it --rm --memory='50m' alpine sh -c 'dd if=/dev/zero of=/dev/null bs=1M count=100'",
            output: "Container killed by OOM when exceeding memory limit",
          },
          {
            type: "program",
            question: "Program 4: View container filesystem changes",
            code: "docker run -d --name test alpine sh -c 'echo hello > /tmp/newfile && sleep 3600'\ndocker diff test",
            output: "A /tmp/newfile - shows files added to container",
          },
          {
            type: "program",
            question: "Program 5: Check disk usage, prune unused data",
            code: "docker system df\ndocker system prune -f\ndocker system df",
            output:
              "Shows disk usage before and after cleanup, space reclaimed",
          },
          {
            type: "program",
            question: "Program 6: View running processes inside container",
            code: "docker run -d --name nginx-test nginx\ndocker top nginx-test",
            output:
              "Shows nginx master and worker processes running in container",
          },
          {
            type: "program",
            question:
              "Program 7: Update container restart policy without stopping it",
            code: "docker run -d --name persistent nginx\ndocker update --restart=always persistent\ndocker inspect persistent --format='{{.HostConfig.RestartPolicy.Name}}'",
            output: "always - restart policy updated on running container",
          },
        ],
      },
    ],
  },
];

export const dockerQuiz = [
  {
    question: "What is the difference between an image and a container?",
    options: [
      "They are the same thing",
      "An image is a template, a container is a running instance of an image",
      "Images are faster than containers",
      "Containers can't be modified",
    ],
    correctAnswer: 1,
    explanation:
      "A Docker image is a read-only template with instructions for creating a container. A container is a running instance of an image that can be started, stopped, and modified.",
  },
  {
    question: "What does the FROM instruction in Dockerfile do?",
    options: [
      "Copies files from host",
      "Specifies the base image to build upon",
      "Sets environment variables",
      "Runs a command",
    ],
    correctAnswer: 1,
    explanation:
      "FROM specifies the base image for your Docker image. Every Dockerfile must start with FROM to establish the foundation upon which you'll build your application.",
  },
  {
    question: "What is a Docker volume used for?",
    options: [
      "To control sound levels",
      "To persist data outside the container's lifecycle",
      "To create networks",
      "To build images",
    ],
    correctAnswer: 1,
    explanation:
      "Volumes are the preferred mechanism for persisting data generated by and used by Docker containers. They exist outside the container filesystem and persist even when containers are removed.",
  },
  {
    question: "What does 'docker-compose up' do?",
    options: [
      "Only builds images",
      "Creates and starts containers defined in docker-compose.yml",
      "Removes containers",
      "Updates Docker",
    ],
    correctAnswer: 1,
    explanation:
      "'docker-compose up' builds images if needed, creates services, networks, and volumes defined in docker-compose.yml, and starts the containers.",
  },
  {
    question: "What is the purpose of .dockerignore?",
    options: [
      "To hide containers",
      "To exclude files from being copied into the image",
      "To ignore errors",
      "To create backups",
    ],
    correctAnswer: 1,
    explanation:
      ".dockerignore works like .gitignore - it excludes files and directories from being copied into your Docker image during build, reducing image size and improving security.",
  },
  {
    question: "What's the difference between CMD and ENTRYPOINT in Dockerfile?",
    options: [
      "They are identical",
      "ENTRYPOINT sets the main command, CMD provides default arguments that can be overridden",
      "CMD is faster",
      "ENTRYPOINT can't be changed",
    ],
    correctAnswer: 1,
    explanation:
      "ENTRYPOINT defines the executable that will run when the container starts. CMD provides default arguments to ENTRYPOINT (or a default command if no ENTRYPOINT). CMD arguments can be overridden at runtime.",
  },
  {
    question: "What is Docker?",
    options: [
      "A virtual machine",
      "A platform for developing, shipping, and running applications in containers",
      "A programming language",
      "An operating system",
    ],
    correctAnswer: 1,
    explanation:
      "Docker is a platform that uses OS-level virtualization to deliver software in packages called containers. It packages applications with all dependencies needed to run.",
  },
  {
    question: "What is a Docker container?",
    options: [
      "A storage box",
      "A lightweight, standalone executable package with application and dependencies",
      "A VM image",
      "A database",
    ],
    correctAnswer: 1,
    explanation:
      "A container is a standard unit of software that packages code and all its dependencies so the application runs quickly and reliably across computing environments.",
  },
  {
    question: "What does 'docker run' do?",
    options: [
      "Runs a command",
      "Creates and starts a container from an image",
      "Runs Docker daemon",
      "Executes a script",
    ],
    correctAnswer: 1,
    explanation:
      "docker run creates a new container from a specified image and starts it. It combines docker create and docker start in one command.",
  },
  {
    question: "What is the Docker daemon?",
    options: [
      "An evil spirit",
      "The background service that manages Docker containers",
      "A container type",
      "An image format",
    ],
    correctAnswer: 1,
    explanation:
      "The Docker daemon (dockerd) is a persistent background process that manages Docker containers, images, networks, and volumes on a host system.",
  },
  {
    question: "What does 'docker ps' show?",
    options: [
      "PostScript files",
      "Currently running containers",
      "All images",
      "Docker processes only",
    ],
    correctAnswer: 1,
    explanation:
      "docker ps lists all currently running containers. Use docker ps -a to see all containers including stopped ones.",
  },
  {
    question: "What does 'docker images' do?",
    options: [
      "Creates images",
      "Lists all locally available Docker images",
      "Displays pictures",
      "Downloads images",
    ],
    correctAnswer: 1,
    explanation:
      "docker images (or docker image ls) lists all Docker images stored locally on your system with their repository, tag, image ID, creation date, and size.",
  },
  {
    question: "What is a Dockerfile?",
    options: [
      "A text document",
      "A text file with instructions to build a Docker image",
      "A configuration file",
      "A log file",
    ],
    correctAnswer: 1,
    explanation:
      "A Dockerfile is a text document containing all commands needed to build a Docker image. It automates the image creation process with a series of instructions.",
  },
  {
    question: "What does the COPY instruction do in Dockerfile?",
    options: [
      "Duplicates containers",
      "Copies files from host to image filesystem",
      "Copies environment variables",
      "Clones repositories",
    ],
    correctAnswer: 1,
    explanation:
      "COPY copies files or directories from the build context (host machine) into the Docker image filesystem at a specified path.",
  },
  {
    question: "What does the ADD instruction do?",
    options: [
      "Adds containers",
      "Copies files and can extract archives and download from URLs",
      "Adds environment variables",
      "Adds users",
    ],
    correctAnswer: 1,
    explanation:
      "ADD is similar to COPY but has additional features: it can extract tar archives automatically and download files from URLs. COPY is preferred for simple file copying.",
  },
  {
    question: "What does the RUN instruction do in Dockerfile?",
    options: [
      "Runs the container",
      "Executes commands during image build",
      "Runs at container start",
      "Runs tests",
    ],
    correctAnswer: 1,
    explanation:
      "RUN executes commands during the image build process and commits the results as a new layer. Used for installing packages, creating directories, etc.",
  },
  {
    question: "What does the WORKDIR instruction do?",
    options: [
      "Creates a workspace",
      "Sets the working directory for subsequent instructions",
      "Defines work hours",
      "Creates workers",
    ],
    correctAnswer: 1,
    explanation:
      "WORKDIR sets the working directory for any RUN, CMD, ENTRYPOINT, COPY, and ADD instructions that follow it. Creates the directory if it doesn't exist.",
  },
  {
    question: "What does the ENV instruction do?",
    options: [
      "Creates environments",
      "Sets environment variables in the image",
      "Configures envelopes",
      "Defines env files",
    ],
    correctAnswer: 1,
    explanation:
      "ENV sets environment variables that are available during build and at runtime in containers. Format: ENV KEY=value or ENV KEY value.",
  },
  {
    question: "What does the EXPOSE instruction do?",
    options: [
      "Exposes vulnerabilities",
      "Documents which ports the container listens on",
      "Opens ports automatically",
      "Publishes ports",
    ],
    correctAnswer: 1,
    explanation:
      "EXPOSE documents which network ports the container will listen on at runtime. It's documentation only; use -p flag with docker run to actually publish ports.",
  },
  {
    question: "What is the difference between COPY and ADD?",
    options: [
      "No difference",
      "COPY is simpler, ADD can extract tar files and download URLs",
      "ADD is deprecated",
      "COPY is faster",
    ],
    correctAnswer: 1,
    explanation:
      "COPY only copies local files/directories. ADD can also extract local tar files and fetch remote URLs. Docker best practices recommend COPY for transparency.",
  },
  {
    question: "What does 'docker build' do?",
    options: [
      "Builds containers",
      "Creates a Docker image from a Dockerfile",
      "Builds Docker",
      "Compiles code",
    ],
    correctAnswer: 1,
    explanation:
      "docker build reads instructions from a Dockerfile and builds a Docker image. Use -t flag to tag the image with a name.",
  },
  {
    question: "What is a Docker layer?",
    options: [
      "A coating",
      "A read-only filesystem change in an image",
      "A network layer",
      "A security layer",
    ],
    correctAnswer: 1,
    explanation:
      "Each instruction in a Dockerfile creates a layer. Layers are stacked and each represents a filesystem diff. Docker uses layers for efficient storage and caching.",
  },
  {
    question: "What is image caching in Docker?",
    options: [
      "Storing images",
      "Reusing unchanged layers to speed up builds",
      "Memory caching",
      "Browser cache",
    ],
    correctAnswer: 1,
    explanation:
      "Docker caches layers during builds. If a layer hasn't changed, Docker reuses the cached layer instead of rebuilding, significantly speeding up subsequent builds.",
  },
  {
    question: "How do you invalidate Docker build cache?",
    options: [
      "Restart Docker",
      "Use --no-cache flag with docker build",
      "Delete cache folder",
      "Clear browser cache",
    ],
    correctAnswer: 1,
    explanation:
      "Use docker build --no-cache to force rebuild all layers without using cache. Useful when you need to ensure fresh installation of packages.",
  },
  {
    question: "What does 'docker exec' do?",
    options: [
      "Executes Docker",
      "Runs a command in a running container",
      "Executes image",
      "Starts container",
    ],
    correctAnswer: 1,
    explanation:
      "docker exec runs a new command in a running container. Commonly used as docker exec -it container_name bash to get an interactive shell.",
  },
  {
    question: "What does the -it flag mean in docker run?",
    options: [
      "Iterate",
      "Interactive terminal (combines -i and -t flags)",
      "Install tools",
      "Immediate termination",
    ],
    correctAnswer: 1,
    explanation:
      "-i keeps STDIN open (interactive), -t allocates a pseudo-TTY (terminal). Together they enable interactive command-line access to containers.",
  },
  {
    question: "What does 'docker stop' do?",
    options: [
      "Stops Docker daemon",
      "Gracefully stops a running container",
      "Stops all processes",
      "Pauses container",
    ],
    correctAnswer: 1,
    explanation:
      "docker stop sends SIGTERM signal to gracefully stop the main process, then SIGKILL after grace period. Allows cleanup before shutdown.",
  },
  {
    question: "What does 'docker kill' do?",
    options: [
      "Deletes containers",
      "Forcefully stops container by sending SIGKILL",
      "Terminates Docker",
      "Removes images",
    ],
    correctAnswer: 1,
    explanation:
      "docker kill immediately sends SIGKILL signal to the container's main process, forcing immediate termination without graceful shutdown.",
  },
  {
    question: "What does 'docker rm' do?",
    options: [
      "Removes images",
      "Removes one or more stopped containers",
      "Removes Docker",
      "Removes volumes",
    ],
    correctAnswer: 1,
    explanation:
      "docker rm removes stopped containers. Use docker rm -f to force remove running containers. Container must be stopped first unless using -f flag.",
  },
  {
    question: "What does 'docker rmi' do?",
    options: [
      "Removes containers",
      "Removes one or more images",
      "Removes volumes",
      "Removes networks",
    ],
    correctAnswer: 1,
    explanation:
      "docker rmi removes Docker images. Images must not be used by any containers (use docker rm first). Use -f to force removal.",
  },
  {
    question: "What is Docker Hub?",
    options: [
      "A physical hub",
      "Public registry for Docker images",
      "Docker's headquarters",
      "A network hub",
    ],
    correctAnswer: 1,
    explanation:
      "Docker Hub is the default public registry for Docker images. It hosts millions of images including official ones from software vendors and community images.",
  },
  {
    question: "What does 'docker pull' do?",
    options: [
      "Pulls code from git",
      "Downloads an image from a registry",
      "Pulls containers",
      "Updates Docker",
    ],
    correctAnswer: 1,
    explanation:
      "docker pull downloads a Docker image from a registry (Docker Hub by default) to your local machine without creating a container.",
  },
  {
    question: "What does 'docker push' do?",
    options: [
      "Pushes code",
      "Uploads an image to a registry",
      "Pushes containers",
      "Publishes ports",
    ],
    correctAnswer: 1,
    explanation:
      "docker push uploads a Docker image to a registry. You must be logged in (docker login) and the image must be tagged with the registry path.",
  },
  {
    question: "What is a Docker registry?",
    options: [
      "A list",
      "A storage system for Docker images",
      "A register of containers",
      "A log file",
    ],
    correctAnswer: 1,
    explanation:
      "A Docker registry stores and distributes Docker images. Docker Hub is the default public registry, but you can run private registries for organizational use.",
  },
  {
    question: "What is Docker Compose?",
    options: [
      "Music composition",
      "Tool for defining and running multi-container applications",
      "Image composer",
      "Container merger",
    ],
    correctAnswer: 1,
    explanation:
      "Docker Compose is a tool for defining and running multi-container Docker applications using a YAML file (docker-compose.yml) to configure services.",
  },
  {
    question: "What file does Docker Compose use?",
    options: [
      "Dockerfile",
      "docker-compose.yml",
      "compose.json",
      "config.yaml",
    ],
    correctAnswer: 1,
    explanation:
      "Docker Compose uses docker-compose.yml (or .yaml) file to define services, networks, volumes, and other configuration for multi-container applications.",
  },
  {
    question: "What does 'docker-compose down' do?",
    options: [
      "Downloads images",
      "Stops and removes containers, networks, and volumes",
      "Shuts down Docker",
      "Lowers priority",
    ],
    correctAnswer: 1,
    explanation:
      "docker-compose down stops and removes containers, networks created by up. Use --volumes to also remove volumes. Opposite of docker-compose up.",
  },
  {
    question: "What does 'docker-compose ps' show?",
    options: [
      "All processes",
      "Status of services defined in docker-compose.yml",
      "System processes",
      "Docker processes",
    ],
    correctAnswer: 1,
    explanation:
      "docker-compose ps lists containers for services defined in the current docker-compose.yml file, showing their state, ports, and other information.",
  },
  {
    question: "What does 'docker-compose logs' do?",
    options: [
      "Creates logs",
      "Displays log output from services",
      "Logs in",
      "Records events",
    ],
    correctAnswer: 1,
    explanation:
      "docker-compose logs displays log output from services. Use -f to follow log output. Can specify specific service names to filter logs.",
  },
  {
    question: "What is a multi-stage build?",
    options: [
      "Multiple Dockerfiles",
      "Using multiple FROM statements to create smaller final images",
      "Building in stages",
      "Staged deployment",
    ],
    correctAnswer: 1,
    explanation:
      "Multi-stage builds use multiple FROM statements in one Dockerfile. You can copy artifacts from one stage to another, creating smaller, more secure final images.",
  },
  {
    question: "Why use multi-stage builds?",
    options: [
      "Faster builds",
      "Reduce final image size by separating build and runtime dependencies",
      "Multiple images",
      "Better security only",
    ],
    correctAnswer: 1,
    explanation:
      "Multi-stage builds reduce image size by keeping only runtime dependencies in the final image, leaving build tools and intermediate files in earlier stages.",
  },
  {
    question: "What is the purpose of ARG in Dockerfile?",
    options: [
      "Arguments to container",
      "Define build-time variables",
      "Function arguments",
      "Command arguments",
    ],
    correctAnswer: 1,
    explanation:
      "ARG defines build-time variables that can be passed during docker build with --build-arg. Unlike ENV, ARG values aren't available in running containers.",
  },
  {
    question: "What's the difference between ARG and ENV?",
    options: [
      "No difference",
      "ARG is build-time only, ENV is available at runtime",
      "ENV is deprecated",
      "ARG is faster",
    ],
    correctAnswer: 1,
    explanation:
      "ARG variables are only available during build. ENV variables persist in the built image and are available during runtime. Use ARG for build-time only values.",
  },
  {
    question: "What does VOLUME instruction do in Dockerfile?",
    options: [
      "Increases volume",
      "Creates a mount point for external storage",
      "Controls sound",
      "Measures capacity",
    ],
    correctAnswer: 1,
    explanation:
      "VOLUME creates a mount point and marks it as holding externally mounted volumes. Used to persist data or share data between host and container.",
  },
  {
    question: "What are the types of Docker volumes?",
    options: [
      "Only named volumes",
      "Named volumes, bind mounts, and tmpfs mounts",
      "Host volumes only",
      "Virtual volumes",
    ],
    correctAnswer: 1,
    explanation:
      "Docker has three mount types: named volumes (managed by Docker), bind mounts (map host directory), and tmpfs mounts (stored in memory, Linux only).",
  },
  {
    question: "What is a bind mount?",
    options: [
      "Binding containers",
      "Mounting a host directory into a container",
      "Network binding",
      "Port binding",
    ],
    correctAnswer: 1,
    explanation:
      "Bind mounts map a host directory or file into a container. Changes in either location are reflected immediately. Specified with -v or --mount.",
  },
  {
    question: "What is the difference between volumes and bind mounts?",
    options: [
      "No difference",
      "Volumes are managed by Docker, bind mounts use host paths directly",
      "Volumes are faster",
      "Bind mounts are deprecated",
    ],
    correctAnswer: 1,
    explanation:
      "Volumes are managed by Docker in a Docker area. Bind mounts can be anywhere on host filesystem. Volumes are recommended for better portability.",
  },
  {
    question: "What does 'docker volume create' do?",
    options: [
      "Creates containers",
      "Creates a named volume",
      "Increases storage",
      "Creates directories",
    ],
    correctAnswer: 1,
    explanation:
      "docker volume create creates a named volume that can be used by containers. Volumes persist independently of container lifecycle.",
  },
  {
    question: "What does 'docker volume ls' do?",
    options: [
      "Lists containers",
      "Lists all Docker volumes",
      "Lists files",
      "Shows volume size",
    ],
    correctAnswer: 1,
    explanation:
      "docker volume ls lists all volumes on the Docker host. Shows volume driver and volume name.",
  },
  {
    question: "What is Docker networking?",
    options: [
      "Internet connection",
      "System for containers to communicate with each other and outside world",
      "Network cables",
      "Router configuration",
    ],
    correctAnswer: 1,
    explanation:
      "Docker networking enables containers to communicate with each other and external networks. Docker provides several network drivers for different use cases.",
  },
  {
    question: "What are Docker network drivers?",
    options: [
      "Device drivers",
      "bridge, host, overlay, macvlan, none",
      "Network cards",
      "Ethernet drivers",
    ],
    correctAnswer: 1,
    explanation:
      "Docker network drivers: bridge (default, single host), host (use host network), overlay (multi-host), macvlan (MAC addresses), none (no networking).",
  },
  {
    question: "What is the bridge network?",
    options: [
      "Physical bridge",
      "Default network driver creating private internal network on host",
      "Network connection",
      "VPN bridge",
    ],
    correctAnswer: 1,
    explanation:
      "Bridge is the default network driver. Containers on same bridge network can communicate. Bridge network is private to the Docker host.",
  },
  {
    question: "What does 'docker network create' do?",
    options: [
      "Creates internet",
      "Creates a new Docker network",
      "Creates network cards",
      "Configures router",
    ],
    correctAnswer: 1,
    explanation:
      "docker network create creates a new network. Can specify driver type with --driver. Allows containers to communicate on custom networks.",
  },
  {
    question: "What does 'docker network ls' do?",
    options: [
      "Lists network cards",
      "Lists all Docker networks",
      "Shows IP addresses",
      "Lists containers",
    ],
    correctAnswer: 1,
    explanation:
      "docker network ls lists all networks on the Docker host, showing network ID, name, driver, and scope.",
  },
  {
    question: "What is overlay network?",
    options: [
      "Network overlay",
      "Multi-host network for swarm services",
      "Top layer only",
      "Virtual network",
    ],
    correctAnswer: 1,
    explanation:
      "Overlay networks enable communication between containers across multiple Docker daemon hosts. Used in Docker Swarm for service-to-service communication.",
  },
  {
    question: "What is host network mode?",
    options: [
      "Hosting websites",
      "Container uses host's network stack directly",
      "Host only access",
      "Network hosting",
    ],
    correctAnswer: 1,
    explanation:
      "In host mode, container doesn't get its own IP address and uses host's network directly. No network isolation. Better performance but less secure.",
  },
  {
    question: "What does the -p flag do in docker run?",
    options: [
      "Password",
      "Publishes container port to host port",
      "Process",
      "Path",
    ],
    correctAnswer: 1,
    explanation:
      "-p (or --publish) maps container port to host port. Format: -p host_port:container_port. Enables external access to containerized services.",
  },
  {
    question: "What does the -d flag do in docker run?",
    options: [
      "Delete",
      "Runs container in detached mode (background)",
      "Debug mode",
      "Development",
    ],
    correctAnswer: 1,
    explanation:
      "-d (--detach) runs container in background and prints container ID. Container continues running until stopped or exits.",
  },
  {
    question: "What does the --name flag do?",
    options: [
      "Names images",
      "Assigns a name to the container",
      "Renames Docker",
      "Username",
    ],
    correctAnswer: 1,
    explanation:
      "--name assigns a custom name to container instead of random name. Makes it easier to reference container in commands.",
  },
  {
    question: "What does the --rm flag do in docker run?",
    options: [
      "Removes images",
      "Automatically removes container when it exits",
      "Remove flag",
      "Removes volumes",
    ],
    correctAnswer: 1,
    explanation:
      "--rm automatically removes the container when it exits. Useful for temporary containers to avoid accumulating stopped containers.",
  },
  {
    question: "What does 'docker logs' show?",
    options: [
      "System logs",
      "Output and logs from a container",
      "Error logs only",
      "Docker daemon logs",
    ],
    correctAnswer: 1,
    explanation:
      "docker logs fetches logs from a container (stdout and stderr). Use -f to follow log output and --tail to limit number of lines.",
  },
  {
    question: "What does 'docker inspect' do?",
    options: [
      "Inspects code",
      "Returns detailed information about Docker objects (JSON format)",
      "Visual inspection",
      "Debug tool",
    ],
    correctAnswer: 1,
    explanation:
      "docker inspect returns detailed low-level information about Docker objects (containers, images, volumes, networks) in JSON format. Useful for debugging.",
  },
  {
    question: "What does 'docker stats' show?",
    options: [
      "Statistics theory",
      "Real-time resource usage statistics for containers",
      "Docker statistics",
      "Build statistics",
    ],
    correctAnswer: 1,
    explanation:
      "docker stats displays live stream of container resource usage statistics including CPU, memory, network I/O, and block I/O.",
  },
  {
    question: "What does 'docker top' show?",
    options: [
      "Top containers",
      "Running processes inside a container",
      "Best practices",
      "Top images",
    ],
    correctAnswer: 1,
    explanation:
      "docker top displays running processes inside a container, similar to the Unix/Linux top command. Shows PID, user, time, and command.",
  },
  {
    question: "What does 'docker commit' do?",
    options: [
      "Commits code",
      "Creates a new image from container's changes",
      "Saves changes",
      "Git commit",
    ],
    correctAnswer: 1,
    explanation:
      "docker commit creates a new image from a container's changes. Not recommended for production; use Dockerfile for reproducible builds.",
  },
  {
    question: "What does 'docker tag' do?",
    options: [
      "Tags files",
      "Creates a tag/alias for an image",
      "Label containers",
      "Version tags",
    ],
    correctAnswer: 1,
    explanation:
      "docker tag creates a new tag (alias) for an existing image. Format: docker tag source_image[:tag] target_image[:tag]. Used for versioning.",
  },
  {
    question: "What is Docker Swarm?",
    options: [
      "Insect swarm",
      "Native clustering and orchestration tool for Docker",
      "Container group",
      "Network type",
    ],
    correctAnswer: 1,
    explanation:
      "Docker Swarm is Docker's native clustering and orchestration solution. Turns multiple Docker hosts into a single virtual host for container management.",
  },
  {
    question: "What is a Docker service in Swarm?",
    options: [
      "Service provider",
      "Definition of tasks to execute on swarm nodes",
      "Background service",
      "Web service",
    ],
    correctAnswer: 1,
    explanation:
      "A service is the definition of tasks to execute on worker or manager nodes. It's the central structure of swarm and primary unit of interaction.",
  },
  {
    question: "What does HEALTHCHECK instruction do?",
    options: [
      "Health monitoring",
      "Defines command to check container health status",
      "Checks Docker health",
      "System diagnostics",
    ],
    correctAnswer: 1,
    explanation:
      "HEALTHCHECK tells Docker how to test if container is working. Docker runs the command periodically and updates container health status.",
  },
  {
    question: "What does 'docker system prune' do?",
    options: [
      "Prunes trees",
      "Removes unused data (containers, networks, images, cache)",
      "System cleanup",
      "Optimizes Docker",
    ],
    correctAnswer: 1,
    explanation:
      "docker system prune removes all stopped containers, unused networks, dangling images, and build cache. Use -a to also remove unused images.",
  },
  {
    question: "What is a dangling image?",
    options: [
      "Hanging image",
      "Image layer without tag, not referenced by any tagged image",
      "Broken image",
      "Unused image",
    ],
    correctAnswer: 1,
    explanation:
      "Dangling images are layers that have no relationship to tagged images. Created when rebuilding an image with same tag. Listed with docker images -f dangling=true.",
  },
  {
    question: "What does USER instruction do in Dockerfile?",
    options: [
      "Creates users",
      "Sets the user for running subsequent commands",
      "User permissions",
      "Username configuration",
    ],
    correctAnswer: 1,
    explanation:
      "USER sets the user (and optionally group) to use when running the image and for any RUN, CMD, ENTRYPOINT instructions that follow.",
  },
  {
    question: "Why should you avoid running containers as root?",
    options: [
      "Performance issues",
      "Security risk - container escapes could compromise host",
      "Root causes errors",
      "Not compatible",
    ],
    correctAnswer: 1,
    explanation:
      "Running as root is a security risk. If container is compromised, attacker has root privileges. Use USER instruction to run as non-root user.",
  },
  {
    question: "What is the best practice for Dockerfile layers?",
    options: [
      "Many layers",
      "Minimize layers by combining commands, order by change frequency",
      "One layer only",
      "Layers don't matter",
    ],
    correctAnswer: 1,
    explanation:
      "Minimize layers by combining related commands with &&. Order instructions from least to most frequently changing to maximize cache effectiveness.",
  },
  {
    question: "What does 'docker cp' do?",
    options: [
      "Copies containers",
      "Copies files between container and host",
      "Copy paste",
      "Creates copies",
    ],
    correctAnswer: 1,
    explanation:
      "docker cp copies files/folders between container and local filesystem. Works with both running and stopped containers.",
  },
  {
    question: "What does 'docker rename' do?",
    options: [
      "Renames images",
      "Renames a container",
      "Renames files",
      "Renames Docker",
    ],
    correctAnswer: 1,
    explanation:
      "docker rename changes the name of an existing container. Useful when you need a more meaningful name after container creation.",
  },
  {
    question: "What is the difference between docker-compose and Dockerfile?",
    options: [
      "Same thing",
      "Dockerfile builds image, docker-compose orchestrates multiple containers",
      "Compose is newer",
      "Dockerfile is deprecated",
    ],
    correctAnswer: 1,
    explanation:
      "Dockerfile defines how to build a single image. docker-compose.yml defines how to run multiple containers together, their relationships, and configurations.",
  },
  {
    question: "What does LABEL instruction do in Dockerfile?",
    options: [
      "Labels containers",
      "Adds metadata to image as key-value pairs",
      "Creates labels",
      "Tags images",
    ],
    correctAnswer: 1,
    explanation:
      "LABEL adds metadata to images as key-value pairs. Used for version, description, maintainer info. Can query with docker inspect.",
  },
  {
    question: "What does MAINTAINER instruction do?",
    options: [
      "Maintains container",
      "Sets author field of image (deprecated, use LABEL)",
      "Assigns maintainer",
      "Maintenance mode",
    ],
    correctAnswer: 1,
    explanation:
      "MAINTAINER is deprecated. Use LABEL maintainer='name' instead. It sets the author/maintainer information for the image.",
  },
  {
    question: "What does ONBUILD instruction do?",
    options: [
      "Builds on event",
      "Adds trigger instruction executed when image is used as base",
      "Immediate build",
      "Conditional build",
    ],
    correctAnswer: 1,
    explanation:
      "ONBUILD adds trigger instruction that executes when the image is used as base for another build. Useful for creating base images.",
  },
  {
    question: "What does STOPSIGNAL instruction do?",
    options: [
      "Stops signals",
      "Sets system call signal to stop container",
      "Signal handler",
      "Stop command",
    ],
    correctAnswer: 1,
    explanation:
      "STOPSIGNAL sets the system call signal that will be sent to container to exit. Default is SIGTERM. Can specify signal number or name.",
  },
  {
    question: "What does SHELL instruction do in Dockerfile?",
    options: [
      "Creates shell",
      "Overrides default shell for RUN commands",
      "Shell configuration",
      "Command shell",
    ],
    correctAnswer: 1,
    explanation:
      'SHELL allows overriding default shell used for shell form of commands. Default is ["/bin/sh", "-c"] on Linux. Useful for Windows containers.',
  },
  {
    question: "What is the shell form vs exec form in Dockerfile?",
    options: [
      "Same thing",
      "Shell form runs in shell, exec form runs directly as executable",
      "Different shells",
      "Form validation",
    ],
    correctAnswer: 1,
    explanation:
      'Shell form (CMD command) runs in shell, enables variable substitution. Exec form (CMD ["executable", "param"]) runs directly without shell, preferred for ENTRYPOINT.',
  },
  {
    question: "What does 'docker pause' do?",
    options: [
      "Stops container",
      "Pauses all processes in container using cgroups",
      "Waits",
      "Delays execution",
    ],
    correctAnswer: 1,
    explanation:
      "docker pause suspends all processes in container using cgroup freezer. docker unpause resumes them. Different from stop which terminates processes.",
  },
  {
    question: "What does 'docker wait' do?",
    options: [
      "Waits for input",
      "Blocks until container stops, then prints exit code",
      "Delays execution",
      "Waits forever",
    ],
    correctAnswer: 1,
    explanation:
      "docker wait blocks until one or more containers stop, then prints their exit codes. Useful in scripts for sequential container operations.",
  },
  {
    question: "What does 'docker export' do?",
    options: [
      "Exports data",
      "Exports container filesystem as tar archive",
      "Saves images",
      "Exports configuration",
    ],
    correctAnswer: 1,
    explanation:
      "docker export exports container's filesystem as tar archive. Doesn't export volumes or image history. Use docker save for images.",
  },
  {
    question: "What does 'docker import' do?",
    options: [
      "Imports data",
      "Creates image from tarball",
      "Imports containers",
      "Loads configuration",
    ],
    correctAnswer: 1,
    explanation:
      "docker import creates a new filesystem image from tarball. Often used with docker export. Doesn't preserve image history or metadata.",
  },
  {
    question: "What does 'docker save' do?",
    options: [
      "Saves containers",
      "Saves one or more images to tar archive with layers and metadata",
      "Saves data",
      "Saves configuration",
    ],
    correctAnswer: 1,
    explanation:
      "docker save saves images to tar archive including all layers, tags, and metadata. Use with docker load to transfer images. Better than export for images.",
  },
  {
    question: "What does 'docker load' do?",
    options: [
      "Loads containers",
      "Loads images from tar archive",
      "Loads data",
      "Loads configuration",
    ],
    correctAnswer: 1,
    explanation:
      "docker load loads an image from tar archive created by docker save. Preserves all layers, tags, and history. Used for transferring images.",
  },
  {
    question: "What is the least privilege principle in Docker?",
    options: [
      "Minimum permissions",
      "Run containers with minimum necessary privileges and capabilities",
      "No privileges",
      "Privilege escalation",
    ],
    correctAnswer: 1,
    explanation:
      "Least privilege means running containers with minimum permissions needed. Use non-root users, drop unnecessary capabilities, use read-only filesystems when possible.",
  },
  {
    question: "What does 'docker version' show?",
    options: [
      "Docker version only",
      "Version information of Docker client and server",
      "Image versions",
      "Container versions",
    ],
    correctAnswer: 1,
    explanation:
      "docker version displays version information for both Docker client and Docker daemon (server), including Go version and architecture.",
  },
  {
    question: "What does 'docker info' show?",
    options: [
      "Basic info",
      "System-wide information about Docker installation",
      "Container information",
      "Image information",
    ],
    correctAnswer: 1,
    explanation:
      "docker info displays system-wide information including containers count, images, storage driver, network config, swarm status, and more.",
  },
  {
    question: "What are Docker security best practices?",
    options: [
      "Use defaults",
      "Use official images, run as non-root, scan for vulnerabilities, minimize attack surface",
      "No security needed",
      "Firewall only",
    ],
    correctAnswer: 1,
    explanation:
      "Best practices: use official/trusted images, run as non-root, scan for vulnerabilities, minimize image size, use secrets management, keep Docker updated.",
  },
];
