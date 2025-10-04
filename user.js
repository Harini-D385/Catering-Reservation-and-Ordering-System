// user.js
import { db } from "./firebase.js";
import { collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { showMessage, logAction, currentUser } from "./app.js";

// Render product cards into #product-list
export async function loadProducts() {
  const listEl = document.getElementById("product-list");
  if (!listEl) return;
  listEl.innerHTML = "Loading...";
  try {
    const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    const products = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    if (!products.length) {
      listEl.innerHTML = "<p>No products added yet.</p>";
      return;
    }
    listEl.innerHTML = products.map(p => productHtml(p)).join("");
    // attach handlers
    document.querySelectorAll(".add-cart").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = btn.dataset.id;
        const name = btn.dataset.name;
        const price = Number(btn.dataset.price);
        const image = btn.dataset.image;
        addToCart({ id, name, price, image }, 1);
        showMessage("Added to cart");
      });
    });
  } catch (e) {
    console.error("loadProducts:", e);
    listEl.innerHTML = "<p>Failed to load products.</p>";
  }
}

function productHtml(p) {
  const img = p.imageUrl || "https://via.placeholder.com/120x90.png?text=No+Image";
  return `
    <div class="card">
      <img src="${img}" alt="${escapeHtml(p.name)}" />
      <div class="card-body">
        <h3>${escapeHtml(p.name)}</h3>
        <p>${escapeHtml(p.desc || "")}</p>
        <div class="price">₹${p.price}</div>
        <button class="add-cart" data-id="${p.id}" data-name="${escapeHtml(p.name)}" data-price="${p.price}" data-image="${img}">
          Add to cart
        </button>
      </div>
    </div>
  `;
}

// CART (localStorage)
const CART_KEY = "catering_cart_v1";

export function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}
export function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}
export function addToCart(product, qty = 1) {
  const cart = getCart();
  const existing = cart.find(i => i.id === product.id);
  if (existing) existing.qty += qty;
  else cart.push({ ...product, qty });
  saveCart(cart);
  logAction("add_to_cart", `product:${product.id}`);
}
export function removeFromCart(productId) {
  let cart = getCart();
  cart = cart.filter(i => i.id !== productId);
  saveCart(cart);
}
export function clearCart() {
  localStorage.removeItem(CART_KEY);
}

// small helper
function escapeHtml(s) {
  return String(s || "").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"','&quot;').replaceAll("'",'&#039;');
}
