/* eslint-disable camelcase */
/* eslint-disable no-unused-expressions */
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
import {
    getStorage, uploadBytesResumable, ref, getDownloadURL,
} from 'firebase/storage';
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
              <a href="?#/account" class="email_user">
                <span class="email" id="email"></span>
              </a>
              <a href="?#/dashboard" class="menu-item is-active">Tugas</a>
              <a href="?#/taskcompleted" class="menu-item">Terselesaikan</a>
              <a href="?#/account" class="menu-item">Akun</a>
              <a id="log-out" class="menu-item"><span>Keluar</span></a>
            </nav>
          </aside>
        <main class="content" id="mainContent">
          <h1 class="title_form">INPUT TUGAS</h1>
          <div class="container_form">
            <form id="inputTask">
              <div class="row">
                <div class="col-25">
                  <label for="inputTaskTitle">Judul Tugas</label>
                </div>
                <div class="col-75">
                  <input type="text" id="inputTaskTitle" placeholder="Judul tugas..." required>
                </div>
              </div>

              <div class="row">
                <div class="col-25">
                  <label for="prize">Hadiah</label>
                </div>
                <div class="col-75">
                  <input type="text" id="prize" placeholder="Masukan hadiah..." required>
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
                  <label for="inputDescribeTask">Deskripsi Tugas</label>
                </div>
                <div class="col-75">
                  <textarea id="inputDescribeTask" placeholder="Deskripsi tugas..." style="height:150px" required></textarea>
                </div>
              </div>

              <div class="input_inline">
                <label for="inputTaskIsComplete">Tugas Penting</label>
                <input id="inputTaskIsComplete" type="checkbox" />
              </div>

              <div class="row">
                <button id="taskSubmit" type="submit">
                  Masukkan Task ke rak
                </button>
              </div>
            </form>
          </div>

          <div class="container_list">
            <h3>Tugas Reguler</h3>
            <ul id="incompleteCreatetaskfList" class="task_list"></ul>

            <h3>Tugas Penting</h3>
            <ul id="completeCreatetaskList" class="task_list"></ul>
          </div>

        </main>
      </div>
    </div>

    <div class="form_popup" id="myForm">
      <form class="form_container" id="upload">
        <h2>Bukti Task</h2>
        <input type="text" placeholder="Masukkan nama..." id="inputName" required />
        <img class="img_area" id="myImg"> <label id="upProgress"></label>
        <div class="mb-3">
          <input class="form-control form-control-sm select_image" id="imgInput" type="file" accept="image/jpg, image/png" required />
        </div>
        <button type="submit" class="btn uploadImage" >Kirim</button>
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
        const prize = document.getElementById('prize');
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

            const imageInput = document.getElementById('imgInput');
            let files = [];
            let reader = new FileReader();
            imageInput.addEventListener('change', (e) => {
                files = e.target.files;
                reader = new FileReader();
                reader.addEventListener('load', () => {
                    document.getElementById('myImg').src = reader.result;
                });
                reader.readAsDataURL(files[0]);
            });

            if (user) {
                const { uid } = user;
                document.getElementById('email').innerHTML = `Hello, keluarga <br>${user.displayName}`;
                const taskImportant = document.querySelector('#completeCreatetaskList');
                const taskReguler = document.querySelector('#incompleteCreatetaskfList');
                const uploadImg = document.querySelector('#upload');
                const closeForm = document.querySelector('.btn_cancel');
                closeForm.addEventListener('click', () => {
                    document.getElementById('myForm').style.display = 'none';
                    location.reload();
                });

                const renderTask = (display) => {
                    const li = document.createElement('li');
                    li.className = 'task_item';
                    li.setAttribute('id', display.id);
                    const label = document.createElement('label');
                    const divTitle = document.createElement('div');
                    divTitle.className = 'title_data';
                    const divPrize = document.createElement('div');
                    divPrize.className = 'prize_data';
                    divPrize.setAttribute('id', `prize${display.id}`);
                    divTitle.setAttribute('id', `title${display.id}`);
                    divTitle.textContent = `${display.data().judul}`;
                    divPrize.textContent = `Hadiah: ${display.data().prize}`;
                    const divDate = document.createElement('div');
                    divDate.className = 'date_data';
                    divDate.textContent = display.data().date;
                    const divDesc = document.createElement('div');
                    divDesc.className = 'desc_data';
                    divDesc.textContent = `${display.data().description}`;
                    const br = document.createElement('br');
                    const doneBtn = document.createElement('button');
                    doneBtn.className = 'done';
                    doneBtn.innerText = 'Done';
                    const deleteBtn = document.createElement('button');
                    deleteBtn.innerText = 'delete';
                    label.append(divTitle, divPrize, divDate, divDesc);
                    li.append(label, br, doneBtn, deleteBtn);

                    deleteBtn.addEventListener('click', (e) => {
                        Swal.fire({
                            title: 'apakah kamu yakin?',
                            text: 'tugas ini akan hilang selamanya!',
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonColor: '#3085d6',
                            cancelButtonColor: '#d33',
                            confirmButtonText: 'Yes, delete it!',
                        }).then((result) => {
                            if (result.isConfirmed) {
                                Swal.fire(
                                    'Deleted!',
                                    'tugas berhasil dihapus',
                                    'success',
                                );
                                const id = e.target.parentElement.getAttribute('id');
                                deleteDoc(doc(db, 'task', id));
                            }
                        });
                    });

                    doneBtn.addEventListener('click', (e) => {
                        const storage = getStorage();
                        document.getElementById('myForm').style.display = 'block';
                        let imgUrl = '';
                        uploadImg.addEventListener('submit', (event) => {
                            event.preventDefault();
                            const judulId = document.getElementById(`title${display.id}`).innerHTML;
                            const prizeId = document.getElementById(`prize${display.id}`).innerHTML;
                            const imgName = document.getElementById('inputName').value;
                            const imgRef = ref(storage, `Images/${imgName}${judulId}.png`);
                            const uploadImage = uploadBytesResumable(imgRef, files[0]);
                            uploadImage.on(
                                'state_changed',
                                (snapshot) => {
                                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                                    document.getElementById('upProgress').innerHTML = `upload ${progress}% `;
                                },
                                (error) => {
                                    console.log(error);
                                },
                                () => {
                                    getDownloadURL(uploadImage.snapshot.ref).then((downloadURL) => {
                                        imgUrl = downloadURL;

                                        const dataBukti = collection(db, 'bukti');
                                        addDoc(dataBukti, {
                                            judulTask: judulId,
                                            nama: imgName,
                                            prize: prizeId,
                                            Url: imgUrl,
                                            user: uid,
                                        })
                                            .then(() => {
                                                Swal.fire({
                                                    title: 'selamat tugas berhasil dikerjakan',
                                                    text: 'beritahu orangtuamu untuk melihat menu terselesaikan',
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
                                },
                            );
                        });
                    });

                    if (display.data().isCompleted === true) {
                        taskImportant.append(li);
                    } else {
                        taskReguler.append(li);
                    }
                };

                taskSubmit.addEventListener('submit', (event) => {
                    event.preventDefault();
                    const taskData = collection(db, 'task');
                    addDoc(taskData, {
                        judul: title.value,
                        prize: prize.value,
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
