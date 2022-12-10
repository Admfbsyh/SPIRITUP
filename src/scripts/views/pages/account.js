/* eslint-disable max-len */
/* eslint-disable no-alert */
/* eslint-disable no-unused-vars */
import '../component/headerNavDashboard';
import { initializeApp } from 'firebase/app';
import {
    getAuth, onAuthStateChanged, signOut, updateProfile,
} from 'firebase/auth';
import {
    getStorage, uploadBytesResumable, ref, getDownloadURL,
} from 'firebase/storage';
import Swal from 'sweetalert2';
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
                <span class="email" id="nama"></span>
              </a>
              <a href="?#/dashboard" class="menu-item">Tugas</a>
              <a href="?#/taskcompleted" class="menu-item">Terselesaikan</a>
              <a href="?#/account" class="menu-item is-active">Akun</a>
              <a id="log-out" class="menu-item"><span>Keluar</span></a>
            </nav>
          </aside>
          <div class="content_profile">
        <div class="profile_edit">
          <h1>Edit Account</h1>
          <div class="account_container">
          <div class="avatar_user">
              <br>
            <img class="img_area" id="myImg">
            <div class="mb-3">
              <input class="form-control form-control-sm select_image_avatar" id="imgInput" type="file" accept="image/jpg, image/png" required />
            </div>
            <button class="upload_button " id="UploadBtn">Upload Image</button>
          </div>
        
          <div class="menu_edit">
            <form id="userAccount">
              <h3>Masukan Nama :</h3>
              <input type="text" class="form_nama" id="inputName" required > </br> 
              <button type="submit" class="btn save_nama">Save</button>
            </form>
        </div>
        </div>
        
        <div class="intruksi_container">
        <h2>Cara Kerja Penggunaan Aplikasi SPIRIT-UP</h2>
          <div class="intruksi">
          <ul>
            <li>
              User diwajibkan untuk Registrasi di awal halaman guna mengakses
              izin menggunakan aplikasi, dan login setelah melakukan registrasi
            </li>
            <li>
              Menu "Task" Digunakan user untuk membuat sebuah task/kegiatan
              untuk dikerjakan kemudian sesuai dengan data yang dimasukkan,
              (Data terdiri dari : Judul Kegiatan, Jadwal Kegiatan, serta
              Deskripsi Kegiatan), kemudian user bisa memilih kategori kegiatan
              termasuk kegiatan biasa/Reguler Task atau Kegiatan
              Penting/Important Task
            </li>
            <li>
              Menu Completed digunakan untuk memberitahu informasi detail
              mengenai history kegiatan yang telah dikerjaan beserta nilai point
              reward tiap-tiap kegiatan yang telah diselesaikan
            </li>
            <li>
              Menu Account digunakan sebagai halaman Edit Profile, pengguna
              bisa mengatur Foto Profile user pengguna dalam aplikasi SPIRIT-UP,
              pengguna bisa mengatur Nama dan email tertaut dalam aplikasi
              SPIRIT-UP
            </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    `;
    },
    async afterRender() {
        const app = initializeApp(firebaseConfig);
        const storage = getStorage();
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if (user) {
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
                document.getElementById('myImg').src = user.photoURL;
                const { uid } = user;
                document.getElementById('nama').innerHTML = `Hello, keluarga <br>${user.displayName}`;
                const menuToggle = document.querySelector('.menu-toggle');
                const sidebar = document.querySelector('.sidebar');
                const editUser = document.getElementById('userAccount');
                editUser.addEventListener('submit', (event) => {
                    const newName = document.querySelector('.form_nama').value;
                    event.preventDefault();
                    updateProfile(auth.currentUser, { displayName: newName });
                    location.reload();
                });
                menuToggle.addEventListener('click', () => {
                    menuToggle.classList.toggle('is-active');
                    sidebar.classList.toggle('is-active');
                });
                const uploadImg = document.getElementById('UploadBtn');
                uploadImg.addEventListener('click', (event) => {
                    event.preventDefault();
                    const imgRef = ref(storage, `Images/profil${uid}`);
                    const uploadImage = uploadBytesResumable(imgRef, files[0]);
                    let imgUrl = '';
                    uploadImage.on(
                        'state_changed',
                        (snapshot) => {
                        },
                        (error) => {
                            console.log(error);
                        },
                        () => {
                            getDownloadURL(uploadImage.snapshot.ref).then((downloadURL) => {
                                imgUrl = downloadURL;
                                updateProfile(auth.currentUser, { photoURL: imgUrl })
                                    .then(() => {
                                        Swal.fire({
                                            title: 'foto profile ditambahkan',
                                            text: 'foto profile berhasil ditambahkan',
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
            } else {
                location.replace('/');
            }

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
