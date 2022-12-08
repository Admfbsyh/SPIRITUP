/* eslint-disable max-len */
/* eslint-disable no-alert */
/* eslint-disable no-unused-vars */
import '../component/headerNavDashboard';
import { initializeApp } from 'firebase/app';
import Swal from 'sweetalert2';
import {
    getFirestore, onSnapshot, where, query, collection, addDoc, deleteDoc, doc,
} from 'firebase/firestore';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import firebaseConfig from '../../data/config';

const dashboard = {
    async render() {
        return `
        <header-nav-dashboard></header-nav-dashboard>
        <div class="app">
          <div class="menu-toggle">
            <div class="hamburger">
              <span></span>
            </div>
          </div>
    
          <!-- sidebar menu kiri -->
          <aside class="sidebar">
            <nav class="menu">
              <a href="#" class="email_user">
                <img src="../assets/useer.jpg" id="photo" class="user" />
                <input type="file" id="file" />
                <label for="file" id="uploadBtn">Choose Photo</label>
                <span class="email" id="email"></span>
              </a>
              <a href="?#/dashboard" class="menu-item is-active">Task</a>
              <a href="completed.html" class="menu-item">Completed</a>
              <a href="#" class="menu-item">Account</a>
              <a id="log-out" class="menu-item"><span>Log-out</span></a>
            </nav>
          </aside>
        <main class="content">

          <div class="container_form">
            <form id="inputTask">
              <div class="row">
                <div class="col-25">
                  <label for="inputTaskTitle">Judul Task</label>
                </div>
                <div class="col-75">
                  <input type="text" id="inputTaskTitle" placeholder="Judul task..." required>
                </div>
              </div>

              <div class="row">
                <div class="col-25">
                  <label for="inputTaskDate">Tanggal</label>
                </div>
                <div class="col-75">
                  <input type="date" id="inputTaskDate" required>
                </div>
              </div>

              <div class="row">
                <div class="col-25">
                  <label for="inputDescribeTask">Deskripsi Task</label>
                </div>
                <div class="col-75">
                  <textarea id="inputDescribeTask" placeholder="Deskripsi Task..." style="height:150px" required></textarea>
                </div>
              </div>

              <div class="input_inline">
                <label for="inputTaskIsComplete">Task Important</label>
                <input id="inputTaskIsComplete" type="checkbox" />
              </div>

              <div class="row">
                <button id="taskSubmit" type="submit">
                  Masukkan Task ke rak <b>Regular Task</b>
                </button>
              </div>
            </form>
          </div>

          <div class="container_list">
            <h3>Regular Task</h3>
            <ul id="incompleteCreatetaskfList" class="task_list"></ul>

            <h3>Important Task</h3>
            <ul id="completeCreatetaskList" class="task_list"></ul>
          </div>
        </main>
      </div>
    </div>
    <button class="open_button" onclick="openForm()">Buka Formulir</button>

    <div class="form_popup" id="myForm">
      <form class="form_container">
        <h2>Bukti Task</h2>

        <label for="nama"><b>Nama : </b></label>
        <input type="text" placeholder="Masukkan Nama" name="nama" required />
        <input type="file" id="file" accept="image/*" hidden />
        <div class="img_area" data-img=""></div>
        <button class="select_image">Select Image</button>
        <button class="upload_Image" id="upload">Upload</button>
        <button type="submit" class="btn">Kirim</button>
        <button type="button" class="btn_cancel">
          Tutup
        </button>
      </form>
    </div>
    `;
    },
    async afterRender() {
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);
        const auth = getAuth();
        const title = document.getElementById('inputTaskTitle');
        const date = document.getElementById('inputTaskDate');
        const description = document.getElementById('inputDescribeTask');
        const isCompleted = document.getElementById('inputTaskIsComplete');
        const taskSubmit = document.getElementById('inputTask');
        onAuthStateChanged(auth, (user) => {
            const menuToggle = document.querySelector('.menu-toggle');
            const sidebar = document.querySelector('.sidebar');

            menuToggle.addEventListener('click', () => {
                menuToggle.classList.toggle('is-active');
                sidebar.classList.toggle('is-active');
            });

            // Add Choosed File User Profile

            const imgDiv = document.querySelector('.email_user');
            const img = document.querySelector('#photo');
            const file = document.querySelector('#file');
            const uploadBtn = document.querySelector('#uploadBtn');

            imgDiv.addEventListener('mouseenter', () => {
                uploadBtn.style.display = 'block';
            });

            imgDiv.addEventListener('mouseleave', () => {
                uploadBtn.style.display = 'none';
            });

            file.addEventListener('change', () => {
                const choosedFile = this.files[0];

                if (choosedFile) {
                    const reader = new FileReader();

                    reader.addEventListener('load', () => {
                        img.setAttribute('src', reader.result);
                    });

                    reader.readAsDataURL(choosedFile);
                }
            });
            const selectImage = document.querySelector('.select_image');
            const inputFile = document.querySelector('#file');
            const imgArea = document.querySelector('.img_area');

            selectImage.addEventListener('click', () => {
                inputFile.click();
            });

            inputFile.addEventListener('change', () => {
                const image = this.files[0];
                if (image.size < 2000000) {
                    const reader = new FileReader();
                    reader.onload = () => {
                        const allImg = imgArea.querySelectorAll('img');
                        allImg.forEach((item) => item.remove());
                        const imgUrl = reader.result;
                        const imgbox = document.createElement('img');
                        imgbox.src = imgUrl;
                        imgArea.appendChild(imgbox);
                        imgArea.classList.add('active');
                        imgArea.dataset.imgbox = image.name;
                    };
                    reader.readAsDataURL(image);
                }
            });

            const closeForm = document.querySelector('.btn_cancel');
            closeForm.addEventListener('click', () => {
                document.getElementById('myForm').style.display = 'none';
            });
            if (user) {
                const { uid } = user;
                document.getElementById('email').innerHTML = `Hello, ${user.email}`;
                const taskImportant = document.querySelector('#completeCreatetaskList');
                const taskReguler = document.querySelector('#incompleteCreatetaskfList');

                const renderTask = (display) => {
                    const li = document.createElement('li');
                    li.className = 'task_item';
                    li.setAttribute('id', display.id);
                    const label = document.createElement('label');
                    const divTitle = document.createElement('div');
                    divTitle.className = 'title_data';
                    divTitle.textContent = display.data().judul;
                    const divDate = document.createElement('div');
                    divDate.className = 'date_data';
                    divDate.textContent = display.data().date;
                    const divDesc = document.createElement('div');
                    divDesc.className = 'desc_data';
                    divDesc.textContent = display.data().description;
                    const doneBtn = document.createElement('button');
                    doneBtn.className = 'done';
                    doneBtn.innerText = 'Done';
                    const deleteBtn = document.createElement('button');
                    deleteBtn.className = 'delete';
                    deleteBtn.innerText = 'delete';
                    label.append(divTitle, divDate, divDesc);
                    li.append(label, doneBtn, deleteBtn);

                    deleteBtn.addEventListener('click', (e) => {
                        const id = e.target.parentElement.getAttribute('id');
                        deleteDoc(doc(db, 'task', id));
                    });

                    doneBtn.addEventListener('click', (e) => {
                        document.getElementById('myForm').style.display = 'block';
                    });

                    if (display.data().isCompleted === true) {
                        taskImportant.append(li);
                    } else {
                        taskReguler.append(li);
                    }
                };

                taskSubmit.addEventListener('submit', (event) => {
                    event.preventDefault();
                    const ref = collection(db, 'task');
                    addDoc(ref, {
                        judul: title.value,
                        user: uid,
                        date: date.value,
                        description: description.value,
                        isCompleted: isCompleted.checked,
                    })
                        .then(() => {
                            Swal.fire({
                                title: 'Task added success',
                                text: 'tugas berhasil ditambahkan',
                                icon: 'success',
                                showCancelButton: false,
                                confirmButtonColor: '#3085d6',
                                cancelButtonColor: '#d33',
                                confirmButtonText: 'OK',
                            });
                        })
                        .catch((error) => {
                            Swal.fire({
                                icon: 'error',
                                title: 'Oops...',
                                text: error,
                            });
                        });
                });
                const q = query(collection(db, 'task'), where('user', '==', uid));
                onSnapshot(q, (snapshot) => {
                    const changes = snapshot.docChanges();
                    console.log(changes);
                    changes.forEach((change) => {
                        if (change.type === 'added') {
                            renderTask(change.doc);
                        } else if (change.type === 'removed') {
                            if (change.doc.data().isCompleted === true) {
                                const liImportant = taskImportant.querySelector(`[id=${change.doc.id}]`);
                                taskImportant.removeChild(liImportant);
                            } else {
                                const liReguler = taskReguler.querySelector(`[id=${change.doc.id}]`);

                                taskReguler.removeChild(liReguler);
                            }
                        }
                    });
                });
            } else {
                location.replace('/');
            }
        });
        const logout = document.getElementById('log-out');
        logout.addEventListener('click', () => {
            signOut(auth).then(() => {
                location.replace('/');
            }).catch((error) => {
                console.log(error);
            });
        });
    },
};

export default dashboard;
