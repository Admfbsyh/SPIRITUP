/* eslint-disable max-len */
/* eslint-disable no-alert */
/* eslint-disable no-unused-vars */
import '../component/headerNavDashboard';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import {
    getDatabase, child, ref, get,
} from 'firebase/database';
import firebaseConfig from '../../data/config';

const account = {
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
              <a href="?#/taskcompleted" class="menu-item">Terselesaikan</a>
              <a href="?#/account" class="menu-item is-active">Akun</a>
              <a id="log-out" class="menu-item"><span>Keluar</span></a>
            </nav>
          </aside>
          <div class="content">
        <div class="profile_edit">
          <h1>Edit Account</h1>
          <div class="avatar_user">
            <img src="./Asset/img/noprofil.jpg" id="photo" />
            <input type="file" id="file" />
            <label for="file" id="UploadBtn">Upload Image</label>
            <span class="avatar"></span>
          </div>
          <div class="menu_edit">
            <h2>Personal Information</h2>
            <h3>Name</h3>
            <input type="text" placeholder="Masukkan Nama" />
            <h3>Email</h3>
            <input type="text" placeholder="Masukkan Email" />
          </div>
          <button class="btn save">Save</button>
          <button class="btn cancel">Cancel</button>
        </div>
        <div class="content">
          <div class="intruksi">
            <h2>Cara Kerja Penggunaan Aplikasi SPIRIT-UP</h2>
            <h4>Intruksi</h4>
            <p>
              1. User diwajibkan untuk Registrasi di awal halaman guna mengakses
              izin menggunakan aplikasi, dan login setelah melakukan registrasi
            </p>
            <p>
              2. Menu "Task" Digunakan user untuk membuat sebuah task/kegiatan
              untuk dikerjakan kemudian sesuai dengan data yang dimasukkan,
              (Data terdiri dari : Judul Kegiatan, Jadwal Kegiatan, serta
              Deskripsi Kegiatan), kemudian user bisa memilih kategori kegiatan
              termasuk kegiatan biasa/Reguler Task atau Kegiatan
              Penting/Important Task
            </p>
            <p>
              3. Menu Completed digunakan untuk memberitahu informasi detail
              mengenai history kegiatan yang telah dikerjaan beserta nilai point
              reward tiap-tiap kegiatan yang telah diselesaikan
            </p>
            <p>
              4. Menu Account digunakan sebagai halaman Edit Profile, pengguna
              bisa mengatur Foto Profile user pengguna dalam aplikasi SPIRIT-UP,
              pengguna bisa mengatur Nama dan email tertaut dalam aplikasi
              SPIRIT-UP
            </p>
          </div>
        </div>
      </div>
    </div>
    `;
    },
    async afterRender() {
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);
        const dbRef = ref(getDatabase(app));
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            const { uid } = user;
            document.getElementById('email').innerHTML = `Hello, keluarga <br>${user.displayName}`;
            const menuToggle = document.querySelector('.menu-toggle');
            const sidebar = document.querySelector('.sidebar');
            get(child(dbRef, `users/${uid}`)).then((snapshot) => {
                if (snapshot.exists()) {
                    console.log(snapshot.val());
                } else {
                    console.log('No data available');
                }
            }).catch((error) => {
                console.error(error);
            });
            menuToggle.addEventListener('click', () => {
                menuToggle.classList.toggle('is-active');
                sidebar.classList.toggle('is-active');
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

            const logout = document.getElementById('log-out');
            logout.addEventListener('click', () => {
                signOut(auth).then(() => {
                    location.replace('/');
                }).catch((error) => {
                    console.log(error);
                });
            });
        });
    },
};

export default account;
