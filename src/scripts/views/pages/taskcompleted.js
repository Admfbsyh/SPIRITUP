/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
import '../component/headerNavDashboard';
import { initializeApp } from 'firebase/app';
import Swal from 'sweetalert2';
import {
    getFirestore, onSnapshot, where, query, collection, deleteDoc, doc,
} from 'firebase/firestore';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import {
    getStorage, ref, deleteObject,
} from 'firebase/storage';
import firebaseConfig from '../../data/config';

const taskcompleted = {
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
                    <a href="?#/dashboard" class="menu-item">Tugas</a>
                    <a href="?#/taskcompleted" class="menu-item is-active">Terselesaikan</a>
                    <a href="?#/account" class="menu-item">Akun</a>
                    <a id="log-out" class="menu-item"><span>Keluar</span></a>
                </nav>
                </aside>
            <main class="content" id="mainContent">
                <h1 class="foto_bukti">FOTO BUKTI</h1>
                <div id="listcompleted" class="completed_container"></div>
            </main>
        </div>
       
    `;
    },

    async afterRender() {
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                document.getElementById('email').innerHTML = `Hello, keluarga <br>${user.displayName}`;
                const menuToggle = document.querySelector('.menu-toggle');
                const sidebar = document.querySelector('.sidebar');

                menuToggle.addEventListener('click', () => {
                    menuToggle.classList.toggle('is-active');
                    sidebar.classList.toggle('is-active');
                });

                const { uid } = user;
                const taskCompletedContainer = document.getElementById('listcompleted');
                const renderTaskComplete = (display) => {
                    const listcom = document.createElement('div');
                    listcom.className = 'completed_content';
                    listcom.setAttribute('id', display.id);
                    const divTitle = document.createElement('div');
                    divTitle.className = 'titleComplete';
                    divTitle.setAttribute('id', display.data().judulTask);
                    divTitle.textContent = `anak anda sudah menyelesaikan tugas ${display.data().judulTask}`;
                    const divname = document.createElement('div');
                    divname.className = 'namechild';
                    divname.setAttribute('id', display.data().nama);
                    divname.textContent = display.data().nama;
                    const prize = document.createElement('div');
                    prize.className = 'prize';
                    prize.textContent = `dengan begitu beri ${display.data().prize} sesuai janji anda kepada`;
                    const divImg = document.createElement('img');
                    divImg.setAttribute('src', display.data().Url);
                    divImg.setAttribute('alt', `kegiatan ${display.data().judulTask}`);
                    const deleteBtn = document.createElement('button');
                    deleteBtn.className = 'accept';
                    deleteBtn.innerText = 'Accept';
                    const view_photo = document.createElement('a');
                    view_photo.setAttribute('target', '_blank');
                    view_photo.href = display.data().Url;
                    view_photo.innerText = 'View Photo';
                    const br = document.createElement('br');
                    listcom.append(divImg, divTitle, prize, divname, br, view_photo, deleteBtn);

                    deleteBtn.addEventListener('click', (e) => {
                        Swal.fire({
                            title: 'kamu yakin?',
                            text: 'kamu yakin memberikan hadiahnya sekarang, tugas terselesaikan ini akan hilang',
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonColor: '#3085d6',
                            cancelButtonColor: '#d33',
                            confirmButtonText: 'Yes, Accept it!',
                        }).then((result) => {
                            if (result.isConfirmed) {
                                Swal.fire(
                                    'Accepted!',
                                    'tepati janji anda beri hadiahnya',
                                    'success',
                                );
                                const judulTaskId = document.getElementById(display.id).children;
                                const idTask = e.target.parentElement.getAttribute('id');
                                deleteDoc(doc(db, 'bukti', idTask));
                                const storage = getStorage();
                                const desertRef = ref(storage, `Images/${judulTaskId[3].id}${judulTaskId[1].id}.png`);

                                deleteObject(desertRef).then(() => {
                                    // File deleted successfully
                                }).catch((error) => {
                                    console.log(error);
                                });
                            }
                        });
                    });
                    taskCompletedContainer.append(listcom);
                };

                const datacompleted = query(collection(db, 'bukti'), where('user', '==', uid));
                onSnapshot(datacompleted, (snapshot) => {
                    const changes = snapshot.docChanges();
                    changes.forEach((change) => {
                        if (change.type === 'added') {
                            renderTaskComplete(change.doc);
                        } else if (change.type === 'removed') {
                            const deleteTaskComplete = taskCompletedContainer.querySelector(`[id=${change.doc.id}]`);
                            taskCompletedContainer.removeChild(deleteTaskComplete);
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

export default taskcompleted;
