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

// ── Cloudinary config ─────────────────────────────────────────────────────────
const CLOUDINARY_CLOUD  = "djoxq3zrz";
const CLOUDINARY_PRESET = "ch5d5v7b";

// ── Compress image in browser before uploading ────────────────────────────────
function compressImage(file, maxW, maxH, quality) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let w = img.width, h = img.height;
        if (w > maxW || h > maxH) {
          const ratio = Math.min(maxW / w, maxH / h);
          w = Math.round(w * ratio);
          h = Math.round(h * ratio);
        }
        canvas.width  = w;
        canvas.height = h;
        canvas.getContext("2d").drawImage(img, 0, 0, w, h);
        canvas.toBlob(resolve, "image/jpeg", quality);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

// ── Upload compressed image to Cloudinary, return URL ────────────────────────
window.uploadToCloudinary = async function(file) {
  const compressed = await compressImage(file, 200, 200, 0.80);
  const formData   = new FormData();
  formData.append("file", compressed);
  formData.append("upload_preset", CLOUDINARY_PRESET);
  const res  = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`, {
    method: "POST",
    body: formData
  });
  const data = await res.json();
  return data.secure_url;
};

// ── Firestore helpers ─────────────────────────────────────────────────────────
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

// ── Show splash manually ──────────────────────────────────────────────────────
function showSplash(label) {
  const splash = document.getElementById("splash-screen");
  if (!splash) return;
  splash.classList.remove("fade", "gone");
  splash.style.opacity = "1";
  const labelEl = splash.querySelector(".splash-label");
  if (labelEl) labelEl.textContent = label || "Loading…";
}

// ── Auth ──────────────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  const emailEl    = document.getElementById("email");
  const passwordEl = document.getElementById("password");
  const signupBtn  = document.getElementById("signupBtn");
  const loginBtn   = document.getElementById("loginBtn");

  signupBtn.addEventListener("click", async () => {
    if (!emailEl.value || !passwordEl.value) { alert("Please fill all fields."); return; }
    try {
      showSplash("Creating account…");
      await createUserWithEmailAndPassword(auth, emailEl.value, passwordEl.value);
    } catch (e) {
      if (typeof window.resolveSplash === "function") window.resolveSplash(false);
      alert(e.message);
    }
  });

  loginBtn.addEventListener("click", async () => {
    if (!emailEl.value || !passwordEl.value) { alert("Please fill all fields."); return; }
    try {
      showSplash("Signing in…");
      await signInWithEmailAndPassword(auth, emailEl.value, passwordEl.value);
    } catch (e) {
      if (typeof window.resolveSplash === "function") window.resolveSplash(false);
      alert(e.message);
    }
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
      if (typeof checkUpdatePopup === "function") checkUpdatePopup();
      if (typeof lucide !== "undefined") lucide.createIcons();
      if (typeof window.resolveSplash === "function") window.resolveSplash(true);
    } else {
      window.currentUserId = null;
      window.allData = [];
      authScreen.style.display = "flex";
      appContent.style.display = "none";
      if (typeof window.resolveSplash === "function") window.resolveSplash(false);
    }
  });
});

window.logoutUser = async function () {
  await signOut(auth);
};
