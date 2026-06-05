// Firebase App
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";

// Firebase Auth
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";


// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyBAdWVto0vUd3Wuw_lLLQUrHqizo_2h3Dk",
  authDomain: "attendify-90a4f.firebaseapp.com",
  projectId: "attendify-90a4f",
  storageBucket: "attendify-90a4f.firebasestorage.app",
  messagingSenderId: "29544428843",
  appId: "1:29544428843:web:b9541410d1c862d3e0016e"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


// Elements
const email =
  document.getElementById("email");

const password =
  document.getElementById("password");

const signupBtn =
  document.getElementById("signupBtn");

const loginBtn =
  document.getElementById("loginBtn");

const authScreen =
  document.getElementById("auth-screen");

const appContent =
  document.getElementById("app-content");


// SIGN UP
signupBtn.addEventListener("click", async () => {

  if(!email.value || !password.value){
    alert("Fill all fields");
    return;
  }

  try{

    await createUserWithEmailAndPassword(
      auth,
      email.value,
      password.value
    );

    alert("Account Created!");

  }catch(error){

    alert(error.message);

  }

});


// LOGIN
loginBtn.addEventListener("click", async () => {

  try{

    await signInWithEmailAndPassword(
      auth,
      email.value,
      password.value
    );

    alert("Login Successful!");

  }catch(error){

    alert(error.message);

  }

});


// AUTH STATE
onAuthStateChanged(auth, (user) => {

  if(user){

    authScreen.style.display = "none";
    appContent.style.display = "block";

  }else{

    authScreen.style.display = "flex";
    appContent.style.display = "none";

  }

});


// LOGOUT
window.logoutUser = async function(){

  await signOut(auth);

};
