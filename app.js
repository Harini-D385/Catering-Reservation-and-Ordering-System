// app.js
import { auth, db } from "./firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { doc, getDoc, serverTimestamp, setDoc, addDoc, collection } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

export let currentUser = null;
export let currentUserRole = null;

// Utility: show message near top of page (simple)
export function showMessage(text, isError = false) {
  const el = document.getElementById("global-message");
  if (!el) return;
  el.textContent = text || "";
  el.style.color = isError ? "crimson" : "green";
  if (text) setTimeout(() => { el.textContent = ""; }, 4000);
}

// logger: write to Firestore logs (best-effort)
export async function logAction(action, details = "") {
  try {
    await addDoc(collection(db, "logs"), {
      action,
      details,
      userId: currentUser ? currentUser.uid : null,
      email: currentUser ? currentUser.email : null,
      time: serverTimestamp()
    });
    // console.log("logged:", action);
  } catch (e) {
    console.warn("Could not save log:", e);
  }
}

// observe auth state to update nav and role
onAuthStateChanged(auth, async (user) => {
  currentUser = user;
  currentUserRole = null;
  if (userDoc.exists()) {
  console.log("User doc found:", userDoc.data());
  currentUserRole = userDoc.data().role || "user";
} else {
  console.log("No user doc found for UID:", user.uid);
  currentUserRole = "user";
}

  updateAuthUI();
});

// call this to sign out
export async function doSignOut() {
  try {
    await signOut(auth);
    showMessage("Signed out", false);
    await logAction("sign_out");
    window.location.href = "index.html";
  } catch (err) {
    showMessage(err.message, true);
  }
}

// update UI nav links visible on all pages
function updateAuthUI() {
  const profileLink = document.getElementById("nav-profile");
  const loginLink = document.getElementById("nav-login");
  const signupLink = document.getElementById("nav-signup");
  const adminLink = document.getElementById("nav-admin");
  const logoutBtn = document.getElementById("nav-logout");
  if (!profileLink) return; // no nav present on page
  if (currentUser) {
    profileLink.style.display = "inline-block";
    loginLink.style.display = "none";
    signupLink.style.display = "none";
    logoutBtn.style.display = "inline-block";
    if (currentUserRole === "admin") adminLink.style.display = "inline-block";
    else adminLink.style.display = "none";
  } else {
    profileLink.style.display = "none";
    loginLink.style.display = "inline-block";
    signupLink.style.display = "inline-block";
    logoutBtn.style.display = "none";
    if (adminLink) adminLink.style.display = "none";
  }
}

