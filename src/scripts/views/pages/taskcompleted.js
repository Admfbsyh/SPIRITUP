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
                    <a href="#" class="email_user">
                    <span class="email" id="email"></span>
                    </a>
                    <a href="?#/dashboard" class="menu-item">Tugas</a>
                    <a href="?#/taskcompleted" class="menu-item is-active">Terselesaikan</a>
                    <a href="#" class="menu-item">Akun</a>
                    <a id="log-out" class="menu-item"><span>Keluar</span></a>
                </nav>
                </aside>
            <main class="content">
                <ul id="listcompleted" ></ul>
            </main>
        </div>
       
    `;
    },

    async afterRender() {
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            const menu_toggle = document.querySelector(".menu-toggle");
            const sidebar = document.querySelector(".sidebar");

            menu_toggle.addEventListener("click", () => {
            menu_toggle.classList.toggle("is-active");
            sidebar.classList.toggle("is-active");
            });
            
            if (user) {
                const { uid } = user;
                const taskCompletedContainer = document.getElementById('listcompleted');
                const renderTaskComplete = (display) => {
                    const listcom = document.createElement('li');
                    listcom.className = 'task_complete_li';
                    listcom.setAttribute('id', display.id);
                    const label = document.createElement('label');
                    const divTitle = document.createElement('div');
                    divTitle.className = 'titleComplete';
                    divTitle.setAttribute('id', `title${display.id}`);
                    divTitle.textContent = display.data().judulTask;
                    const divname = document.createElement('div');
                    divname.className = 'namechild';
                    divname.textContent = display.data().nama;
                    const prize = document.createElement('div');
                    prize.className = 'prize';
                    prize.textContent = display.data().prize;
                    const divDesc = document.createElement('img');
                    divDesc.setAttribute('src', display.data().Url);
                    const deleteBtn = document.createElement('button');
                    deleteBtn.className = 'delete';
                    deleteBtn.innerText = 'delete';
                    label.append(divTitle, prize, divname, divDesc);
                    listcom.append(label, deleteBtn);

                    deleteBtn.addEventListener('click', (e) => {
                        const id = e.target.parentElement.getAttribute('id');
                        deleteDoc(doc(db, 'bukti', id));
                    });
                    taskCompletedContainer.append(listcom);
                };

                const datacompleted = query(collection(db, 'bukti'), where('user', '==', uid));
                onSnapshot(datacompleted, (snapshot) => {
                    const changes = snapshot.docChanges();
                    console.log(changes);
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
    },
};

export default taskcompleted;
