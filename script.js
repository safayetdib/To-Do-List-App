const taskInput = document.querySelector('.task-input input');
const addButton = document.querySelectorAll('.text-input, .add-button');
const taskBox = document.querySelector('.task-box');
const filters = document.querySelectorAll('.filters span');
const clearAllBtn = document.querySelector('.clear-button');
const pendingTasks = document.querySelector('.footer-note');

// get data from localstorage
let todos = JSON.parse(localStorage.getItem('todo-list'));
// for edit task in task menu
let editId;
let isEditedTask = false;

showTask('all');

// event listeners
addButton.forEach((addEvent) => {
	if (addEvent.id == 'text-input') {
		addEvent.addEventListener('keyup', (e) => taskEvents(e));
	} else {
		addEvent.addEventListener('click', (e) => taskEvents(e));
	}
});
filters.forEach((btn) => {
	btn.addEventListener('click', () => {
		document.querySelector('span.active').classList.remove('active');
		btn.classList.add('active');
		showTask(btn.id);
		taskInput.focus();
	});
});
pendingTasks.addEventListener('click', filterBtn);
clearAllBtn.addEventListener('click', clearAll);

// functions
function taskEvents(e) {
	let inputValue = taskInput.value.trim();
	if ((e.key == 'Enter' || e.type == 'click') && inputValue) {
		// if task is not edited or isEditedTask is false
		if (!isEditedTask) {
			// if todos doesn't exist in localstorage pass empty array
			if (!todos) {
				todos = [];
			}
			// add new task to localstorage
			let taskInfo = { name: inputValue, status: 'pending' };
			todos.push(taskInfo);
		} else {
			// if isEditedTask is true
			isEditedTask = false;
			todos[editId].name = inputValue;
		}
		localStorage.setItem('todo-list', JSON.stringify(todos));
		// show tasks in task-box
		showTask('all');
		// clear inputfield
		taskInput.value = '';
	}
	taskInput.focus();
}

function showTask(filter) {
	let li = '';
	let numOfPendingTasks = 0;
	if (todos) {
		todos.forEach((currentValue, index) => {
			let isCompleted = currentValue.status == 'completed' ? 'checked' : '';

			if (filter == currentValue.status || filter == 'all') {
				li += `<li class="task">
								<div class="task-container">
									<label for="${index}">
										<input type="checkbox" onclick="updateStatus(this)" id="${index}" ${isCompleted} />
										<p id="text${index}" class ="${isCompleted}">${currentValue.name}</p>
									</label>
									<div class="settings">
										<i onclick="showMenu(this)" class="fa-solid fa-ellipsis"></i>
										<!-- edit and delete button -->
										<ul class="task-menu">
											<li onclick="editTask(${index}, '${currentValue.name}')"><i class="fa-regular fa-pen-to-square"></i> Edit</li>
											<li onclick="deleteTask(${index})"><i class="fa-regular fa-trash-can"></i> Delete</li>
										</ul>
									</div>
								</div>
							</li>`;
			}
			// number of pending tasks
			if (todos[index].status == 'pending') {
				numOfPendingTasks++;
			}
		});
	}

	// if filter is all
	if (filter == 'all') {
		filters.forEach((btn) => {
			if (btn.id == 'all') {
				document.querySelector('span.active').classList.remove('active');
				btn.classList.add('active');
			}
		});
	}

	// show data to task box
	taskBox.innerHTML = li || `<span>You don't have any task here</span>`;

	// number of pending tasks
	let footerNote = pendingTasks.lastElementChild;
	if (numOfPendingTasks == 0) {
		footerNote.innerText = `You have no pending tasks`;
	} else {
		footerNote.innerText = `You have ${numOfPendingTasks} pending tasks`;
	}
}

function filterBtn() {
	filters.forEach((btn) => {
		if (btn.id == 'pending') {
			document.querySelector('span.active').classList.remove('active');
			btn.classList.add('active');
		}
	});
	showTask('pending');
	taskInput.focus();
}

function updateStatus(selectedTask) {
	// get the p element that contains task details
	let task = selectedTask.parentElement.lastElementChild;
	// update the status of selected task
	if (selectedTask.checked) {
		task.classList.add('checked');
		todos[selectedTask.id].status = 'completed';
	} else {
		task.classList.remove('checked');
		todos[selectedTask.id].status = 'pending';
	}
	showTask('all');

	// update localstorage
	localStorage.setItem('todo-list', JSON.stringify(todos));
}

function showMenu(selectedtask) {
	// get the task-menu, last child of paren div settings
	let taskMenu = selectedtask.parentElement.lastElementChild;
	// show or hide task-menu
	taskMenu.classList.add('show');
	document.addEventListener('click', (e) => {
		if (e.target.tagName != 'I' || e.target != selectedtask) {
			taskMenu.classList.remove('show');
		}
	});
}

function editTask(taskIndex, taskValue) {
	editId = taskIndex;
	isEditedTask = true;
	taskInput.value = taskValue;
	todos[taskIndex].status = 'pending';
	taskInput.focus();
}

function deleteTask(index) {
	// remove the specified task
	todos.splice(index, 1);
	// update localstorage
	localStorage.setItem('todo-list', JSON.stringify(todos));
	// show updated task list
	showTask('all');
}

function clearAll() {
	// remove the specified task
	todos.splice(0, todos.length);
	// update localstorage
	localStorage.setItem('todo-list', JSON.stringify(todos));
	// show updated task list
	showTask('all');
	taskInput.focus();
}
