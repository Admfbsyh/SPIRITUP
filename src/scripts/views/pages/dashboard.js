/* eslint-disable max-len */
/* eslint-disable no-alert */
/* eslint-disable no-unused-vars */
import '../component/headerNavDashboard';
import { initializeApp } from 'firebase/app';
import Swal from 'sweetalert2';
import {
    getFirestore, doc, getDocs, onSnapshot, where, query, collection, addDoc, deleteDoc, deleteField,
} from 'firebase/firestore';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import firebaseConfig from '../../data/config';
import { tasks } from '../template/template-cover';

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
                <img src="../public/assets/useer.jpg" id="photo" class="user" />
                <input type="file" id="file" />
                <label for="file" id="uploadBtn">Choose Photo</label>
                <span class="email" id="email"></span>
              </a>
              <a href="dashboard.html" class="menu-item is-active">Task</a>
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
        <button type="submit" class="btn">Kirim</button>
        <button type="button" class="btn cancel" onclick="closeForm()">
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
        const taskSubmit = document.getElementById('taskSubmit');
        onAuthStateChanged(auth, (user) => {
            if (user) {
                const { uid } = user;
                document.getElementById('email').innerHTML = `Hello, ${user.email}`;
                taskSubmit.addEventListener('click', () => {
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
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    location.reload();
                                }
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
                const taskImportant = document.querySelector('#completeCreatetaskList');
                const taskReguler = document.querySelector('#incompleteCreatetaskfList');
                const q = query(collection(db, 'task'), where('user', '==', uid));
                const unsubscribe = onSnapshot(q, (querySnapshot) => {
                    querySnapshot.forEach((display) => {
                        if (display.data().isCompleted === true) {
                            taskImportant.innerHTML += tasks(display);
                            const deleteTask = document.getElementById('delete');
                            deleteTask.addEventListener('click', () => {
                                try {
                                    deleteDoc(doc(db, 'task', display.id));
                                } catch (e) {
                                    console.log(e);
                                }
                            });
                        } else {
                            taskReguler.innerHTML += tasks(display);
                            const deleteTask = document.getElementById('delete');
                            deleteTask.addEventListener('click', () => {
                                try {
                                    const result = deleteDoc(doc(db, 'task', display.id));
                                    console.log(result);
                                } catch (e) {
                                    console.log(e);
                                }
                            });
                        }
                    });
                });
                // eslint-disable-next-line no-inner-declarations
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
