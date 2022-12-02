/* eslint-disable camelcase */
import { initializeApp } from 'firebase/app';
import {
    getAuth, sendPasswordResetEmail,
} from 'firebase/auth';
import Swal from 'sweetalert2';
import firebaseConfig from '../../data/config';

const forgot_password = {
    async render() {
        return `
        <div class="login_header">SPIRITUP</div>
        <div class="login_box">
        <h1>Forgot Password</h1>
        <label for="email">E-mail</label>
        <input type="text" id="email" name="email" placeholder="E-mail" required><br>
        <input type="submit" id="reset" name="reset" value="Send">
        </div>
    `;
    },

    async afterRender() {
        const app = initializeApp(firebaseConfig);
        const auth = getAuth(app);

        const email_value = document.getElementById('email');
        const email = email_value;

        const reset_password = document.getElementById('reset');

        reset_password.addEventListener('click', () => {
            sendPasswordResetEmail(auth, email.value)
                .then(() => {
                    Swal.fire({
                        title: 'Email Has Been Sent',
                        text: 'Check email spam section if there is no notification',
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
                    const errorCode = error.code;
                    const errorMessage = error.message;

                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: errorCode,
                    });

                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: errorMessage,
                    });
                    // ..
                });
        });
    },
};

export default forgot_password;
