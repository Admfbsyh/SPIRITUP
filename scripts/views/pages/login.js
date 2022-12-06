/* eslint-disable camelcase */
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getDatabase, ref, update } from 'firebase/database';
import Swal from 'sweetalert2';
import firebaseConfig from '../../data/config';
import '../component/headerNav';

const login = {
    async render() {
        return `
        <header-nav></header-nav>
        <main tabindex="0" id="mainContent">
        <div class="login_header">SPIRITUP</div>
        <div class="login_box">
            <h1>Login</h1>
            <label for="email">E-mail</label>
            <input type="text" id="email" name="email" placeholder="E-mail" required><br>
            <label for="password">Password</label>
            <input type="password" id="password" name="password" placeholder="Password" required>
            <input type="checkbox" id="toogle_password" class="toogle_password">
            <label for="toogle_password"> Show Password</label>
            <input type="submit" id="login" name="login" value="Login"><br>
            <a href="#/forgot_password">
                <input type="submit" value="Forgot Password?" class="forgot-password">
            </a>
            <a href="#/signup">
                <input type="submit" value="Create New Account" class="create-new-account">
            </a>
        </div>
        </main>
    `;
    },

    async afterRender() {
        const app = initializeApp(firebaseConfig);
        const auth = getAuth(app);
        const database = getDatabase(app);
        const signinButton = document.getElementById('login');
        signinButton.addEventListener('click', () => {
            const emailSignin = document.getElementById('email').value;
            const passwordSignin = document.getElementById('password').value;
            signInWithEmailAndPassword(auth, emailSignin, passwordSignin)
                .then((userCredential) => {
                // Signed in
                    const { user } = userCredential;
                    const lgDate = new Date();
                    update(ref(database, `users/${user.uid}`), {
                        last_login: lgDate,
                    })
                        .then(() => {
                            location.href = '#/dashboard';
                        })
                        .catch((error) => {
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
        });

        const toogle_password = document.getElementById('toogle_password');
        const password = document.getElementById('password');
        toogle_password.addEventListener('click', () => {
            if (password.type === 'password') {
                password.type = 'text';
            } else {
                password.type = 'password';
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

export default login;
