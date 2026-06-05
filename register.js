import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBAdWVto0vUd3Wuw_lLLQUrHqizo_2h3Dk",
  authDomain: "attendify-90a4f.firebaseapp.com",
  projectId: "attendify-90a4f",
  storageBucket: "attendify-90a4f.firebasestorage.app",
  messagingSenderId: "29544428843",
  appId: "1:29544428843:web:b9541410d1c862d3e0016e"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ✅ Wait for DOM to be ready before touching any elements
document.addEventListener("DOMContentLoaded", () => {

  const email     = document.getElementById("email");
  const password  = document.getElementById("password");
  const signupBtn = document.getElementById("signupBtn");
  const loginBtn  = document.getElementById("loginBtn");

  // SIGN UP
  signupBtn.addEventListener("click", async () => {
    if (!email.value || !password.value) {
      alert("Please fill all fields.");
      return;
    }
    try {
      await createUserWithEmailAndPassword(auth, email.value, password.value);
      alert("Account created successfully!");
    } catch (error) {
      alert(error.message);
    }
  });

  // LOGIN
  loginBtn.addEventListener("click", async () => {
    if (!email.value || !password.value) {
      alert("Please fill all fields.");
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, email.value, password.value);
    } catch (error) {
      alert(error.message);
    }
  });

  // AUTH STATE — show/hide screens
  onAuthStateChanged(auth, (user) => {
    const authScreen = document.getElementById("auth-screen");
    const appContent = document.getElementById("app-content");
    if (user) {
      authScreen.style.display = "none";
      appContent.style.display = "block";
    } else {
      authScreen.style.display = "flex";
      appContent.style.display = "none";
    }
  });

});

// ✅ logoutUser stays on window so the inline onclick can reach it
window.logoutUser = async function () {
  await signOut(auth);
};
