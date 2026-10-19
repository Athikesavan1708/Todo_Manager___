
const taskInput = document.getElementById("taskinput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const clearCompletedBtn = document.getElementById("clearCompletedBtn");

const totalCount = document.getElementById("totalcount");
const completedCount = document.getElementById("completedcount");
const pendingCount = document.getElementById("pendingcount");

// Load tasks from localStorage
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Update task counters
function updateCounters() {
    totalCount.textContent = tasks.length;

    const completed = tasks.filter(task => task.completed).length;

    completedCount.textContent = completed;
    pendingCount.textContent = tasks.length - completed;
}

// Display tasks
function displayTasks() {
    taskList.innerHTML = "";

    tasks.forEach((task, index) => {
        const li = document.createElement("li");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;

        const span = document.createElement("span");
        span.textContent = task.text;

        if (task.completed) {
            span.classList.add("completed");
        }

        // Complete or uncomplete task
        checkbox.addEventListener("change", function () {
            tasks[index].completed = checkbox.checked;
            saveTasks();
            displayTasks();
        });

        // Edit button
        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";

        editBtn.addEventListener("click", function () {
            const newText = prompt("Edit your task:", task.text);

            if (newText === null) return;

            const updatedText = newText.trim();

            if (updatedText === "") {
                alert("Please enter a task");
                return;
            }

            const duplicate = tasks.some((item, i) =>
                i !== index &&
                item.text.toLowerCase() === updatedText.toLowerCase()
            );

            if (duplicate) {
                alert("Task already exists");
                return;
            }

            tasks[index].text = updatedText;

            saveTasks();
            displayTasks();
        });

        // Delete button
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";

        deleteBtn.addEventListener("click", function () {
            tasks.splice(index, 1);
            saveTasks();
            displayTasks();
        });

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(editBtn);
        li.appendChild(deleteBtn);

        taskList.appendChild(li);
    });

    updateCounters();
}

// Add task
addTaskBtn.addEventListener("click", function () {
    const taskText = taskInput.value.trim();

    if (taskText === "") {
        alert("Please enter a task");
        return;
    }

    const duplicate = tasks.some(task =>
        task.text.toLowerCase() === taskText.toLowerCase()
    );

    if (duplicate) {
        alert("Task already exists");
        return;
    }

    tasks.push({
        text: taskText,
        completed: false
    });

    saveTasks();
    displayTasks();

    taskInput.value = "";
    taskInput.focus();
});

// Clear completed tasks
clearCompletedBtn.addEventListener("click", function () {
    tasks = tasks.filter(task => !task.completed);

    saveTasks();
    displayTasks();
});

// Display saved tasks when page loads
displayTasks();
