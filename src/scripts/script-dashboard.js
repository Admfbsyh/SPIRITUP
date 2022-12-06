/* eslint-disable no-unused-expressions */
/* eslint-disable eqeqeq */
/* eslint-disable no-unused-vars */
/* eslint-disable valid-typeof */
/* eslint-disable no-shadow */
/* eslint-disable camelcase */
/* eslint-disable no-alert */
/* eslint-disable no-use-before-define */
const incompleteCreatetaskfList = [];
const RENDER_EVENT = 'render-task';
const SAVED_EVENT = 'saved-task';
const STORAGE_KEY = 'SPIRITUP_APPS';

function generateId() {
    return +new Date();
}

function generateTaskObject(id, title, date, description, isCompleted) {
    return {
        id,
        title,
        date,
        description,
        isCompleted,
    };
}

function findTask(titleId) {
    for (const taskItem of incompleteCreatetaskfList) {
        if (taskItem.id === titleId) {
            return taskItem;
        }
    }
    return null;
}

function findTaskIndex(titleId) {
    for (index in incompleteCreatetaskfList) {
        if (incompleteCreatetaskfList[index].id === titleId) {
            return index;
        }
    }
    return -1;
}

function isStorageExist() {
    if (typeof Storage === undefined) {
        alert('Browser kamu tidak mendukung local storage');
        return false;
    }
    return true;
}

function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(incompleteCreatetaskfList);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    const data = JSON.parse(serializedData);

    if (data !== null) {
        for (const task of data) {
            incompleteCreatetaskfList.push(task);
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}

function makeTask(taskObject) {
    const textTask = document.createElement('h2');
    textTask.innerText = taskObject.title;

    const textDate = document.createElement('p');
    textDate.innerText = taskObject.date;

    const textDescription = document.createElement('p');
    textDescription.innerText = taskObject.description;

    const textnewTask = document.createElement('div');
    textnewTask.classList.add('task_item');
    textnewTask.append(textTask, textDate, textDescription);

    const task_shelf = document.createElement('div');
    task_shelf.classList.add('item', 'inner');

    task_shelf.append(textnewTask);
    task_shelf.setAttribute('id', `task-${taskObject.id}`);

    if (taskObject.isCompleted) {
    const undoButton = document.createElement("button");
    undoButton.classList.add("undo_button");

    undoButton.addEventListener("click", function () {
      alert("Apakah anda yakin ingin mengembalikan task ke Regular task?");
      undoTaskFromCompleted(taskObject.id);
    });

    const checkButton = document.createElement("button");
    checkButton.classList.add("check_button");

    checkButton.addEventListener("click", function () {
      alert(
        "Selamat, silahkan isi form bukti kegiatan untuk menuju ke completed"
      );
      addTaskToCompleted(taskObject.id);
    });

    const trashButton = document.createElement("button");
    trashButton.classList.add("trash_button");

    trashButton.addEventListener("click", function () {
      removeTaskFromCompleted(taskObject.id);
    });

    task_shelf.append(trashButton, undoButton, checkButton);
  } else {
    const checkButton = document.createElement("button");
    checkButton.classList.add("check_button");

    checkButton.addEventListener("click", function () {
      addTaskToCompleted(taskObject.id);
    });

    const trashButton = document.createElement("button");
    trashButton.classList.add("trash_button");

    trashButton.addEventListener("click", function () {
      removeTaskFromCompleted(taskObject.id);
    });

    const replaceButton = document.createElement("button");
    replaceButton.classList.add("replace_button");

    replaceButton.addEventListener("click", function () {
      alert(
        "Tugas anda akan dialihkan pada daftar task Important. Tekan OK untuk melanjutkan"
      );
      replaceTaskFromCompleted(taskObject.id);
    });

    task_shelf.append(trashButton, replaceButton, checkButton);
  }

  return task_shelf;
}

function addTask() {
    const inputTask = document.getElementById('inputTaskTitle').value;
    const inputDate = document.getElementById('inputTaskDate').value;
    const inputDescription = document.getElementById('inputDescribeTask').value;
    const isComplete = document.getElementById('inputTaskIsComplete').checked;

    const generatedID = generateId();
    const taskObject = generateTaskObject(
        generatedID,
        inputTask,
        inputDate,
        inputDescription,
        isComplete,
        false,
    );
    incompleteCreatetaskfList.push(taskObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    alert('Data Berhasil disimpan, Tekan OK untuk melanjutkan');
    saveData();
}

function changeText() {
    const checkbox = document.getElementById('inputTaskIsComplete');
    const textSubmit = document.getElementById('textSubmit');

    if (checkbox.checked == true) {
        textSubmit.innerText = 'Daftar Task';
    } else {
        textSubmit.innerText = 'Important Task';
    }
}

function checkButton() {
    const checkBox = document.querySelector('#inputTaskIsComplete');
    checkBox.addEventListener('checked', () => {
        if (checkBox == isComplete) addTaskToComplete(id);
    });
}

function addTaskToCompleted(titleId) {
    const titleTarget = findTask(titleId);
    if (titleTarget == null) return;

    titleTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function removeTaskFromCompleted(titleId) {
    const titleTarget = findTaskIndex(titleId);

    if (titleTarget === -1) return;

    incompleteCreatetaskfList.splice(titleTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));

    const removeTask = confirm('Apakah kamu yakin akan Menghapus Tugas?');
    if (removeTask) {
        window.location.pathname;
        saveData();
    } else {
        alert('Gagal menghapus Tugas. Silahkan muat ulang halaman');
    }
}

function undoTaskFromCompleted(titleId) {
    const titleTarget = findTask(titleId);

    if (titleTarget == null) return;

    titleTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function replaceTaskFromCompleted(titleId) {
    const titleTarget = findTask(titleId);
    if (titleTarget == null) return;

    titleTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

document.addEventListener('DOMContentLoaded', () => {
    const submitForm = document.getElementById('inputTask');
    submitForm.addEventListener('submit', (event) => {
        event.preventDefault();
        addTask();
    });

    if (isStorageExist()) {
        loadDataFromStorage();
    }
});

document.addEventListener(SAVED_EVENT, () => {
    console.log('Data berhasil di simpan.');
});

document.addEventListener(RENDER_EVENT, () => {
    const uncompletedTASKList = document.getElementById(
        'incompleteCreatetaskfList',
    );
    uncompletedTASKList.innerHTML = '';

    const completedTASKList = document.getElementById('completeCreatetaskList');
    completedTASKList.innerHTML = '';

    for (const taskItem of incompleteCreatetaskfList) {
        const taskElement = makeTask(taskItem);

        if (!taskItem.isCompleted) {
            uncompletedTASKList.append(taskElement);
        } else {
            completedTASKList.append(taskElement);
        }
    }
});
