import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getDatabase, set, ref, update } from "firebase/database";
import firebaseConfig from "../../data/config";
import Swal from 'sweetalert2'

const signup={
    async render(){
    return `
        <div class="signup_header">SPIRITUP</div>
        <div class="signup_box">
        <h1>Sign In</h1>
        <label for="name">Name</label>
        <input type="text" id="name" name="name" placeholder="Nama Lengkap" required><br>
        <label for="signupEmail">E-mail</label>
        <input type="text" id="signupEmail" name="signupEmail" placeholder="E-mail" required><br>
        <label for="signupPassword">Password</label>
        <input type="password" id="signupPassword" name="signupPassword" placeholder="Password" required><br>
        <label for="signupPasswordConfirm">Confirm Password</label>
        <input type="password" id="signupPasswordConfirm" name="signupPasswordConfirm" placeholder="Confirm Your Password" required>
        <input type="submit" id="signup" name="signup" value="Sign In">
        </div>
    `;
    },
    async afterRender(){
        const app = initializeApp(firebaseConfig);
        const auth = getAuth(app);
        const database = getDatabase(app);
        let signupButton = document.getElementById("signup");
    
        signupButton.addEventListener("click", (e) => {
            let name = document.getElementById("name").value;
            let emailSignup = document.getElementById("signupEmail").value;
            let passwordSignup = document.getElementById("signupPassword").value;
            let signupPasswordConfirm = document.getElementById("signupPasswordConfirm").value;

            if(passwordSignup != signupPasswordConfirm)  
            {   
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: "Passwords did not match",
                  }) 
            } else {  
                createUserWithEmailAndPassword(auth, emailSignup, passwordSignup)
              .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
          
                set(ref(database, "users/" + user.uid), {
                  name: name,
                  email: emailSignup,
                  password: passwordSignup
                })
                  .then(() => {
                    Swal.fire({
                        title: 'Sign Up SUccess',
                        text: "Akun berhasil dibuat",
                        icon: 'success',
                        showCancelButton: false,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'OK'
                      }).then((result) => {
                        if (result.isConfirmed) {
                            location.replace("#/login")
                        }
                      }
                      )
                      
                    })
                  .catch((error) => {
                    //the write failed
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: error,
                      })
                  });
              })
              .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: errorMessage,
                  })
              });  
            }  
          
            
          });
    },
    
};

export default signup
