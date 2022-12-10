/* eslint-disable camelcase */
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import {
    getDatabase, set, ref,
} from 'firebase/database';
import Swal from 'sweetalert2';
import firebaseConfig from '../../data/config';
import '../component/headerNav';

const signup = {
    async render() {
        return `
        <header-nav></header-nav>
        <main tabindex="0" id="mainContent">
        <div class="signup_header">SPIRITUP</div>
        <div class="signup_box">
        <h1>Sign Up</h1>
        <form id="signup_form">
        <label for="name">Name</label>
        <input type="text" id="name"  placeholder="Nama Lengkap" required /><br>
        <label for="signupEmail">E-mail</label>
        <input type="text" id="signupEmail"  placeholder="E-mail" required /><br>
        <label for="signupPassword">Password</label>
        <input type="password" id="signupPassword"  placeholder="Password" required /><br>
        <label for="signupPasswordConfirm">Confirm Password</label>
        <input type="password" id="signupPasswordConfirm"  placeholder="Confirm Your Password" required>
        <input type="checkbox" id="toogle_password" class="toogle_password">
        <label for="toogle_password"> Show Password</label>
        <input type="submit" id="signup"  value="Sign Up">
        </form>
        </div>
        </main>
        <footer>
        <p tabindex="0"> Tim Capstone C22-129 &copy;2022 <span>Spirit Up</span></p>
        </footer>
    `;
    },
    async afterRender() {
        const app = initializeApp(firebaseConfig);
        const auth = getAuth(app);
        const database = getDatabase(app);
        const signupButton = document.getElementById('signup_form');

        signupButton.addEventListener('submit', () => {
            event.preventDefault();
            const name = document.getElementById('name').value;
            const emailSignup = document.getElementById('signupEmail').value;
            const passwordSignup = document.getElementById('signupPassword').value;
            const signupPasswordConfirm = document.getElementById('signupPasswordConfirm').value;

            if (passwordSignup !== signupPasswordConfirm) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Passwords did not match',
                });
            } else {
                createUserWithEmailAndPassword(auth, emailSignup, passwordSignup)
                    .then((userCredential) => {
                        // Signed in
                        const { user } = userCredential;

                        set(ref(database, `users/${user.uid}`), {
                            name,
                            email: emailSignup,
                        })
                            .then(() => {
                                updateProfile(auth.currentUser, { displayName: name });
                                Swal.fire({
                                    title: 'Sign Up Success',
                                    text: 'Akun berhasil dibuat',
                                    icon: 'success',
                                    showCancelButton: false,
                                    confirmButtonColor: '#3085d6',
                                    cancelButtonColor: '#d33',
                                    confirmButtonText: 'OK',
                                }).then((result) => {
                                    if (result.isConfirmed) {
                                        location.replace('#/login');
                                    }
                                });
                            })
                            .catch((error) => {
                                // the write failed
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Oops...',
                                    text: error,
                                });
                            });
                    })
                    .catch((error) => {
                        const errorMessage = error.message;
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: errorMessage,
                        });
                    });
            }
        });

        const toogle_password = document.getElementById('toogle_password');
        const signupPassword = document.getElementById('signupPassword');
        const signupPasswordConfirm = document.getElementById('signupPasswordConfirm');
        toogle_password.addEventListener('click', () => {
            if (signupPassword.type === 'password') {
                signupPassword.type = 'text';
            } else {
                signupPassword.type = 'password';
            }

            if (signupPasswordConfirm.type === 'password') {
                signupPasswordConfirm.type = 'text';
            } else {
                signupPasswordConfirm.type = 'password';
            }
        });

        const humberger = document.getElementById('humberger');
        humberger.addEventListener('click', () => {
            const x = document.getElementById('myTopnav');
            if (x.className === 'topnav') {
                x.className += ' responsive';
            } else {
                x.className = 'topnav';
            }
        });
    },

};

export default signup;
