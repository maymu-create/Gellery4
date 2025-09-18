// 📝 Notes
function addNote() {
  const input = document.getElementById('noteInput');
  const list = document.getElementById('noteList');
  if (input.value.trim() !== "") {
    const li = document.createElement('li');
    li.textContent = input.value;
    list.appendChild(li);
    input.value = "";
  }
}

// ✅ To-Do
function addTodo() {
  const input = document.getElementById('todoInput');
  const list = document.getElementById('todoList');
  if (input.value.trim() !== "") {
    const li = document.createElement('li');
    li.textContent = input.value;
    li.onclick = () => li.style.textDecoration = "line-through";
    list.appendChild(li);
    input.value = "";
  }
}

// 📒 Account Table
function addRecord() {
  const date = document.getElementById('dateInput').value;
  const desc = document.getElementById('descInput').value;
  const income = document.getElementById('incomeInput').value;
  const expense = document.getElementById('expenseInput').value;
  if (date && desc) {
    const table = document.getElementById('accountTable');
    const row = table.insertRow();
    row.insertCell(0).innerText = date;
    row.insertCell(1).innerText = desc;
    row.insertCell(2).innerText = income;
    row.insertCell(3).innerText = expense;
  }
}

// 🧮 Calculator
let calcExp = "";

function pressCalc(val) {
  calcExp += val;
  document.getElementById("calcDisplay").value = calcExp;
}

function calculate() {
  try {
    document.getElementById("calcDisplay").value = eval(calcExp);
    calcExp = "";
  } catch {
    document.getElementById("calcDisplay").value = "Error";
  }
}

function clearCalc() {
  calcExp = "";
  document.getElementById("calcDisplay").value = "";
}

// Toggle Popup
function toggleCalculator() {
  const popup = document.getElementById("calculatorPopup");
  popup.style.display = popup.style.display === "block" ? "none" : "block";
}

// 🔹 Dragging Calculator
let dragOffsetX, dragOffsetY;

function dragStart(e) {
  const popup = document.getElementById("calculatorPopup");
  dragOffsetX = e.clientX - popup.offsetLeft;
  dragOffsetY = e.clientY - popup.offsetTop;
  document.onmousemove = dragMove;
  document.onmouseup = dragEnd;
}

function dragMove(e) {
  const popup = document.getElementById("calculatorPopup");
  popup.style.left = (e.clientX - dragOffsetX) + "px";
  popup.style.top = (e.clientY - dragOffsetY) + "px";
}

function dragEnd() {
  document.onmousemove = null;
  document.onmouseup = null;
}