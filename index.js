const taskArea = document.querySelector(".add");
const input = document.querySelector(".box");
const list = document.querySelector(".tasks");
const dateTime = new Date().toDateString();
document.querySelector("#dateTime").innerHTML = dateTime;

// Save tasks
const saveTasks = () => {
  const tasks = [];
  document.querySelectorAll(".todo").forEach((li) => {
    tasks.push({
      text: li.querySelector(".taskpara").textContent,
      done: li.querySelector(".taskpara").classList.contains("doneTask"),
    });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

// Add task to UI
const addTaskToUI = (taskText, isDone = false) => {
  let li = document.createElement("li");
  li.classList.add("todo");

  li.innerHTML = `
    <div class="list-item">
      <div class="task-text-wrapper">
        <p class="taskpara ${isDone ? "doneTask" : ""}">${taskText}</p>
      </div>
      <div class="task-buttons">
        <button class="done-btn ac-btn"><i class="fa-solid fa-check"></i></button>
        <button class="cross-btn remove-btn ac-btn"><i class="fa-solid fa-xmark"></i></button>
        <button class="edit-btn"><i class="fa-solid fa-pen"></i></button>
        <button class="del-btn"><i class="fa-solid fa-trash"></i></button>
      </div>
    </div>
  `;

  const taskPara = li.querySelector(".taskpara");
  const textWrapper = li.querySelector(".task-text-wrapper");

  // Done
  li.querySelectorAll(".ac-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    taskPara.classList.toggle("doneTask");
    li.querySelector(".done-btn").classList.toggle("remove-btn");
    li.querySelector(".cross-btn").classList.toggle("remove-btn");
    saveTasks();
  });
});


  // Edit
  li.querySelector(".edit-btn").addEventListener("click", (e) => {
    const btn = e.currentTarget;
    const icon = btn.querySelector("i");

    if (!li.classList.contains("editing")) {
      const inputEdit = document.createElement("input");
      inputEdit.type = "text";
      inputEdit.value = taskPara.textContent;
      inputEdit.classList.add("edit-input");

      textWrapper.appendChild(inputEdit);
      taskPara.style.display = "none";

      icon.className = "fa-solid fa-save";
      li.classList.add("editing");

      inputEdit.focus();
      inputEdit.addEventListener("keydown", (event) => {
        if (event.key === "Enter") btn.click();
      });
    } else {
      const inputEdit = li.querySelector(".edit-input");
      if (inputEdit.value.trim() !== "") {
        taskPara.textContent = inputEdit.value;
      }
      inputEdit.remove();
      taskPara.style.display = "block";

      icon.className = "fa-solid fa-pen";
      li.classList.remove("editing");

      saveTasks();
    }
  });

  // Delete
  li.querySelector(".del-btn").addEventListener("click", () => {
    li.remove();
    saveTasks();
  });

  list.appendChild(li);
};

// Create new task
const createTask = () => {
  const addTask = input.value.trim();
  if (!addTask) return;
  addTaskToUI(addTask);
  saveTasks();
  input.value = "";
};

// Load from localStorage
const loadTasks = () => {
  const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  storedTasks.forEach((task) => {
    addTaskToUI(task.text, task.done);
  });
};

taskArea.addEventListener("click", createTask);
document.addEventListener("keydown", (event) => {
  if (event.key === "Enter") createTask();
});
document.addEventListener("DOMContentLoaded", loadTasks);
