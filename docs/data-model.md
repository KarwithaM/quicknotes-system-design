# QuickNotes Data Model

## Entities and Relationships

- **users**: Stores account information.
- **notes**: Stores the actual note content. A user can have _many_ notes (One-to-Many).
- **tags**: Stores unique tag names (e.g., "urgent", "study").
- **note_tags**: A join table resolving the Many-to-Many relationship between notes and tags.

## CREATE TABLE Statements

```sql
CREATE TABLE users (
  id    INTEGER PRIMARY KEY,
  name  TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE
);

CREATE TABLE notes (
  id         INTEGER PRIMARY KEY,
  user_id    INTEGER NOT NULL,
  title      TEXT NOT NULL,
  body       TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE tags (
  id    INTEGER PRIMARY KEY,
  name  TEXT NOT NULL UNIQUE
);

CREATE TABLE note_tags (
  note_id  INTEGER NOT NULL,
  tag_id   INTEGER NOT NULL,
  PRIMARY KEY (note_id, tag_id),
  FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id)  REFERENCES tags(id)  ON DELETE CASCADE
);
```

## Example SQL Queries

1. **Get all notes for a specific user:**

```sql
SELECT title, body, created_at FROM notes WHERE user_id = 1 ORDER BY created_at DESC;
```

2. **Get all notes tagged "urgent" (JOIN):**

```sql
SELECT notes.title FROM notes JOIN note_tags ON note_tags.note_id = notes.id JOIN tags ON tags.id = note_tags.tag_id WHERE tags.name = 'urgent';
```

3. **Count notes per user:**

```sql
SELECT users.name, COUNT(notes.id) AS note_count FROM users LEFT JOIN notes ON notes.user_id = users.id GROUP BY users.id;
```

## Indexing

I would add the following index:

```sql
CREATE INDEX idx_notes_user_id ON notes(user_id);
```

**Reason:** The most common query is fetching a user's notes. Indexing `user_id` allows the database to instantly find a user's notes without scanning the entire table.

## SQL vs. NoSQL Choice

I would choose a **Relational (SQL) database** for QuickNotes. Note-taking requires strict data integrity, structured relationships (users to notes to tags), and ACID compliance to ensure notes are never lost during a save operation. While NoSQL is great for unstructured data, the predictable, highly relational nature of user accounts and their notes makes SQL the safer, more robust choice.
