export const systemDesignData = [
  {
    category: "Foundations",
    topics: [
      {
        id: "sd-process",
        title: "System Design Interview Process",
        category: "Foundations",
        description:
          "Structured framework for approaching system design interviews.",
      },
      {
        id: "capacity-consistency",
        title: "Capacity Estimation & Consistency Models",
        category: "Foundations",
        description: "Back-of-the-envelope math and CAP theorem trade-offs.",
      },
      {
        id: "load-balancing",
        title: "Load Balancing & Reverse Proxies",
        category: "Foundations",
        description:
          "Distributing traffic across servers for reliability and performance.",
      },
      {
        id: "caching",
        title: "Caching Strategies",
        category: "Foundations",
        description:
          "Cache-aside, write-through, write-behind patterns and eviction policies.",
      },
      {
        id: "database-sharding",
        title: "Database Sharding & Replication",
        category: "Foundations",
        description: "Horizontal partitioning and data replication strategies.",
      },
      {
        id: "message-queues",
        title: "Message Queues & Event-Driven Architecture",
        category: "Foundations",
        description: "Asynchronous processing with Kafka, RabbitMQ, and SQS.",
      },
      {
        id: "rate-limiting",
        title: "Rate Limiting & Throttling",
        category: "Foundations",
        description:
          "Token bucket, sliding window, and leaky bucket algorithms.",
      },
      {
        id: "api-design",
        title: "API Design (REST, GraphQL, gRPC)",
        category: "Foundations",
        description:
          "Designing robust APIs with versioning, pagination, and error handling.",
      },
      {
        id: "microservices",
        title: "Microservices Architecture",
        category: "Foundations",
        description:
          "Service decomposition, communication patterns, and resilience.",
      },
      {
        id: "consistent-hashing",
        title: "Consistent Hashing",
        category: "Foundations",
        description:
          "Distributing data across nodes with minimal remapping on changes.",
      },
      {
        id: "cdn-architecture",
        title: "CDN & Content Delivery",
        category: "Foundations",
        description: "Edge caching, push vs pull CDN, and cache invalidation.",
      },
      {
        id: "monitoring",
        title: "Monitoring, Logging & Alerting",
        category: "Foundations",
        description:
          "Four golden signals, distributed tracing, and observability.",
      },
    ],
  },
  {
    category: "Company LLD",
    topics: [
      {
        id: "netflix-lld",
        title: "Netflix Playback & Streaming",
        category: "Company LLD",
        description:
          "Playback session state machine, ABR streaming, and CDN edge caching.",
      },
      {
        id: "facebook-feed-lld",
        title: "Facebook News Feed",
        category: "Company LLD",
        description:
          "Fanout-on-write/read hybrid, EdgeRank scoring, and feed ranking.",
      },
      {
        id: "youtube-lld",
        title: "YouTube Video Upload & Processing",
        category: "Company LLD",
        description:
          "Resumable upload, transcoding pipeline, and Content ID fingerprinting.",
      },
      {
        id: "zomato-lld",
        title: "Zomato Food Delivery Platform",
        category: "Company LLD",
        description:
          "Order lifecycle, delivery partner assignment, and surge pricing.",
      },
      {
        id: "bookmyshow-lld",
        title: "BookMyShow Ticket Booking",
        category: "Company LLD",
        description: "Seat locking, virtual waiting room, and dynamic pricing.",
      },
      {
        id: "delhivery-lld",
        title: "Delhivery Logistics & Delivery",
        category: "Company LLD",
        description:
          "AWB tracking, hub sorting, route optimization, and SLA monitoring.",
      },
    ],
  },
  {
    category: "Company HLD",
    topics: [
      {
        id: "url-shortener",
        title: "URL Shortener (like bit.ly)",
        category: "Company HLD",
        description:
          "Base62 encoding, counter-based IDs, caching, and analytics.",
      },
      {
        id: "chat-system",
        title: "Chat System (like WhatsApp/Slack)",
        category: "Company HLD",
        description: "Real-time messaging, presence, group chat, and E2EE.",
      },
      {
        id: "notification-system",
        title: "Notification System Design",
        category: "Company HLD",
        description:
          "Multi-channel notifications, preferences, rate limiting, and delivery guarantees.",
      },
      {
        id: "search-autocomplete",
        title: "Search Autocomplete System",
        category: "Company HLD",
        description:
          "Trie-based suggestions, ranking, caching, and trending queries.",
      },
      {
        id: "ride-matching",
        title: "Ride Matching System (like Uber/Ola)",
        category: "Company HLD",
        description:
          "Geospatial matching, surge pricing, ETA, and batch optimization.",
      },
      {
        id: "payment-system",
        title: "Payment System Design",
        category: "Company HLD",
        description:
          "Idempotency, double-entry ledger, reconciliation, and fraud detection.",
      },
    ],
  },
];

export const systemDesignQuiz = [];
