

let tasks = [];


let currentFilter = 'all';
 
let searchQuery = '';

let editingTaskId = null;
// ==========================================================================
// 2. DOM Elements References
// 

const todoForm = document.getElementById('todoForm');
const taskInput = document.getElementById('taskInput');
const validationError = document.getElementById('validationError');
const searchInput = document.getElementById('searchInput');
const filterBtns = document.querySelectorAll('.filter-btn');
const taskList = document.getElementById('taskList');
const emptyState = document.getElementById('emptyState');
const clearCompletedBtn = document.getElementById('clearCompletedBtn');
// Counters
const totalCounter = document.getElementById('totalCounter');
const pendingCounter = document.getElementById('pendingCounter');
const completedCounter = document.getElementById('completedCounter');
// ==========================================================================
// 3. LocalStorage Handlers
// ==========================================================================
/**
 * Saves the current tasks array to browser's LocalStorage.
 * Converts the array to a JSON string first.
 */
const saveToLocalStorage = () => {
  localStorage.setItem('taskflow_tasks', JSON.stringify(tasks));
};
/**
 * Loads tasks from browser's LocalStorage.
 * Parses the JSON string back into a JS array. Default to empty array if none exist.
 */
const loadFromLocalStorage = () => {
  const storedTasks = localStorage.getItem('taskflow_tasks');
  tasks = storedTasks ? JSON.parse(storedTasks) : [];
};
// ==========================================================================
// 4. Core Task Operations
// ==========================================================================
/**
 * Adds a new task to the state.
 * Validates the input to prevent empty tasks and trims extra whitespace.
 * @param {Event} e - Form submission event
 */
const addTask = (e) => {
  e.preventDefault(); // Prevent page refresh on form submit
  
  const textValue = taskInput.value.trim();
  // Input validation: Check if input is empty
  if (!textValue) {
    validationError.textContent = 'Task description cannot be empty!';
    taskInput.classList.add('error');
    return;
  }
  // Clear validation styling if valid
  validationError.textContent = '';
  taskInput.classList.remove('error');
  // Create a new task object
  const newTask = {
    id: Date.now(), // Generate unique ID using current timestamp
    text: textValue,
    completed: false,
    createdAt: new Date().toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  };
  // Insert to the front of the array (most recent first)
  tasks.unshift(newTask);
  // Reset task input field
  taskInput.value = '';
  taskInput.focus();
  // Persist and update UI
  saveToLocalStorage();
  updateTaskCounter();
  renderTasks();
};
/**
 * Toggles the completion status of a task by its unique ID.
 * @param {number} id - Task identifier
 */
const toggleComplete = (id) => {
  // Map through tasks and flip completed status for the target task
  tasks = tasks.map(task => 
    task.id === id ? { ...task, completed: !task.completed } : task
  );
  saveToLocalStorage();
  updateTaskCounter();
  renderTasks();
};
/**
 * Deletes a task from the list.
 * Applies a visual fade-out animation before removing the element from the DOM.
 * @param {number} id - Task identifier
 * @param {HTMLElement} taskElement - The task LI element in the DOM
 */
const deleteTask = (id, taskElement) => {
  // Apply visual fade-out state
  taskElement.classList.add('removing');
  // Wait for the CSS transition to complete (250ms) before deleting from state
  setTimeout(() => {
    // Filter out the selected task
    tasks = tasks.filter(task => task.id !== id);
    
    // If the deleted task was being edited, exit edit mode
    if (editingTaskId === id) {
      editingTaskId = null;
    }
    saveToLocalStorage();
    updateTaskCounter();
    renderTasks();
  }, 250);
};
/**
 * Updates the text content of a task.
 * @param {number} id - Task identifier
 * @param {string} newText - New task text
 */
const editTask = (id, newText) => {
  const trimmedText = newText.trim();
  
  if (!trimmedText) {
    alert('Task text cannot be empty.');
    return;
  }
  // Update text of task in place
  tasks = tasks.map(task => 
    task.id === id ? { ...task, text: trimmedText } : task
  );
  editingTaskId = null; // Exit edit mode
  saveToLocalStorage();
  renderTasks();
};
// ==========================================================================
// 5. Utility & Render Functions
// ==========================================================================
/**
 * Calculates current tasks counts (total, pending, completed)
 * and updates the text nodes of the counters in the UI.
 */
const updateTaskCounter = () => {
  const total = tasks.length;
  const completed = tasks.filter(task => task.completed).length;
  const pending = total - completed;
  totalCounter.textContent = total;
  pendingCounter.textContent = pending;
  completedCounter.textContent = completed;
  // Disable "Clear Completed" button if no completed tasks exist
  clearCompletedBtn.disabled = completed === 0;
};
/**
 * Filters and searches tasks array based on active filters.
 * Returns the computed subset of tasks.
 */
const getFilteredTasks = () => {
  return tasks.filter(task => {
    // 1. Filter by status tabs
    const matchesFilter = 
      currentFilter === 'all' ||
      (currentFilter === 'pending' && !task.completed) ||
      (currentFilter === 'completed' && task.completed);
    // 2. Filter by search input
    const matchesSearch = task.text.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });
};
/**
 * Builds the tasks UI dynamically.
 * Appends HTML lists containing task information, inline editors, and controls.
 */
