// cart.js
import { getCart, removeFromCart, clearCart, saveCart } from "./user.js";
import { auth, db } from "./firebase.js";
import { addDoc, collection, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { showMessage, logAction, currentUser } from "./app.js";

function renderCart() {
  const listEl = document.getElementById("cart-list");
  const cart = getCart();
  const totalEl = document.getElementById("cart-total");
  if (!listEl) return;
  if (!cart.length) {
    listEl.innerHTML = "<p>Your cart is empty.</p>";
    totalEl.textContent = "₹0";
    return;
  }
  listEl.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}" />
      <div>
        <strong>${item.name}</strong>
        <div>Qty: ${item.qty}</div>
        <div>₹${item.price}</div>
        <button class="remove-btn" data-id="${item.id}">Remove</button>
      </div>
    </div>
  `).join("");
  const total = cart.reduce((s,i) => s + (i.price * i.qty), 0);
  totalEl.textContent = `₹${total}`;
  // attach remove buttons
  document.querySelectorAll(".remove-btn").forEach(b => {
    b.addEventListener("click", () => {
      removeFromCart(b.dataset.id);
      renderCart();
    });
  });
}

async function placeOrder() {
  const cart = getCart();
  if (!cart.length) { showMessage("Cart is empty", true); return; }
  if (!auth.currentUser) {
    showMessage("Please login to place an order", true);
    setTimeout(()=> window.location.href = "login.html", 1000);
    return;
  }
  try {
    const total = cart.reduce((s,i) => s + (i.price * i.qty), 0);
    const order = {
      userId: auth.currentUser.uid,
      items: cart,
      total,
      status: "pending",
      createdAt: serverTimestamp()
    };
    await addDoc(collection(db, "orders"), order);
    await logAction("place_order", `items:${cart.length} total:${total}`);
    clearCart();
    renderCart();
    showMessage("Order placed successfully");
  } catch (e) {
    console.error("placeOrder:", e);
    showMessage("Failed to place order: " + e.message, true);
  }
}

// init
document.addEventListener("DOMContentLoaded", () => {
  renderCart();
  const placeBtn = document.getElementById("place-order");
  if (placeBtn) placeBtn.addEventListener("click", placeOrder);
});
