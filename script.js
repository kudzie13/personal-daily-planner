// ===============================
// ELEMENT REFERENCES
// ===============================
const taskText = document.getElementById("task-text");
const taskTime = document.getElementById("task-time");
const addTaskBtn = document.getElementById("add-task");
const taskList = document.getElementById("task-list");
const emptyState = document.getElementById("empty-state");
const dateEl = document.getElementById("current-date");

// ===============================
// DISPLAY CURRENT DATE
// ===============================
const today = new Date();
dateEl.textContent = today.toDateString();

// ===============================
// LOCAL STORAGE
// ===============================
const STORAGE_KEY = "dailyPlannerTasks";

let tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

// ===============================
// RENDER TASKS
// ===============================
function renderTasks(filter = "all") {
  taskList.innerHTML = "";

  let filteredTasks = tasks;

  if (filter !== "all") {
    filteredTasks = tasks.filter(task => task.period === filter);
  }

  emptyState.style.display = filteredTasks.length === 0 ? "block" : "none";

  filteredTasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = "task-item" + (task.completed ? " completed" : "");

    li.innerHTML = `
      <div class="task-info">
        <strong>${task.text}</strong>
        <span class="task-time">${task.time}</span>
      </div>
      <div class="task-actions">
        <button class="complete">✔</button>
        <button class="delete">✖</button>
      </div>
    `;

    // Complete task
    li.querySelector(".complete").addEventListener("click", () => {
      tasks[index].completed = !tasks[index].completed;
      saveTasks();
      renderTasks(filter);
    });

    // Delete task
    li.querySelector(".delete").addEventListener("click", () => {
      tasks.splice(index, 1);
      saveTasks();
      renderTasks(filter);
    });

    taskList.appendChild(li);
  });
}

// ===============================
// ADD TASK
// ===============================
addTaskBtn.addEventListener("click", () => {
  const text = taskText.value.trim();
  const time = taskTime.value;

  if (!text || !time) {
    alert("Please enter both task and time.");
    return;
  }

  const hour = parseInt(time.split(":")[0]);
  let period = "morning";
  if (hour >= 12 && hour < 17) period = "afternoon";
  if (hour >= 17) period = "evening";

  tasks.push({
    text,
    time,
    completed: false,
    period
  });

  taskText.value = "";
  taskTime.value = "";

  saveTasks();
  renderTasks();
});

// ===============================
// FILTER BUTTONS
// ===============================
document.querySelectorAll(".filter-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const filter = btn.dataset.filter;
    renderTasks(filter);
  });
});

// ===============================
// SAVE TO LOCAL STORAGE
// ===============================
function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

// ===============================
// INITIAL LOAD
// ===============================
renderTasks();
