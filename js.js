let valueInput = "";
let input = null;
let readyTasks = [];
let newText = "";

window.onload = init = async () => {
  input = document.getElementById("input-task");
  input.addEventListener("change", updateValue);
  const resp = await fetch("http://localhost:8000/allTasks", {
    method: "GET",
  });

  let result = await resp.json();
  allTasks = result.data;
  render();
};

const updateValue = (event) => {
  valueInput = event.target.value;
};

const onClickBut = async () => {
  if (!(valueInput === "")) {
    const resp = await fetch("http://localhost:8000/createTask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        text: valueInput,
        isCheck: false,
      }),
    });

    const result = await resp.json();
    allTasks = result.data;
    valueInput = "";
    input.value = "";
    render();
  } else {
    alert("Введите значение");
  }
};

const render = () => {
  const tasks = document.getElementById("tasks");

  while (tasks.firstChild) {
    tasks.removeChild(tasks.firstChild);
  }

  allTasks.sort((a, b) => a.isCheck - b.isCheck)

  allTasks.map((item, index) => {
    const container = document.createElement("div");
    container.id = `task-${index}`;
    const tasktext = document.createElement("div");
    tasktext.classList.add("task-text");
    tasktext.innerText = item.text;
    const img = document.createElement("div");
    img.classList.add("img");
    const check = document.createElement("input");
    check.classList.add("check");
    check.type = "checkbox";
    check.checked = item.isCheck;
    check.onchange = () => checkFunction(index);
    const xButton = document.createElement("div");
    xButton.classList.add("x");
    const pen = document.createElement("div");
    pen.classList.add("pen");

    if (item.isCheck === false) {
      container.classList.add("task");
      img.appendChild(check);
      img.appendChild(pen);
      img.appendChild(xButton);
    } else {
      container.classList.add("task-good");
      img.appendChild(check);
      img.appendChild(xButton);
    }

    tasks.appendChild(container);
    container.appendChild(tasktext);
    container.appendChild(img);
    xButton.onclick = () => clickOnX(index);
    pen.onclick = () => changeTask(item, index);
  });
};

const changeTask = (item, index) => {
  const taskedit = document.createElement("div");
  taskedit.classList.add("taskedit");
  const task = document.getElementById(`task-${index}`);
  const img = document.querySelectorAll(`#task-${index}>.img`);
  const tasktext = document.querySelectorAll(`#task-${index}>.task-text`);
  img[0].remove();
  tasktext[0].remove();
  const ok = document.createElement("div");
  const dis = document.createElement("div");
  ok.classList.add("ok");
  dis.classList.add("dis");
  const changeBox = document.createElement("input");
  changeBox.value = allTasks[index].text;
  changeBox.type = "text";
  taskedit.prepend(ok);
  taskedit.prepend(dis);
  taskedit.prepend(changeBox);
  task.prepend(taskedit);
  changeBox.addEventListener("change", changeValue);

  ok.onclick = () => okClick(index, changeBox);
  dis.onclick = () => render();
};

const okClick = async (index, changeBox) => {
  if (!(newText === "")) {
    allTasks[index].text = newText;

    const { text, _id } = allTasks[index]

    const resp = await fetch("http://localhost:8000/changeTask", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        _id,
        text,
      }),
    });

    let result = await resp.json();
    allTasks = result.data;
    newText = "";
    changeBox.value = "";
    render();
  } else {
    alert("Нельзя оставить тоже самое или все удалить!");
  }
};

const changeValue = (event) => {
  newText = event.target.value;
};

const checkFunction = async (index) => {
  const { isCheck, _id } = allTasks[index];
  const resp = await fetch("http://localhost:8000/changeTask", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      _id,
      isCheck: !isCheck,
    }),
  });

  let result = await resp.json();
  allTasks = result.data;
  render();
};

const clickOnX = async (index) => {
  const { _id } = allTasks[index]
  const resp = await fetch(
    `http://localhost:8000/deleteTask?_id=${_id}`,
    {
      method: "DELETE",
    }
  );

  let result = await resp.json();
  allTasks = result.data;
  render();
};
