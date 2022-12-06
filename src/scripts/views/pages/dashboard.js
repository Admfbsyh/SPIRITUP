/* eslint-disable no-alert */
/* eslint-disable no-unused-vars */
import '../component/headerNavDashboard';
import { initializeApp } from 'firebase/app';
import Swal from 'sweetalert2';
import {
    getFirestore, getDocs, onSnapshot, where, query, collection, addDoc, deleteDoc, deleteField,
} from 'firebase/firestore';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import firebaseConfig from '../../data/config';

const dashboard = {
    async render() {
        return `
        <header-nav-dashboard></header-nav-dashboard>
        <div class="container-dash">
          <section class="input-part">
            <h2>Tambahkan Task Baru</h2>
            <form id="inputTask">
              <div class="input_ inner_">
                <label for="inputTaskTitle">Judul Task</label>
                <input id="inputTaskTitle" type="text" required />
              </div>
              <div class="input_">0
                <label for="inputTaskDate">Tanggal</label>
                <input id="inputTaskDate" type="date" required />
              </div>
              <div class="input_">
                <label for="inputDescribeTask">Deskripsi Task</label>
                <input id="inputDescribeTask" type="text" required />
              </div>
              <div class="input_inline">
                <label for="inputTaskIsComplete">Task Important</label>
                <input id="inputTaskIsComplete" type="checkbox" />
              </div>
              <button id="taskSubmit" type="submit">
                Masukkan Task ke rak <span>Regular Task</span>
              </button>
            </form>
          </section>
        </div>

        <div class="container-dash">
          <section class="create_task">
            <h2>Regular Task</h2>
            <div id="incompleteCreatetaskfList" class="list_of_task"></div>
          </section>
          <section class="create_task">
            <h2>Important Task</h2>
            <div id="completeCreatetaskList" class="list_of_task"></div>
          </section>
        </div>
      </div>
    </div>
    <button class="open_button" onclick="openForm()">Buka Formulir</button>

    <div class="form_popup" id="myForm">
      <form class="form_container">
        <h2>Bukti Task</h2>

        <label for="nama"><b>Nama : </b></label>
        <input type="text" placeholder="Masukkan Nama" name="nama" required />
        <input type="file" id="file" accept="image/*" hidden />
        <div class="image_area" data-img=""></div>
        <button class="image_select">Select Image</button>
        <!-- <img id="myimg" /> <label id="upProgres"></label>
        <button id="upload" class="upl">Upload Foto</button> -->
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
                            alert('data added successfully');
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
                const unsubscribe = onSnapshot(q, (querySnapshot) => {
                    const cities = [];
                    querySnapshot.forEach((doc) => {
                        if (doc.data().isCompleted === true) {
                            const textTask = document.createElement('h2');
                            // eslint-disable-next-line no-multi-assign
                            document.getElementById('completeCreatetaskList').innerHTML = textTask.innerText = doc.data().judul;
                        }
                    });
                    console.log('mencoba: ', cities.join(', '));
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
