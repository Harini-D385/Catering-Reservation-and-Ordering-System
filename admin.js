// admin.js
import { db, storage } from "./firebase.js";
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";
import { showMessage, logAction } from "./app.js";

async function uploadImage(file) {
  if (!file) return null;
  const path = `product_images/${Date.now()}_${file.name}`;
  const stRef = ref(storage, path);
  const snap = await uploadBytes(stRef, file);
  return await getDownloadURL(snap.ref);
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("product-form");
  if (!form) return;
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = form.pname.value.trim();
    const price = Number(form.price.value);
    const desc = form.desc.value.trim();
    const file = form.image.files[0];

    if (!name || !price) { showMessage("Name and price required", true); return; }
    try {
      showMessage("Uploading…");
      let imageUrl = null;
      if (file) imageUrl = await uploadImage(file);
      await addDoc(collection(db, "products"), {
        name, price, desc, imageUrl, available: true, createdAt: serverTimestamp()
      });
      form.reset();
      showMessage("Product added", false);
      await logAction("add_product", `name:${name}`);
    } catch (err) {
      console.error("admin add product:", err);
      showMessage("Failed to add product: " + err.message, true);
    }
  });
});
