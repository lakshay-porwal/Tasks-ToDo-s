'use strict'

const btn = document.getElementById('btnAdd');
const input_task = document.getElementById('taskInput');
const todo_container = document.getElementById('todo-container');

// Store tasks and their status (1 = normal, -1 = cut)
let tasks = [];
let Taskstatus = [];

function done(event) {
  console.log('done button clicked');
  const taskText = event.target.parentElement.previousElementSibling;
  const old_task = taskText.textContent.replace(/<\/?s>/g, '').trim();  // clean <s> tag

  const index = tasks.indexOf(old_task);

  if (index !==-1) {
    if (Taskstatus[index] === 1) {
      Taskstatus[index] = -1;
      taskText.innerHTML = `<s>${tasks[index]}</s>`;
    } 
    sendToLocalStorage();
  }
}

function edit(event) {
  console.log('edit button clicked');
  const taskText = event.target.parentElement.previousElementSibling;
  const old_text = taskText.textContent.replace(/<\/?s>/g, '').trim();
  const edit_text = prompt("Edit the task", old_text)?.trim();

  const index = tasks.indexOf(old_text);
  if (index !== -1 && edit_text !== "") {
    tasks[index] = edit_text;
    Taskstatus[index] = 1; // Reset as normal 
    taskText.innerHTML = edit_text;
    sendToLocalStorage();
  } else {
    alert("Enter valid data...");
  }
}

function remove(event) {
  console.log('delete button clicked');
  const taskText = event.target.parentElement.previousElementSibling;
  const text = taskText.textContent.replace(/<\/?s>/g, '').trim();

  const index = tasks.indexOf(text);
  if (index !== -1) {
    tasks.splice(index, 1);
    Taskstatus.splice(index, 1);
    event.target.parentElement.parentElement.remove();
    sendToLocalStorage();
  }
}

function sendToLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  localStorage.setItem("Taskstatus", JSON.stringify(Taskstatus));
  console.log("Tasks and status saved to localStorage.");
}

function getFromLocalStorage() {
  const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const storedStatus = JSON.parse(localStorage.getItem("Taskstatus")) || [];

  tasks = storedTasks;
  Taskstatus = storedStatus;

  console.log("Tasks fetched from localStorage");

  for (let i = 0; i < tasks.length; i++) {
    const new_task = document.createElement('div');
    new_task.className = "create_div";

    // Use <s> tag if task was marked done
    const taskTextHTML = Taskstatus[i] === -1 ? `<s>${tasks[i]}</s>` : tasks[i];

    new_task.innerHTML = `
      <p class="new_task_text">${taskTextHTML}</p>
      <div class="create_div_inside">
        <button onclick="done(event)">Done</button>
        <button onclick="edit(event)">Edit</button>
        <button onclick="remove(event)">Delete</button>
      </div>`;
      
    todo_container.append(new_task);
  }
}

function create_task() {
  console.log('Add button clicked');
  const input = input_task.value.trim();
  if (input === "") return;

  tasks.push(input);
  Taskstatus.push(1); // 1 means normal
  sendToLocalStorage();

  const new_task = document.createElement('div');
  new_task.className = "create_div";
  new_task.innerHTML = `
    <p class="new_task_text">${input}</p>
    <div class="create_div_inside">
      <button onclick="done(event)">Done</button>
      <button onclick="edit(event)">Edit</button>
      <button onclick="remove(event)">Delete</button>
    </div>`;
    
  todo_container.append(new_task);
  input_task.value = "";
}

btn.addEventListener('click', create_task);

// Show saved tasks when window loads
window.onload = getFromLocalStorage;
