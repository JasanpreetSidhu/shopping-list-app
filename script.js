const form = document.querySelector('form#item-form');
const itemField = document.getElementById('item-input');
const ul = document.querySelector('ul');
const container = document.querySelector('div.container');
const states = { ADD: 'add item', EDIT: 'edit item' };
let appState = states.ADD;

window.addEventListener('DOMContentLoaded', initializeApp);

function initializeApp() {
	// Add event listeners
	form.addEventListener('submit', processForm);
	ul.addEventListener('click', processExistingItem);
	// add localstorage items to DOM
	displayStoredItems();
}

function resetAppState() {
	if (appState === states.EDIT) {
		appState = states.ADD;
		const updateButton = form.querySelector('#update-button');
		const addButton = createAddButton();
		updateButton.replaceWith(addButton);
		ul.querySelectorAll('li').forEach((li) =>
			li.classList.remove('inEditState')
		);
		form.querySelector('#cancel-button').remove();
		itemField.value = '';
	}
}

function processForm(e) {
	e.preventDefault();
	switch (appState) {
		case states.EDIT:
			const itemEditing = ul.querySelector('li.inEditState');
			processItemDeletion(itemEditing);
			processNewItem(e);
			resetAppState();
			break;

		default:
			processNewItem();
			break;
	}
}

function createAddButton() {
	const button = document.createElement('button');
	button.setAttribute('type', 'submit');
	button.id = 'add-button';
	button.classList.add('btn');
	const addIcon = document.createElement('i');
	addIcon.className = 'fa-solid fa-plus';
	button.appendChild(addIcon);
	const text = document.createTextNode('  Add Item');
	button.appendChild(text);
	button.style.backgroundColor = 'black';
	return button;
}

function getStoredItems() {
	let storedItems = JSON.parse(localStorage.getItem('items'));
	if (!storedItems) {
		return [];
	} else {
		return storedItems;
	}
}

function displayStoredItems() {
	const items = getStoredItems();
	items.forEach((itemName) => addItemToDOM(itemName));
}

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
	resetAppState();
	if (window.confirm('All items will be deleted permanently')) {
		(function deleteFromDOM() {
			while (ul.firstChild) {
				ul.removeChild(ul.firstChild);
			}
		})();
		// Delete All Items From Storage
		localStorage.removeItem('items');
		deleteFilterAndClearAllButton();
	}
}

function createClearAllBtn() {
	const btn = document.createElement('button');
	btn.id = 'clear';
	btn.className = 'btn-clear';
	const btnText = document.createTextNode('Clear All');
	btn.appendChild(btnText);
	btn.addEventListener('click', deleteAllItems);
	return btn;
}

function storeItem(newItemName) {
	let currentItems = getStoredItems();

	currentItems.push(newItemName);
	localStorage.setItem('items', JSON.stringify(currentItems));
}

function addItemToDOM(itemName) {
	const li = createItem(itemName);

	// checking app state of no items before adding requested new item
	if (!ul.querySelector('li')) {
		const filterDiv = createFilterDiv();
		const clearBtn = createClearAllBtn();
		container.insertBefore(filterDiv, ul);
		container.appendChild(clearBtn);
	}
	ul.appendChild(li);
}

function processNewItem(e) {
	const formData = new FormData(form);
	const newItemName = formData.get('item');

	if (newItemName.trim() === '') {
		alert('Item field can not be empty');
	} else {
		addItemToDOM(newItemName);
		storeItem(newItemName);
		itemField.value = '';
	}
}

function deleteFilterAndClearAllButton() {
	let filterField = document.querySelector('div.filter');
	let clearButton = document.querySelector('button#clear');

	filterField.remove();
	clearButton.remove();
}

function deleteItemFromStorage(itemName) {
	const savedItems = getStoredItems();
	const itemIndex = savedItems.indexOf(itemName);
	savedItems.splice(itemIndex, 1);
	localStorage.setItem('items', JSON.stringify(savedItems));
}

function processItemDeletion(itemNode) {
	const itemName = itemNode.textContent;
	if (
		appState === states.EDIT ||
		window.confirm(`${itemName} will be deleted from the list`)
	) {
		itemNode.remove();
		deleteItemFromStorage(itemName);
		console.log(itemName);
	}
	// checking app state that all items are deleted
	if (!ul.firstChild) {
		deleteFilterAndClearAllButton();
	}
}

function createUpdateButton() {
	const updateButton = document.createElement('button');
	updateButton.setAttribute('type', 'submit');
	updateButton.id = 'update-button';
	updateButton.classList.add('btn');
	const updateIcon = document.createElement('i');
	updateIcon.className = 'fas fa-edit';
	updateButton.appendChild(updateIcon);
	const text = document.createTextNode('  Update Item');
	updateButton.appendChild(text);
	updateButton.style.backgroundColor = '#1974D2';
	return updateButton;
}

function createCancelButton() {
	const button = document.createElement('button');
	button.setAttribute('type', 'reset');
	button.id = 'cancel-button';
	button.classList.add('btn');
	const text = document.createTextNode('Cancel');
	button.appendChild(text);
	button.style.backgroundColor = 'black';
	button.addEventListener('click', resetAppState);
	return button;
}

function changeAppToEditState(liNodeToEdit) {
	appState = states.EDIT;
	console.log(liNodeToEdit);
	liNodeToEdit.classList.add('inEditState');
	itemField.value = liNodeToEdit.textContent;
	const addItemButton = form.querySelector('#add-button');
	const updateButton = createUpdateButton();
	addItemButton.replaceWith(updateButton);
	const cancelButton = createCancelButton();
	form.querySelector('.buttons').appendChild(cancelButton);
}

function processExistingItem(e) {
	const deleteBtn = e.target.parentElement;
	console.log(deleteBtn.classList);
	resetAppState();
	if (deleteBtn.classList.contains('remove-item')) {
		processItemDeletion(deleteBtn.parentElement);
	} else if (e.target.tagName === 'LI') {
		changeAppToEditState(e.target);
	}
}
