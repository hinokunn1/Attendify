import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBAdWVto0vUd3Wuw_lLLQUrHqizo_2h3Dk",
  authDomain: "attendify-90a4f.firebaseapp.com",
  projectId: "attendify-90a4f",
  storageBucket: "attendify-90a4f.firebasestorage.app",
  messagingSenderId: "29544428843",
  appId: "1:29544428843:web:b9541410d1c862d3e0016e"
};

const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getFirestore(app);

// ── Firestore helpers (exposed to index.html) ────────────────────────────────
window.fsLoadData = async function(userId) {
  const snap = await getDocs(collection(db, "users", userId, "data"));
  return snap.docs.map(d => d.data());
};
window.fsSaveItem = async function(userId, item) {
  await setDoc(doc(db, "users", userId, "data", item.id), item);
};
window.fsDeleteItem = async function(userId, itemId) {
  await deleteDoc(doc(db, "users", userId, "data", itemId));
};

// ── Auth ─────────────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  const emailEl    = document.getElementById("email");
  const passwordEl = document.getElementById("password");
  const signupBtn  = document.getElementById("signupBtn");
  const loginBtn   = document.getElementById("loginBtn");

  signupBtn.addEventListener("click", async () => {
    if (!emailEl.value || !passwordEl.value) { alert("Please fill all fields."); return; }
    try {
      await createUserWithEmailAndPassword(auth, emailEl.value, passwordEl.value);
      alert("Account created! You are now logged in.");
    } catch (e) { alert(e.message); }
  });

  loginBtn.addEventListener("click", async () => {
    if (!emailEl.value || !passwordEl.value) { alert("Please fill all fields."); return; }
    try {
      await signInWithEmailAndPassword(auth, emailEl.value, passwordEl.value);
    } catch (e) { alert(e.message); }
  });

  onAuthStateChanged(auth, async (user) => {
    const authScreen = document.getElementById("auth-screen");
    const appContent = document.getElementById("app-content");

    if (user) {
      window.currentUserId = user.uid;
      window.allData = await window.fsLoadData(user.uid);

      authScreen.style.display = "none";
      appContent.style.display = "block";

      if (typeof renderAll === "function") renderAll();
      if (typeof lucide !== "undefined") lucide.createIcons();

      // ✅ Tell the splash the user is logged in → fade out gracefully
      if (typeof window.resolveSplash === "function") window.resolveSplash(true);
    } else {
      window.currentUserId = null;
      window.allData = [];

      authScreen.style.display = "flex";
      appContent.style.display = "none";

      // ✅ Tell the splash no session → disappear instantly, show login
      if (typeof window.resolveSplash === "function") window.resolveSplash(false);
    }
  });
});

window.logoutUser = async function () {
  await signOut(auth);
};
