import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import {
    getDatabase, ref, update,
} from 'firebase/database';
import Swal from 'sweetalert2';
import firebaseConfig from '../../data/config';

const login = {
    async render() {
        return `
        <div class="login_header">SPIRITUP</div>
        <div class="login_box">
        <h1>Login</h1>
        <label for="email">E-mail</label>
        <input type="text" id="email" name="email" placeholder="E-mail" required><br>
        <label for="password">Password</label>
        <input type="password" id="password" name="password" placeholder="Password" required>
        <input type="submit" id="login" name="login" value="Login"><br>
        <a href="#/forgot_password">Forgot Password?</a>
        <a href="#/signup">Creat New Account</a>
        </div>
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
                            location.href = '/';
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
    },

};

export default login;
