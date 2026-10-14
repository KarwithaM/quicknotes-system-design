# QuickNotes API Design Document

## REST Endpoints

| Method   | Path                | Description                                                    | Success Status   |
| :------- | :------------------ | :------------------------------------------------------------- | :--------------- |
| `GET`    | `/notes`            | Retrieve a paginated list of notes for the authenticated user. | `200 OK`         |
| `GET`    | `/notes/{id}`       | Retrieve the details of a single note by its ID.               | `200 OK`         |
| `POST`   | `/notes`            | Create a new note for the authenticated user.                  | `201 Created`    |
| `PUT`    | `/notes/{id}`       | Update the title or body of an existing note.                  | `200 OK`         |
| `DELETE` | `/notes/{id}`       | Delete a specific note.                                        | `204 No Content` |
| `GET`    | `/users/{id}/notes` | Retrieve all notes belonging to a specific user (Admin only).  | `200 OK`         |

## Request and Response Examples

### Create a Note (`POST /notes`)

**Request Body:**

```json
{
  "title": "Project 2 Deadline",
  "body": "Submit the system design documents by Friday.",
  "category": "work"
}
```

**Response Body (201 Created):**

```json
{
  "id": 101,
  "title": "Project 2 Deadline",
  "body": "Submit the system design documents by Friday.",
  "category": "work",
  "createdAt": "2026-10-14T10:00:00Z"
}
```

### List Notes (`GET /notes`)

**Response Body (200 OK):**

```json
[
  {
    "id": 101,
    "title": "Project 2 Deadline",
    "body": "Submit the system design documents by Friday.",
    "category": "work"
  },
  {
    "id": 100,
    "title": "Buy groceries",
    "body": "Milk, eggs, bread.",
    "category": "personal"
  }
]
```

### Error Codes

- **400 Bad Request:** The client sent invalid data.  
  Example Body: `{"error": "Title is required and must be under 100 characters."}`
- **401 Unauthorized:** The user is not logged in or the JWT token is missing/invalid. Example Body: `{"error": "Authentication token is missing."}`
- **403 Forbidden:** The user is authenticated but lacks permission (e.g., trying to delete another user's note).
  Example Body: `{"error": "You do not have permission to modify this resource."}`
- **404 Not Found:** The requested note ID does not exist.
  Example Body: `{"error": "Note with ID 999 not found."}`
- **500 Internal Server Error:** An unexpected error occurred on the server.
  Example Body: `{"error": "An internal server error occurred. Please try again later."}`