const renderTasks = () => {
  // Clear the list container to avoid duplication
  taskList.innerHTML = '';
  
  const filteredTasks = getFilteredTasks();
  // If there are no tasks in the current view, show empty state message
  if (filteredTasks.length === 0) {
    emptyState.style.display = 'flex';
    // Tailor empty state text depending on active filter or search
    if (searchQuery) {
      emptyState.querySelector('.empty-title').textContent = 'No search results';
      emptyState.querySelector('.empty-desc').textContent = 'Try adjusting your search query.';
    } else if (currentFilter === 'completed') {
      emptyState.querySelector('.empty-title').textContent = 'No completed tasks';
      emptyState.querySelector('.empty-desc').textContent = 'Get to work and complete some tasks!';
    } else if (currentFilter === 'pending') {
      emptyState.querySelector('.empty-title').textContent = 'No pending tasks';
      emptyState.querySelector('.empty-desc').textContent = 'Everything is completed. Great job!';
    } else {
      emptyState.querySelector('.empty-title').textContent = 'All caught up!';
      emptyState.querySelector('.empty-desc').textContent = 'Enjoy your day or add some new tasks to get started.';
    }
  } else {
    // Hide empty state if there are tasks to show
    emptyState.style.display = 'none';
  }
  // Create a DocumentFragment to batch update the DOM for better performance
  const fragment = document.createDocumentFragment();
  filteredTasks.forEach(task => {
    const li = document.createElement('li');
    li.className = `task-item ${task.completed ? 'completed' : ''}`;
    
    // Attach database ID to the DOM element
    li.dataset.id = task.id;
    // Check if the current task is being edited
    if (editingTaskId === task.id) {
      // 1. RENDER INLINE EDIT VIEW
      li.innerHTML = `
        <div class="edit-input-group">
          <input type="text" class="edit-input" value="${task.text.replace(/"/g, '&quot;')}" maxlength="100">
          <div class="edit-actions">
            <button class="action-btn save-btn" title="Save">💾</button>
            <button class="action-btn cancel-btn" title="Cancel">❌</button>
          </div>
        </div>
      `;
      // Set focus to the edit input and position cursor at the end
      const editInput = li.querySelector('.edit-input');
      editInput.focus();
      editInput.setSelectionRange(editInput.value.length, editInput.value.length);
      // Event Listeners for Inline Edit Input (Enter / Escape keys)
      editInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          editTask(task.id, editInput.value);
        } else if (e.key === 'Escape') {
          editingTaskId = null;
          renderTasks();
        }
      });
      // Save button click
      li.querySelector('.save-btn').addEventListener('click', () => {
        editTask(task.id, editInput.value);
      });
      // Cancel button click
      li.querySelector('.cancel-btn').addEventListener('click', () => {
        editingTaskId = null;
        renderTasks();
      });
    } else {
      // 2. RENDER NORMAL VIEW
      li.innerHTML = `
        <div class="task-content-wrapper">
          <label class="checkbox-container">
            <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
            <span class="custom-checkmark"></span>
            <span class="checkbox-spacer"></span>
          </label>
          <div class="task-details">
            <span class="task-text">${task.text}</span>
            <span class="task-date">📅 ${task.createdAt}</span>
          </div>
        </div>
        <div class="task-actions">
          <button class="action-btn edit-btn" title="Edit Task">✏️</button>
          <button class="action-btn delete-btn" title="Delete Task">🗑️</button>
        </div>
      `;
      // Event Listener: Checkbox Toggling
      li.querySelector('.task-checkbox').addEventListener('change', () => {
        toggleComplete(task.id);
      });
      // Event Listener: Edit Button Click
      li.querySelector('.edit-btn').addEventListener('click', () => {
        editingTaskId = task.id;
        renderTasks();
      });
      // Event Listener: Delete Button Click
      li.querySelector('.delete-btn').addEventListener('click', () => {
        deleteTask(task.id, li);
      });
    }
    fragment.appendChild(li);
  });
  // Batch append the fragment to the list DOM element
  taskList.appendChild(fragment);
};
// ==========================================================================
// 6. Global Event Listeners
// ==========================================================================
// Add task form submission
todoForm.addEventListener('submit', addTask);
// Clear completed button: filters out completed tasks
clearCompletedBtn.addEventListener('click', () => {
  if (confirm('Are you sure you want to clear all completed tasks?')) {
    tasks = tasks.filter(task => !task.completed);
    saveToLocalStorage();
    updateTaskCounter();
    renderTasks();
  }
});
// Search input keyup/change
searchInput.addEventListener('input', (e) => {
  searchQuery = e.target.value;
  renderTasks();
});
// Filters Tab configuration
filterBtns.forEach(btn => {
  btn.addEventListener('click', (e) => {
    // Remove active class from previous filter button
    filterBtns.forEach(b => b.classList.remove('active'));
    
    // Set clicked button to active
    e.target.classList.add('active');
    
    // Update filter state and render
    currentFilter = e.target.dataset.filter;
    renderTasks();
  });
});
// Validation reset on input typing
taskInput.addEventListener('input', () => {
  if (taskInput.value.trim() !== '') {
    validationError.textContent = '';
    taskInput.classList.remove('error');
  }
});
// ==========================================================================
// 7. Initial App Bootstrapping
// ==========================================================================
const init = () => {
  loadFromLocalStorage();
  updateTaskCounter();
  renderTasks();
};
// Run initialize when DOM content is fully parsed
document.addEventListener('DOMContentLoaded', init);
