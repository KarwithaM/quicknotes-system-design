# QuickNotes System Architecture

## Requirements

- **Functional:** Users can create, read, update, and delete notes. Notes can be tagged and searched. Data persists across devices.
- **Non-Functional:** High availability (99.9% uptime), low latency (<200ms for API responses), secure authentication, and scalable to 1 million users.

## Load Estimates (1 Million Users)

- **Daily Active Users (DAU):** 100,000 (10%)
- **Reads per second (Average):** ~500 req/sec (Fetching feeds, searching)
- **Reads per second (Peak):** ~2,500 req/sec (5x multiplier)
- **Writes per second (Average):** ~10 req/sec (Creating/updating notes)
- **Writes per second (Peak):** ~50 req/sec
- **Storage per year:** ~50 TB (Assuming 50KB average text note + metadata)

## Architecture Diagram

```text
                              [ User / Mobile Client ]
                                      |
                                      v
                                [ DNS Server ]
                               /              \
                      (Static) /                \ (API Traffic)
                             v                  v
                  [ CDN (HTML/CSS/JS) ]      [ Load Balancer ]
                                                    |
                                   +----------------+----------------+
                                   v                v                v
                            [ App Server 1]  [ App Server 2]  [ App Server 3]
                                   |                |                |
                                   +--------+-------+--------+-------+
                                            |                |
                                            v                v
                                    [ Cache (Redis) ]  [ Message Queue ]
                                            |                |
                                            v                v
                                    [ Read Replica ]   [ Worker (Emails/Exports) ]
                                            ^                |
                                            |                v
                                    [ Primary DB ]     [ Object Storage (S3) ]
```

## Component Explanations

- **DNS:** Translates the domain name (e.g., quicknotes.com) into IP addresses, routing static asset requests to the nearest CDN edge server and API requests to the Load Balancer.
- **CDN:** Serves static HTML, CSS, and JS files from edge servers to minimize latency.
- **Load Balancer:** Distributes API traffic evenly across stateless app servers to prevent overload.
- **App Servers:** Handle business logic and authentication; stateless to allow horizontal scaling.
- **Cache (Redis):** Stores frequently accessed note lists in memory to reduce database load.
- **Primary DB:** Handles all write operations (CREATE, UPDATE, DELETE) to ensure data consistency.
- **Read Replica:** Offloads the heavy volume of GET requests away from the primary database.
- **Message Queue & Worker:** Handles slow background tasks (like exporting notes to PDF) asynchronously.

## Request Flows

- **GET /notes:** Client -> DNS -> LB -> App Server -> Cache (Hit). If miss, App Server -> Read Replica -> Cache -> Client.
- **POST /notes:** Client -> DNS -> LB -> App Server -> Primary DB (Write) -> Invalidate Cache -> Client.

## Trade-offs & Avoiding SPOFs

1. **Eventual Consistency:** By using a Read Replica and Cache, a user might wait a few milliseconds to see their newly created note. We accept this trade-off for massive performance gains.
2. **Avoiding Single Points of Failure (SPOFs):** There is no single point of failure. If an App Server crashes, the Load Balancer routes traffic to the others. If the Primary DB fails, the Read Replica can be promoted. The CDN ensures the app remains partially functional even if the API goes down.
