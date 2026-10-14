const API_URL = "https://jsonplaceholder.typicode.com/posts";

const loadBtn = document.querySelector("#load-btn");
const statusText = document.querySelector("#status");
const noteForm = document.querySelector("#note-form");
const titleInput = document.querySelector("#title-input");
const bodyInput = document.querySelector("#body-input");
const submitBtn = document.querySelector("#submit-btn");
const notesList = document.querySelector("#notes-list");

// Reusable async request function
async function request(url, options = {}) {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Request failed:", error);
    throw error;
  }
}

// Helper to update UI status
function setStatus(message, type) {
  statusText.textContent = message;
  statusText.className = ""; // clear old classes
  if (type) statusText.classList.add(`status-${type}`);
}

// TASK 1: Load Notes (GET)
async function loadNotes() {
  setStatus("Loading notes...", "loading");
  loadBtn.disabled = true;
  notesList.innerHTML = "";

  try {
    // Fetch 10 notes from JSONPlaceholder
    const notes = await request(`${API_URL}?_limit=10`);
    
    if (notes.length === 0) {
      setStatus("No notes found.", "loading");
      notesList.innerHTML = "<li class='note-item'>No notes to display.</li>";
    } else {
      notes.forEach(note => renderNote(note));
      setStatus(`Loaded ${notes.length} notes from the server.`, "success");
    }
  } catch (error) {
    setStatus("Failed to load notes. Please try again.", "error");
  } finally {
    loadBtn.disabled = false;
  }
}

// TASK 2: Create Note (POST)
noteForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  
  const title = titleInput.value.trim();
  const body = bodyInput.value.trim();

  // Validation
  if (!title) {
    setStatus("Error: Title is required.", "error");
    return;
  }
  if (title.length > 100) {
    setStatus("Error: Title must be 100 characters or fewer.", "error");
    return;
  }

  setStatus("Creating note...", "loading");
  submitBtn.disabled = true;

  try {
    const newNoteData = { title: title, body: body, userId: 1 };
    const createdNote = await request(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newNoteData)
    });

    // JSONPlaceholder returns a fake ID (usually 101). 
    // We render it at the top of the list to simulate persistence in the UI.
    renderNote(createdNote, true); 
    setStatus(`Note created (status 201, id ${createdNote.id}).`, "success");
    
    // Clear form
    titleInput.value = "";
    bodyInput.value = "";
  } catch (error) {
    setStatus("Failed to create note. Please try again.", "error");
  } finally {
    submitBtn.disabled = false;
  }
});

// TASK 3: Delete Note (DELETE)
async function deleteNote(id, listItemElement) {
  if (!confirm("Are you sure you want to delete this note?")) return;

  setStatus("Deleting note...", "loading");
  
    // Note: JSONPlaceholder doesn't actually delete POSTed notes on the server, 
   // but we remove it from the DOM to simulate a successful deletion for the user.
  try {
    await request(`${API_URL}/${id}`, { method: "DELETE" });
    
    // JSONPlaceholder doesn't actually delete our POSTed notes, 
    // but we remove it from the DOM to simulate a successful deletion for the user.
    listItemElement.remove();
    setStatus(`Note ${id} deleted successfully.`, "success");
    
    if (notesList.children.length === 0) {
      notesList.innerHTML = "<li class='note-item'>No notes to display.</li>";
    }
  } catch (error) {
    setStatus("Failed to delete note. Please try again.", "error");
  }
}

// Helper to render a single note to the DOM
function renderNote(note, prepend = false) {
  const li = document.createElement("li");
  li.classList.add("note-item");

  const titleEl = document.createElement("div");
  titleEl.classList.add("note-title");
  titleEl.textContent = note.title; // Safe from XSS

  const bodyEl = document.createElement("div");
  bodyEl.classList.add("note-body");
  bodyEl.textContent = note.body || "(No body)";

  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("delete-btn");
  deleteBtn.textContent = "Delete";
  deleteBtn.addEventListener("click", () => deleteNote(note.id, li));

  li.appendChild(titleEl);
  li.appendChild(bodyEl);
  li.appendChild(deleteBtn);

  if (prepend) {
    notesList.prepend(li);
  } else {
    notesList.appendChild(li);
  }
}

// Initial setup
loadBtn.addEventListener("click", loadNotes);