/* eslint-disable max-len */
/* eslint-disable no-alert */
/* eslint-disable no-unused-vars */
import '../component/headerNavDashboard';
import { initializeApp } from 'firebase/app';
import {
    getFirestore, onSnapshot, where, query, collection, addDoc, deleteDoc, doc,
} from 'firebase/firestore';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
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
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            // Add Hamburger SIdebar Menu

            const menu_toggle = document.querySelector(".menu-toggle");
            const sidebar = document.querySelector(".sidebar");

            menu_toggle.addEventListener("click", () => {
            menu_toggle.classList.toggle("is-active");
            sidebar.classList.toggle("is-active");
            });

            // Add Choosed File User Profile

            const imgDiv = document.querySelector(".avatar_user");
            const img = document.querySelector("#photo");
            const file = document.querySelector("#file");
            const uploadBtn = document.querySelector("#UploadBtn");

            imgDiv.addEventListener("mouseenter", function () {
            uploadBtn.style.display = "block";
            });

            imgDiv.addEventListener("mouseleave", function () {
            uploadBtn.style.display = "none";
            });

            file.addEventListener("change", function () {
            const choosedFile = this.files[0];

            if (choosedFile) {
            const reader = new FileReader();

            reader.addEventListener("load", function () {
                img.setAttribute("src", reader.result);
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
    },},
};

export default account;
