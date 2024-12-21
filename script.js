// move all html nodes to top
// create function for icon
// add validation for empty input
// move class values as function arguments

const form = document.querySelector("form#item-form");
const itemField = document.getElementById("item-input");
const ul = document.querySelector("ul");
const container = document.querySelector("div.container");

function createIcon(classes) {
  const i = document.createElement("i");
  i.className = classes;
  return i;
}

function createItemDelButton(classes) {
  const btn = document.createElement("button");
  btn.className = classes;
  const i = createIcon("fa-solid fa-xmark");
  btn.appendChild(i);
  return btn;
}

function createItem(name) {
  const li = document.createElement("li");
  const liText = document.createTextNode(name);
  li.appendChild(liText);
  btn = createItemDelButton("remove-item btn-link text-red");
  li.appendChild(btn);
  console.log(li);
  return li;
}

function createFilterDiv() {
  const div = document.createElement("div");
  div.className = "filter";

  const input = document.createElement("input");
  input.setAttribute("type", "text");
  input.setAttribute("class", "form-input-filter");
  input.setAttribute("id", "filter");
  input.setAttribute("placeholder", "Filter Items");

  div.appendChild(input);
  return div;
}

function createClearBtn() {
  const btn = document.createElement("button");
  btn.id = "clear";
  btn.className = "btn-clear";
  const btnText = document.createTextNode("Clear All");
  btn.appendChild(btnText);
  return btn;
}

function addItem(e) {
  e.preventDefault();

  const formData = new FormData(form);
  const newItem = formData.get("item");

  if (newItem.trim() === "") {
    alert("Item field can not be empty");
  } else {
    const li = createItem(newItem);
    const filterDiv = createFilterDiv();
    const clearBtn = createClearBtn();

    if (!ul.querySelector("li")) {
      container.insertBefore(filterDiv, ul);
      container.appendChild(clearBtn);
    }
    ul.appendChild(li);
    itemField.value = "";
  }
}

form.addEventListener("submit", addItem);
