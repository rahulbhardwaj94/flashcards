import React, { useState, useEffect } from 'react';
import TopicPanel from './components/TopicPanel';
import FlashcardDeck from './components/FlashcardDeck';
import './App.css';

function App() {
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [isDeckView, setIsDeckView] = useState(false);

  // Load topics from localStorage on component mount
  useEffect(() => {
    const savedTopics = localStorage.getItem('flashcard-topics');
    if (savedTopics) {
      const parsedTopics = JSON.parse(savedTopics);
      // Only use saved topics if they actually have content
      if (parsedTopics && parsedTopics.length > 0) {
        setTopics(parsedTopics);
      } else {
        // If saved topics are empty, load sample topics
        loadSampleTopics();
      }
    } else {
      // No saved topics, load sample topics
      loadSampleTopics();
    }
  }, []);

  // Function to load sample topics
  const loadSampleTopics = () => {
    const sampleTopics = [
      {
        id: '1',
        name: 'Node.js Fundamentals',
        description: 'Core concepts and advanced patterns in Node.js development',
        cards: [
          {
            id: '1-1',
            question: 'Explain the Node.js event loop and its phases.',
            hint: 'Think about timers, I/O callbacks, and where setImmediate runs.',
            answer: 'The event loop handles asynchronous I/O in phases: timers (setTimeout/setInterval), pending callbacks, idle/prepare (internal), poll (retrieves I/O events and executes their callbacks), check (setImmediate callbacks), and close callbacks. process.nextTick() schedules microtasks that run before the event loop continues to the next phase. Understanding these phases helps debug ordering and scheduling issues.'
          },
          {
            id: '1-2',
            question: 'Difference: process.nextTick() vs setImmediate().',
            hint: 'One runs before the event loop continues; the other runs on the check phase after I/O.',
            answer: 'process.nextTick() queues a microtask to run immediately after the current operation but before the event loop continues; setImmediate() schedules a callback to run on the check phase (after I/O callbacks). Overusing process.nextTick() can starve the event loop.'
          },
          {
            id: '1-3',
            question: 'How does Node.js handle concurrency on a single thread?',
            hint: 'I/O is offloaded; CPU-bound work can block',
            answer: 'Node uses a single-threaded event loop and non-blocking I/O. Asynchronous I/O is handled by libuv and the OS. Concurrency is achieved by scheduling I/O completion callbacks; CPU-bound tasks should be offloaded to worker threads or child processes to avoid blocking the event loop.'
          },
          {
            id: '1-4',
            question: 'What are streams and how to handle backpressure?',
            hint: 'Read/Write data in chunks; pipe helps',
            answer: 'Streams are abstractions for processing continuous data: Readable, Writable, Duplex, and Transform. Backpressure occurs when producers are faster than consumers. Handle it with writable.write() return values, readable.pause()/resume(), or by using stream.pipe(), which automatically manages backpressure.'
          },
          {
            id: '1-5',
            question: 'Explain cluster mode in Node.js.',
            hint: 'Use multiple processes per CPU core',
            answer: 'Cluster allows forking multiple worker processes (typically one per CPU core). Each worker has its own event loop and can share server ports. The master process distributes connections. Use IPC or external stores for shared state. It improves throughput and resilience.'
          },
          {
            id: '1-6',
            question: 'How to handle uncaught exceptions and unhandled rejections?',
            hint: 'Log and restart safely',
            answer: 'Log the error, alert on monitoring systems, and perform a graceful shutdown to avoid inconsistent state. Use a process manager (PM2, systemd) to restart the process. For unhandled rejections, handle them with .catch and a global handler that logs and exits safely if needed.'
          },
          {
            id: '1-7',
            question: 'What are worker threads?',
            hint: 'Parallel JS execution',
            answer: 'Worker threads (worker_threads module) enable running JavaScript in parallel for CPU-bound tasks. Use message passing or SharedArrayBuffer for communication, and avoid blocking the main thread.'
          },
          {
            id: '1-8',
            question: 'Explain module caching and its caveats.',
            hint: 'Modules cached after first load',
            answer: 'Modules are cached after the first require/import; subsequent requires return the cached object. Singletons persist across the app lifecycle. In development, you may need to clear the cache to reload modules. Beware memory growth from retained references.'
          }
        ]
      },
      {
        id: '2',
        name: 'TypeScript & Frameworks',
        description: 'TypeScript concepts and modern framework patterns',
        cards: [
          {
            id: '2-1',
            question: 'Difference between interface and type.',
            hint: 'One supports declaration merging',
            answer: 'Both describe shapes. interface supports declaration merging and extension, useful for public APIs. type aliases can express unions, intersections, mapped types, and other compositions. Use interface for extensible object shapes and type for complex compositions.'
          },
          {
            id: '2-2',
            question: 'What are Generics? Provide an example.',
            hint: 'Parameterized types',
            answer: 'Generics enable parameterizing types. Example: function identity<T>(arg: T): T { return arg; } — this keeps type safety while letting the function operate on multiple types.'
          },
          {
            id: '2-3',
            question: 'Explain request lifecycle in NestJS.',
            hint: 'Middleware -> Guards -> Interceptors -> Controllers',
            answer: 'Typical flow: Middleware -> Guards -> Interceptors -> Pipes -> Controllers -> Services -> Interceptors (after) -> Response. Guards handle authorization, Pipes validate/transform input, Interceptors can modify responses and measure execution time.'
          },
          {
            id: '2-4',
            question: 'What are NestJS guards?',
            hint: 'Think Authorization',
            answer: 'Guards determine whether a request is allowed to proceed based on roles or permissions. They run before route handlers and return true/false or throw for unauthorized access. They are used for RBAC and other access-control logic.'
          }
        ]
      },
      {
        id: '3',
        name: 'Databases & Data',
        description: 'Database design, optimization, and data management patterns',
        cards: [
          {
            id: '3-1',
            question: 'When to use MongoDB vs PostgreSQL?',
            hint: 'Consider schema flexibility and transactions',
            answer: 'Use MongoDB for flexible, document-oriented data, hierarchical or JSON-heavy data, and rapid prototyping. Use PostgreSQL for relational data, complex queries, joins, strong ACID transactions, constraints, and where data integrity is paramount.'
          },
          {
            id: '3-2',
            question: 'Explain transactions in PostgreSQL from Node.js.',
            hint: 'BEGIN, COMMIT, ROLLBACK — use same connection',
            answer: 'Start with BEGIN, execute queries on the same DB connection, then COMMIT. On error, ROLLBACK. When using a pool, acquire a client for the transaction duration to ensure the same session is used. Many libraries provide transaction helpers.'
          },
          {
            id: '3-3',
            question: 'What are indexes and types (B-Tree, GIN)?',
            hint: 'Index choice depends on query patterns',
            answer: 'Indexes speed lookups. B-Tree is the default and good for range and ORDER BY queries. GIN is ideal for jsonb, arrays, and full-text search. HASH indexes work for equality but have limitations. Choose based on query patterns and verify with EXPLAIN.'
          },
          {
            id: '3-4',
            question: 'How to optimize MongoDB aggregation?',
            hint: 'Filter and project early',
            answer: 'Push $match and $project early to reduce document size and count, use appropriate indexes, avoid unindexed $lookup on large datasets, and consider pre-aggregation or materialized views for heavy reports.'
          },
          {
            id: '3-5',
            question: 'Explain connection pooling and why it matters.',
            hint: 'Reuse DB connections to save overhead',
            answer: 'Connection pooling reuses DB connections to avoid the overhead of creating new connections for each request. Configure pool size according to DB limits and expected concurrency; too many connections can exhaust DB resources.'
          },
          {
            id: '3-6',
            question: 'How to design a vehicle service booking schema (brief)?',
            hint: 'Users, vehicles, bookings, slots',
            answer: 'Core tables: users, vehicles, services, time_slots, bookings. bookings references user_id, vehicle_id, service_id, slot_id. Index user_id, vehicle_id, booking_time for efficient queries. Enforce constraints and use transactions for bookings to avoid overbooking.'
          },
          {
            id: '3-7',
            question: 'What is GIN index used for?',
            hint: 'jsonb, arrays, full-text',
            answer: 'GIN (Generalized Inverted Index) accelerates queries on arrays, jsonb, and full-text search fields in PostgreSQL, enabling fast containment and text-search queries.'
          },
          {
            id: '3-8',
            question: 'How to implement pagination efficiently?',
            hint: 'Use keyset (cursor) pagination for large datasets',
            answer: 'Use keyset or cursor (seek) pagination for large datasets to avoid the OFFSET performance penalty. Keep stable sort keys and return cursors or tokens for the next page. In MongoDB, use range queries or cursors.'
          }
        ]
      },
      {
        id: '4',
        name: 'APIs & Integration',
        description: 'API design, security, and integration patterns',
        cards: [
          {
            id: '4-1',
            question: 'What is idempotency and how to implement it?',
            hint: 'Use unique keys for write operations',
            answer: 'Idempotency ensures repeated requests (retries) don\'t produce duplicate side effects. Implement it with an idempotency key stored with the result; on repeat, return the existing result instead of reprocessing. Useful for payment or booking APIs.'
          },
          {
            id: '4-2',
            question: 'How do you version APIs in production?',
            hint: 'URL vs headers',
            answer: 'Common approaches: URL versioning (/v1/resource), header-based versioning, or content negotiation. Communicate deprecation timelines and maintain backward compatibility where possible; design for smooth migration.'
          },
          {
            id: '4-3',
            question: 'How to design for high availability?',
            hint: 'Redundancy and failover',
            answer: 'Design for redundancy (multiple AZ/regions), use load balancers, autoscaling, replicas, health checks, retries with exponential backoff, circuit breakers, and data replication with failover strategies. Monitor and test failover regularly.'
          },
          {
            id: '4-4',
            question: 'What is API Gateway and why use it?',
            hint: 'Single entrypoint for microservices',
            answer: 'An API Gateway acts as a single entry point for clients, handling routing, authentication, rate-limiting, caching, request/response transformations, TLS termination, and aggregated responses. It simplifies client interactions with microservices.'
          },
          {
            id: '4-5',
            question: 'Explain CORS and handling it.',
            hint: 'Server sets Access-Control-Allow-* headers',
            answer: 'CORS is a browser security mechanism that restricts cross-origin HTTP requests. The server must return appropriate Access-Control-Allow-Origin, Access-Control-Allow-Methods, and Access-Control-Allow-Headers headers (or use a proxy) to allow cross-origin requests.'
          },
          {
            id: '4-6',
            question: 'When to use synchronous vs asynchronous processing?',
            hint: 'Immediate vs background',
            answer: 'Use synchronous processing for immediate, user-facing responses. Use asynchronous processing for long-running or non-critical tasks (background jobs) using message queues so the user request isn\'t blocked.'
          }
        ]
      },
      {
        id: '5',
        name: 'Testing & Quality',
        description: 'Testing strategies, tools, and quality assurance',
        cards: [
          {
            id: '5-1',
            question: 'Unit tests vs Integration tests?',
            hint: 'Unit = isolated, Integration = components together',
            answer: 'Unit tests isolate single units (functions/classes), usually with mocks. Integration tests verify multiple components together (DB, external services). Both are important: unit tests for quick feedback; integration tests for end-to-end correctness.'
          },
          {
            id: '5-2',
            question: 'How to mock DB in Jest?',
            hint: 'jest.mock or in-memory DB',
            answer: 'Use jest.mock() to replace DB modules with fakes/stubs, or use in-memory DBs (mongodb-memory-server, sqlite) for integration-style tests. Ensure proper setup/teardown and deterministic data.'
          },
          {
            id: '5-3',
            question: 'How to write an integration test that uses the DB?',
            hint: 'Use disposable test DB and teardown',
            answer: 'Spin up a disposable test DB (Docker), run migrations, seed minimal data, run tests, and teardown. Keep tests idempotent and isolated; use transactions with rollbacks where possible for speed.'
          }
        ]
      },
      {
        id: '6',
        name: 'DevOps & Deployment',
        description: 'CI/CD, containerization, and infrastructure management',
        cards: [
          {
            id: '6-1',
            question: 'Explain Docker multi-stage builds.',
            hint: 'Separate build and runtime',
            answer: 'Multi-stage builds let you build artifacts in a heavier image (with build tools) and copy only necessary outputs to a lightweight runtime image. This reduces final image size and attack surface.'
          },
          {
            id: '6-2',
            question: 'What is CI/CD pipeline for Node.js?',
            hint: 'Build, test, deploy',
            answer: 'Typical pipeline: on push, run CI to install dependencies, lint, test, build artifacts (Docker image), push to registry, and deploy via CD to staging/production. Include rollback strategies, monitoring, and gating (manual approvals) where needed.'
          },
          {
            id: '6-3',
            question: 'Explain AWS SQS visibility timeout.',
            hint: 'Message hidden while processed',
            answer: 'Visibility timeout hides a message from other consumers while a consumer processes it. If the consumer fails to delete the message within the timeout, the message becomes visible again and can be reprocessed. Tune timeout to expected processing time.'
          },
          {
            id: '6-4',
            question: 'ECS vs EKS – when to choose?',
            hint: 'Simple vs full K8s feature set',
            answer: 'ECS is an AWS-native container orchestration that\'s simpler to operate. EKS runs Kubernetes, offering portability and the Kubernetes ecosystem. Choose ECS for simplicity and tight AWS integration; choose EKS for advanced K8s features and portability.'
          },
          {
            id: '6-5',
            question: 'What is blue-green deployment?',
            hint: 'Two identical environments',
            answer: 'Maintain two identical environments (blue and green). Deploy the new version to green, test it, and switch traffic from blue to green when ready. Keep blue for immediate rollback if issues occur.'
          },
          {
            id: '6-6',
            question: 'Why use multi-stage Docker builds?',
            hint: 'Smaller runtime images',
            answer: 'Multi-stage builds let you perform build steps (compilation, bundling) in intermediate stages and copy only artifacts to the final runtime image, keeping the final image small and secure.'
          },
          {
            id: '6-7',
            question: 'How to use health checks in Kubernetes?',
            hint: 'Liveness vs readiness',
            answer: 'Use liveness probes to restart unhealthy containers and readiness probes to ensure pods only receive traffic when ready. Configure both for rolling updates and to avoid sending traffic to unhealthy instances.'
          }
        ]
      },
      {
        id: '7',
        name: 'Security & Authentication',
        description: 'Security best practices, authentication, and authorization',
        cards: [
          {
            id: '7-1',
            question: 'How to protect against SQL injection?',
            hint: 'Never concatenate user inputs',
            answer: 'Use parameterized queries/prepared statements, ORMs, input validation, and least-privilege DB credentials. Avoid building SQL with string concatenation of user inputs. Sanitize and validate inputs, and use DB permissions carefully.'
          },
          {
            id: '7-2',
            question: 'JWT with refresh tokens – best practices.',
            hint: 'Short-lived access tokens + secure refresh',
            answer: 'Issue short-lived access tokens and store refresh tokens securely (httpOnly cookies). Rotate refresh tokens on each use, support revocation, and consider binding tokens to device fingerprints. Validate and monitor token usage.'
          },
          {
            id: '7-3',
            question: 'How to implement RBAC?',
            hint: 'Roles map to permissions',
            answer: 'Define roles and permissions, store assignments, enforce checks in middleware/guards, and cache permission lookups for performance. Consider hierarchical roles and resource-based permissions for flexibility.'
          }
        ]
      },
      {
        id: '8',
        name: 'Performance & Optimization',
        description: 'Performance tuning, caching, and optimization strategies',
        cards: [
          {
            id: '8-1',
            question: 'How to cache API responses with Redis?',
            hint: 'Cache-aside pattern',
            answer: 'Use the cache-aside pattern: check Redis for key; on miss, query DB, store the result in Redis with a TTL. Use appropriate keys, invalidate on writes or use event-driven invalidation, and consider layered caching (edge, CDN, app-layer).'
          },
          {
            id: '8-2',
            question: 'How to profile and fix memory leaks in Node.js?',
            hint: 'Use heap snapshots and monitoring',
            answer: 'Use Node\'s --inspect with Chrome DevTools or tools like clinic/heap to take heap snapshots over time. Look for growing retained objects, event listener leaks, or large closures retaining memory. Fix by releasing references, removing listeners, and optimizing data structures.'
          },
          {
            id: '8-3',
            question: 'How do you optimize PostgreSQL queries?',
            hint: 'Use EXPLAIN ANALYZE',
            answer: 'Use EXPLAIN ANALYZE to find bottlenecks, add appropriate indexes, avoid SELECT *, limit returned columns, consider partitioning large tables, and denormalize when read performance is critical. Monitor slow queries and tune configuration.'
          },
          {
            id: '8-4',
            question: 'How to handle 100K RPS design high level?',
            hint: 'Scale horizontally and cache heavily',
            answer: 'Design with horizontal scaling, CDNs, edge caching, stateless services, autoscaling groups, message queues for async processing, DB sharding/replication, caching at multiple layers, and thorough capacity testing. Ensure observability and graceful degradation strategies.'
          }
        ]
      },
      {
        id: '9',
        name: 'System Design & Architecture',
        description: 'Design patterns, architectural decisions, and system design',
        cards: [
          {
            id: '9-1',
            question: 'Explain CQRS and where to use it.',
            hint: 'Separate read and write models',
            answer: 'CQRS separates command (write) and query (read) responsibilities into different models, enabling optimization for each. Use it where read and write workloads differ greatly or when denormalized read models improve performance. Often paired with event sourcing.'
          },
          {
            id: '9-2',
            question: 'What is eventual consistency?',
            hint: 'Replicas converge over time',
            answer: 'Eventual consistency means updates propagate asynchronously across replicas and the system converges to a consistent state over time. It\'s useful when availability and partition tolerance are prioritized over immediate consistency.'
          },
          {
            id: '9-3',
            question: 'How to ensure zero-downtime deployments?',
            hint: 'Blue/green or canary',
            answer: 'Use blue-green or canary deployments, rolling updates, health checks, and backward-compatible database migrations (expand-then-contract). Automate rollbacks and monitor key metrics to detect regressions early.'
          },
          {
            id: '9-4',
            question: 'Explain Saga pattern for distributed transactions.',
            hint: 'Series of local transactions with compensations',
            answer: 'Sagas break a distributed transaction into a series of local transactions; if one step fails, compensating transactions are executed to undo prior steps. It provides eventual consistency without 2-phase commit (2PC). Useful in microservices where distributed locking is impractical.'
          },
          {
            id: '9-5',
            question: 'How to do event sourcing?',
            hint: 'Store events, rebuild state by replaying',
            answer: 'Persist each state change as an immutable event in an event store. Rebuild current state by replaying events; use periodic snapshots to optimize performance. Event sourcing aids auditability and temporal queries but increases complexity.'
          },
          {
            id: '9-6',
            question: 'What is service discovery and options?',
            hint: 'DNS, Consul, Eureka, or k8s DNS',
            answer: 'Service discovery maps logical service names to running instances. In Kubernetes, use built-in DNS; for non-K8s environments use Consul or Eureka. Service meshes (Istio) add advanced routing, security, and observability.'
          }
        ]
      },
      {
        id: '10',
        name: 'Interview Preparation',
        description: 'Specific preparation for technical interviews and assessments',
        cards: [
          {
            id: '10-1',
            question: 'How to prepare for Suzuki Digital interview specifically?',
            hint: 'Focus on scale, integrations, and security',
            answer: 'Emphasize scalable APIs, integration patterns (3rd-party systems), cloud-native deployments, security best practices, and clear communication. Prepare examples around telemetry, booking/inventory systems, and enterprise integrations; be ready for scenario-based system design questions and optimization tasks.'
          }
        ]
      }
    ];
    setTopics(sampleTopics);
    localStorage.setItem('flashcard-topics', JSON.stringify(sampleTopics));
  };

  // Save topics to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('flashcard-topics', JSON.stringify(topics));
  }, [topics]);

  const addTopic = (topic) => {
    const newTopic = {
      ...topic,
      id: Date.now().toString(),
      cards: []
    };
    setTopics([...topics, newTopic]);
  };

  const updateTopic = (topicId, updatedTopic) => {
    setTopics(topics.map(topic => 
      topic.id === topicId ? { ...topic, ...updatedTopic } : topic
    ));
  };

  const deleteTopic = (topicId) => {
    setTopics(topics.filter(topic => topic.id !== topicId));
    if (selectedTopic?.id === topicId) {
      setSelectedTopic(null);
      setIsDeckView(false);
    }
  };

  const addCardToTopic = (topicId, card) => {
    const newCard = {
      ...card,
      id: `${topicId}-${Date.now()}`
    };
    setTopics(topics.map(topic => 
      topic.id === topicId 
        ? { ...topic, cards: [...topic.cards, newCard] }
        : topic
    ));
  };

  const updateCard = (topicId, cardId, updatedCard) => {
    setTopics(topics.map(topic => 
      topic.id === topicId 
        ? {
            ...topic,
            cards: topic.cards.map(card => 
              card.id === cardId ? { ...card, ...updatedCard } : card
            )
          }
        : topic
    ));
  };

  const deleteCard = (topicId, cardId) => {
    setTopics(topics.map(topic => 
      topic.id === topicId 
        ? {
            ...topic,
            cards: topic.cards.filter(card => card.id !== cardId)
          }
        : topic
    ));
  };

  const addAICardsToTopic = (topicId, aiCards) => {
    setTopics(topics.map(topic => 
      topic.id === topicId 
        ? {
            ...topic,
            cards: [...topic.cards, ...aiCards]
          }
        : topic
    ));
  };

  const startRevision = (topic) => {
    setSelectedTopic(topic);
    setIsDeckView(true);
  };

  const backToTopics = () => {
    setIsDeckView(false);
    setSelectedTopic(null);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">
          <span className="title-icon">🃏</span>
          FlashCards
        </h1>
        <p className="app-subtitle">Learning Made Beautiful</p>
        <button 
          className="reset-btn"
          onClick={() => {
            localStorage.removeItem('flashcard-topics');
            window.location.reload();
          }}
          title="Reset to built-in topics"
        >
          🔄 Reset to Built-in Topics
        </button>
        <button 
          className="reset-btn"
          onClick={() => {
            localStorage.clear();
            window.location.reload();
          }}
          title="Force complete reset"
          style={{ marginLeft: '1rem', backgroundColor: 'rgba(220, 38, 38, 0.1)', borderColor: '#dc2626', color: '#dc2626' }}
        >
          🗑️ Force Complete Reset
        </button>
      </header>

      <main className="app-main">
        {!isDeckView ? (
          <TopicPanel
            topics={topics}
            onAddTopic={addTopic}
            onUpdateTopic={updateTopic}
            onDeleteTopic={deleteTopic}
            onAddCard={addCardToTopic}
            onUpdateCard={updateCard}
            onDeleteCard={deleteCard}
            onStartRevision={startRevision}
            onAddAICards={addAICardsToTopic}
          />
        ) : (
          <FlashcardDeck
            topic={selectedTopic}
            onBack={backToTopics}
            onUpdateCard={updateCard}
            onDeleteCard={deleteCard}
          />
        )}
      </main>

      <footer className="app-footer">
        <p>&copy; 2024 FlashCards. Built with React & Framer Motion.</p>
      </footer>
    </div>
  );
}

export default App;
