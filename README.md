# QuickNotes System Design

QuickNotes is a scalable, full-stack note-taking application designed to serve 1 million users. This repository contains the frontend API client that interacts with a RESTful backend, alongside the comprehensive system design documentation required to build the production backend.

## How to Run the API Client

1. Clone this repository to your local machine.
2. Open the `index.html` file in any modern web browser.
3. Alternatively, use the "Live Server" extension in VS Code for the best development experience.
4. Click "Load Notes" to fetch data from the JSONPlaceholder practice API.

## Documentation

Explore the system design documents in the `docs` folder:

- [API Design](docs/api-design.md) - RESTful endpoints, request/response examples, and error codes.
- [Data Model](docs/data-model.md) - Database schema, SQL queries, and indexing strategy.
- [Architecture](docs/architecture.md) - Scalability estimates, infrastructure diagram, and trade-offs.

## What I Learned

Building QuickNotes from a local app to a scalable system taught me three critical lessons:

1. **Statelessness is Key:** To scale horizontally behind a load balancer, app servers must not store user data locally; state must be managed by shared databases and caches.
2. **Database Optimization:** Using composite primary keys, proper indexing, and read replicas is essential for handling high read-to-write ratios without bottlenecking the primary database.
3. **Asynchronous Processing:** Offloading slow tasks (like file generation or emails) to a message queue keeps the main API responsive and improves the overall user experience.
