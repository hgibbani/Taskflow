# ⚡ TaskFlow — Keep Track of Your Day
TaskFlow is a modern, responsive, and minimalist To-Do List application built from scratch using only **semantic HTML5**, **Vanilla CSS**, and **Vanilla JavaScript** (no external libraries or frameworks). 
This project is designed as a portfolio-ready demonstration of core frontend development concepts, featuring soft gradient styling, a clean light theme, custom checkbox animations, and dynamic state management.
---
## 🚀 Features
### Core Operations
*   **Add Tasks**: Form-based creation with submission handling (Add button or pressing Enter).
*   **Inline Validation**: Prevents empty tasks and guides user inputs with real-time helper messages.
*   **Edit Tasks**: Modify existing items quickly via standard browser prompt dialogs.
*   **Delete Tasks**: Instantly purge tasks from the state and list.
*   **Complete Toggle**: Custom circular animated checkboxes with a strikethrough transition on completed task descriptions.
### Advanced Capabilities
*   **Search Bar**: Instant, case-insensitive, real-time search of task descriptions.
*   **Filters**: Filter tasks by their status tabs: **All**, **Pending**, or **Completed**.
*   **Live Counters**: Displays live metrics (Total, Completed, Pending tasks) in a top stats panel.
*   **Date Timestamps**: Automatically tags each task with its precise creation date and time (e.g., `Jul 2, 2026 12:01 PM`).
*   **LocalStorage Persistence**: Saves tasks in the browser permanently so they survive refreshes.
*   **Bulk Purge**: Clears all completed tasks in one click (requires confirmation).
*   **Responsive Web Design**: Mobile-first design that adapts beautifully to phones, tablets, and desktops.
---
## 🛠️ Technology Stack & Concepts Used
### HTML5
*   Semantic landmarks (`<header>`, `<main>`, `<section>`, `<footer>`)
*   Accessible form elements (`<input>`, `<button>`, `<label>`)
### CSS3 (Modern Styling)
*   **CSS Custom Properties (Variables)** for central color palette, radius, transitions, and shadow systems.
*   **Flexbox & CSS Grid** for fluid grid alignments.
*   **Glassmorphism** card effects and modern typography imports.
*   **Keyframes & Transitions** for checking off items, button hovers, and list animations.
### Vanilla JavaScript
*   **DOM Manipulation**: Dynamic creation, modifications, and element selections.
*   **Event Listeners**: Handling forms, checkbox toggling, tab clicks, inputs, and DOM completion state hooks.
*   **Data Structures**: Arrays of objects to store task state parameters.
*   **Array Methods**: Using `filter()`, `map()`, `find()`, and array loops.
*   **LocalStorage API**: JSON serialization/deserialization to preserve state.
---
## 📂 Project Structure
```text
TaskFlow/
│
├── index.html     # Page layout, SEO configuration, and static HTML structure
├── style.css      # Theme styles, responsiveness rules, layout, and keyframes
├── script.js     # State management, data persistence, event handlers, and rendering
└── README.md      # Documentation and startup guide
```
---
## 🏎️ Getting Started
### Method 1: Double-Click (Easiest)
1. Clone or download this project folder onto your local computer.
2. Locate `index.html` inside the folder.
3. Double-click the file to open it instantly in any modern web browser (Chrome, Safari, Edge, Firefox).
### Method 2: Local Server (Recommended)
If you have Python installed, you can spin up a lightweight local server to preview the app:
1. Open your terminal or Command Prompt in the project folder.
2. Run the following command:
    ```bash
    python -m http.server 8000
    ```
3. Open your browser and navigate to:
    ```text
    http://localhost:8000
    ```
---
## 📝 Code Highlights
### LocalStorage Serialization
We persist user tasks inside the browser dynamically:
```javascript
// Convert array to a JSON string and store it
const saveToLocalStorage = () => {
  localStorage.setItem('taskflow_tasks', JSON.stringify(tasks));
};
// Retrieve and parse string back into a JS array
const loadFromLocalStorage = () => {
  const storedTasks = localStorage.getItem('taskflow_tasks');
  tasks = storedTasks ? JSON.parse(storedTasks) : [];
};
```
### Dynamic Rendering & Event Attaching
To avoid memory leaks and ensure direct element association, event listeners are attached inline during DOM generation:
```javascript
filteredTasks.forEach(task => {
  const li = document.createElement('li');
  li.className = `task-item ${task.completed ? 'completed' : ''}`;
  li.innerHTML = `
    <!-- HTML structures... -->
  `;
  // Explicit listeners for each task element
  li.querySelector('.task-checkbox').addEventListener('change', () => toggleComplete(task.id));
  li.querySelector('.edit-btn').addEventListener('click', () => editTask(task.id));
  li.querySelector('.delete-btn').addEventListener('click', () => deleteTask(task.id));
  taskList.appendChild(li);
});
```
