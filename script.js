// removing items using cross icon and clear All button

const form = document.querySelector('form#item-form');
const itemField = document.getElementById('item-input');
const ul = document.querySelector('ul');
const container = document.querySelector('div.container');

function createIcon(classes) {
	const i = document.createElement('i');
	i.className = classes;
	return i;
}

function createItemDelButton(classes) {
	const btn = document.createElement('button');
	btn.className = classes;
	const i = createIcon('fa-solid fa-xmark');
	btn.appendChild(i);
	btn.addEventListener('keydown', (e) =>
		e.key === 'Enter' ? e.target.firstChild.click() : null
	);
	return btn;
}

function createItem(name) {
	const li = document.createElement('li');
	const liText = document.createTextNode(name);
	li.appendChild(liText);
	btn = createItemDelButton('remove-item btn-link text-red');
	li.appendChild(btn);
	console.log(li);
	return li;
}

function filterItems(e) {
	const keyword = e.target.value.toLowerCase();
	const items = document.querySelectorAll('li');
	items.forEach((item) => {
		const itemName = item.textContent.toLowerCase();
		if (!itemName.includes(keyword)) {
			item.style.display = 'none';
		} else {
			item.style.display = 'flex';
		}
	});
}

function createFilterDiv() {
	const div = document.createElement('div');
	div.className = 'filter';

	const input = document.createElement('input');
	input.setAttribute('type', 'text');
	input.setAttribute('class', 'form-input-filter');
	input.setAttribute('id', 'filter');
	input.setAttribute('placeholder', 'Filter Items');
	input.addEventListener('input', filterItems);
	div.appendChild(input);
	return div;
}

function deleteAllItems(e) {
	while (ul.firstChild) {
		ul.removeChild(ul.firstChild);
	}
	deleteFilterAndClearAllButton();
}

function createClearBtn() {
	const btn = document.createElement('button');
	btn.id = 'clear';
	btn.className = 'btn-clear';
	const btnText = document.createTextNode('Clear All');
	btn.appendChild(btnText);
	btn.addEventListener('click', deleteAllItems);
	return btn;
}

function addItem(e) {
	e.preventDefault();

	const formData = new FormData(form);
	const newItem = formData.get('item');

	if (newItem.trim() === '') {
		alert('Item field can not be empty');
	} else {
		const li = createItem(newItem);

		// checking app state of no items before adding requested new item
		if (!ul.querySelector('li')) {
			const filterDiv = createFilterDiv();
			const clearBtn = createClearBtn();
			container.insertBefore(filterDiv, ul);
			container.appendChild(clearBtn);
		}
		ul.appendChild(li);
		itemField.value = '';
	}
}

function deleteFilterAndClearAllButton() {
	let filterField = document.querySelector('div.filter');
	let clearButton = document.querySelector('button#clear');

	filterField.remove();
	clearButton.remove();
}

function deleteItem(e) {
	const deleteBtn = e.target.parentElement;
	console.log(deleteBtn.classList);

	if (deleteBtn.classList.contains('remove-item')) {
		if (window.confirm('Are you sure?')) {
			deleteBtn.parentElement.remove();
		}
		// checking app state that all items are deleted
		if (!ul.firstChild) {
			deleteFilterAndClearAllButton();
		}
	}
}

form.addEventListener('submit', addItem);
ul.addEventListener('click', deleteItem);
