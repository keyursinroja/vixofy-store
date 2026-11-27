/* Shared shop features: navigation, products, cart, checkout and contact links. */
(() => {
  "use strict";

  // Replace these sample settings with your real business details before launch.
  const CONFIG = {
    whatsappNumber: "91XXXXXXXXXX", // Country code + number, digits only (example format: 919876543210)
    email: "hello@vixofy.in", // Replace with your customer support email.
    upiId: "YOUR-UPI-ID@BANK" // Replace with your real UPI ID.
  };
  const CART_KEY = "vixofy-cart-v1";
  const products = window.VIXOFY_PRODUCTS || [];
  const formatPrice = (amount) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);
  const readCart = () => {
    try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch { return []; }
  };
  const saveCart = (cart) => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartCount();
  };
  const cartCount = () => readCart().reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  const updateCartCount = () => document.querySelectorAll("[data-cart-count]").forEach((el) => { el.textContent = cartCount(); el.hidden = cartCount() === 0; });
  const productById = (id) => products.find((product) => product.id === String(id));

  function productCard(product) {
    const oldPrice = product.oldPrice ? `<del>${formatPrice(product.oldPrice)}</del>` : "";
    const badge = product.badge ? `<span class="product-badge">${product.badge}</span>` : "";
    return `<article class="product-card">
      <a class="product-card__image-wrap" href="product.html?id=${encodeURIComponent(product.id)}">${badge}<img src="${product.image}" alt="Placeholder photo for ${product.name} in ${product.color}" loading="lazy"></a>
      <div class="product-card__body"><p class="eyebrow">${product.category} · ${product.color}</p>
        <h3><a href="product.html?id=${encodeURIComponent(product.id)}">${product.name}</a></h3>
        <p class="product-card__price"><strong>${formatPrice(product.price)}</strong> ${oldPrice}</p>
        <button class="button button--dark button--small" type="button" data-quick-add="${product.id}">Add to bag</button>
      </div>
    </article>`;
  }

  function setupMenu() {
    const toggle = document.querySelector(".menu-toggle");
    const nav = document.querySelector(".site-nav");
    if (!toggle || !nav) return;
    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") !== "true";
      toggle.setAttribute("aria-expanded", String(open));
      nav.classList.toggle("is-open", open);
      document.body.classList.toggle("menu-open", open);
    });
    nav.addEventListener("click", (event) => {
      if (event.target.closest("a")) { nav.classList.remove("is-open"); toggle.setAttribute("aria-expanded", "false"); document.body.classList.remove("menu-open"); }
    });
  }

  function setupWhatsApp() {
    const numberIsSet = /^\d{10,15}$/.test(CONFIG.whatsappNumber);
    const base = numberIsSet ? `https://wa.me/${CONFIG.whatsappNumber}` : "https://wa.me/";
    document.querySelectorAll("[data-whatsapp]").forEach((link) => {
      const message = link.dataset.message || "Hi Vixofy, I have a question about your collection.";
      link.href = `${base}?text=${encodeURIComponent(message)}`;
      if (!numberIsSet && link.dataset.whatsapp === "float") link.title = "Set your WhatsApp number in js/main.js before launch";
    });
    document.querySelectorAll("[data-email]").forEach((link) => { link.href = `mailto:${CONFIG.email}`; link.textContent = CONFIG.email; });
  }

  function setupProductGrids() {
    document.querySelectorAll("[data-product-grid]").forEach((grid) => {
      const limit = Number(grid.dataset.limit || products.length);
      grid.innerHTML = products.slice(0, limit).map(productCard).join("");
    });
    const categoryFilter = document.querySelector("#category-filter");
    const sortFilter = document.querySelector("#sort-filter");
    const shopGrid = document.querySelector("#shop-grid");
    const resultCount = document.querySelector("#result-count");
    const filterProducts = () => {
      if (!shopGrid) return;
      const category = categoryFilter?.value || "all";
      let filtered = products.filter((product) => category === "all" || product.category === category);
      if (sortFilter?.value === "low") filtered.sort((a, b) => a.price - b.price);
      if (sortFilter?.value === "high") filtered.sort((a, b) => b.price - a.price);
      shopGrid.innerHTML = filtered.map(productCard).join("");
      if (resultCount) resultCount.textContent = `${filtered.length} styles`;
    };
    categoryFilter?.addEventListener("change", filterProducts);
    sortFilter?.addEventListener("change", filterProducts);
    filterProducts();
  }

  function addToCart(id, size) {
    const product = productById(id);
    if (!product) return;
    const chosenSize = size || product.sizes[0];
    const cart = readCart();
    const existing = cart.find((item) => item.id === product.id && item.size === chosenSize);
    if (existing) existing.quantity += 1;
    else cart.push({ id: product.id, size: chosenSize, quantity: 1 });
    saveCart(cart);
    const status = document.querySelector("[data-cart-status]");
    if (status) { status.textContent = `${product.name} added to your bag.`; status.classList.add("is-visible"); window.setTimeout(() => status.classList.remove("is-visible"), 2200); }
  }

  function setupProductDetail() {
    const root = document.querySelector("[data-product-detail]");
    if (!root) return;
    const product = productById(new URLSearchParams(window.location.search).get("id"));
    if (!product) { root.innerHTML = `<div class="empty-state"><span class="eyebrow">Vixofy collection</span><h1>That style is not here.</h1><p>Browse the collection to find something you love.</p><a class="button button--dark" href="shop.html">Explore the shop</a></div>`; return; }
    document.title = `${product.name} | Vixofy`;
    document.querySelector('meta[name="description"]')?.setAttribute("content", `${product.name} from Vixofy. ${product.description} Price: ${formatPrice(product.price)}.`);
    document.querySelector('meta[property="og:title"]')?.setAttribute("content", `${product.name} | Vixofy`);
    document.querySelector('meta[property="og:description"]')?.setAttribute("content", `${product.name} in ${product.color}, available in sizes ${product.sizes.join(", ")}.`);
    document.querySelector('meta[property="og:image"]')?.setAttribute("content", new URL(product.image, window.location.href).href);
    document.querySelector('meta[property="og:url"]')?.setAttribute("content", window.location.href);
    const oldPrice = product.oldPrice ? `<del>${formatPrice(product.oldPrice)}</del>` : "";
    root.innerHTML = `<div class="detail-image"><span class="photo-note">Sample photo — replace before launch</span><img src="${product.image}" alt="Placeholder photo for ${product.name} in ${product.color}"></div>
      <div class="detail-copy"><p class="eyebrow">${product.category} · VIXOFY STUDIO</p><h1>${product.name}</h1><p class="detail-price"><strong>${formatPrice(product.price)}</strong> ${oldPrice}</p><p>${product.description}</p>
        <label class="field-label" for="product-size">Choose size</label><select id="product-size" class="select-control">${product.sizes.map((size) => `<option value="${size}">${size}</option>`).join("")}</select>
        <button class="button button--dark button--wide" type="button" data-detail-add="${product.id}">Add to bag</button><p class="inline-status" data-cart-status aria-live="polite"></p>
        <div class="detail-perks"><p>✓ Easy UPI and Cash on Delivery</p><p>✓ Need help with sizing? Message us on WhatsApp</p></div><a class="text-link" href="contact.html">Shipping and returns information</a></div>`;
  }

  function setupCart() {
    const root = document.querySelector("[data-cart]");
    if (!root) return;
    const render = () => {
      const cart = readCart();
      const rows = cart.map((item, index) => {
        const product = productById(item.id);
        if (!product) return "";
        return `<article class="cart-row"><a class="cart-row__image" href="product.html?id=${product.id}"><img src="${product.image}" alt="Placeholder photo for ${product.name}"></a><div class="cart-row__info"><p class="eyebrow">${product.category} · Size ${item.size}</p><h2><a href="product.html?id=${product.id}">${product.name}</a></h2><p>${formatPrice(product.price)}</p><button class="text-link remove-link" type="button" data-remove="${index}">Remove</button></div><label class="quantity-control"><span class="sr-only">Quantity for ${product.name}</span><button type="button" aria-label="Decrease quantity" data-quantity="${index}" data-change="-1">−</button><span>${item.quantity}</span><button type="button" aria-label="Increase quantity" data-quantity="${index}" data-change="1">+</button></label><strong class="cart-row__subtotal">${formatPrice(product.price * item.quantity)}</strong></article>`;
      }).join("");
      const total = cart.reduce((sum, item) => { const p = productById(item.id); return sum + (p ? p.price * item.quantity : 0); }, 0);
      root.innerHTML = cart.length ? `<div class="cart-layout"><div class="cart-items">${rows}</div><aside class="order-summary"><p class="eyebrow">YOUR ORDER</p><h2>Order summary</h2><div class="summary-line"><span>Subtotal</span><strong>${formatPrice(total)}</strong></div><div class="summary-line"><span>Shipping</span><span>Confirmed after order</span></div><div class="summary-line summary-total"><span>Total</span><strong>${formatPrice(total)}</strong></div><p class="summary-note">Shipping details will be confirmed with you on WhatsApp.</p><a class="button button--dark button--wide" href="checkout.html">Continue to checkout</a><a class="text-link centered" href="shop.html">Continue shopping</a></aside></div>` : `<div class="empty-state"><span class="empty-bag">01</span><h1>Your bag is taking a breather.</h1><p>Find a new favourite in the Vixofy collection.</p><a class="button button--dark" href="shop.html">Explore the shop</a></div>`;
    };
    root.addEventListener("click", (event) => {
      const remove = event.target.closest("[data-remove]");
      const quantity = event.target.closest("[data-quantity]");
      if (remove) { const cart = readCart(); cart.splice(Number(remove.dataset.remove), 1); saveCart(cart); render(); }
      if (quantity) { const cart = readCart(); const index = Number(quantity.dataset.quantity); cart[index].quantity += Number(quantity.dataset.change); if (cart[index].quantity <= 0) cart.splice(index, 1); saveCart(cart); render(); }
    });
    render();
  }

  function setupCheckout() {
    const root = document.querySelector("[data-checkout]");
    if (!root) return;
    const summary = document.querySelector("[data-checkout-summary]");
    const cart = readCart();
    const total = cart.reduce((sum, item) => { const p = productById(item.id); return sum + (p ? p.price * item.quantity : 0); }, 0);
    if (summary) summary.innerHTML = cart.length ? `${cart.map((item) => { const p = productById(item.id); return p ? `<p>${p.name} · ${item.size} × ${item.quantity}<strong>${formatPrice(p.price * item.quantity)}</strong></p>` : ""; }).join("")}<p class="checkout-total">Total<strong>${formatPrice(total)}</strong></p>` : `<p>Your bag is empty. <a href="shop.html">Shop the collection</a>.</p>`;
    const upi = document.querySelector("[data-upi-id]");
    if (upi) upi.textContent = CONFIG.upiId;
    const form = root.querySelector("form");
    form?.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!cart.length) { window.location.href = "shop.html"; return; }
      if (!form.reportValidity()) return;
      const data = new FormData(form);
      const lines = cart.map((item) => { const p = productById(item.id); return p ? `• ${p.name} | Size: ${item.size} | Qty: ${item.quantity} | ${formatPrice(p.price * item.quantity)}` : ""; }).filter(Boolean).join("\n");
      const message = `Hi Vixofy, I would like to place this order.\n\n${lines}\n\nTotal: ${formatPrice(total)}\n\nName: ${data.get("name")}\nPhone: ${data.get("phone")}\nAddress: ${data.get("address")}\nPayment preference: ${data.get("payment")}`;
      const configured = /^\d{10,15}$/.test(CONFIG.whatsappNumber);
      const url = configured ? `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}` : `https://wa.me/?text=${encodeURIComponent(message)}`;
      window.open(url, "_blank", "noopener,noreferrer");
    });
  }

  function setupContactForm() {
    const form = document.querySelector("[data-contact-form]");
    form?.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = new FormData(form);
      const subject = encodeURIComponent(`Vixofy website enquiry from ${data.get("name")}`);
      const body = encodeURIComponent(`Name: ${data.get("name")}\nEmail: ${data.get("email")}\n\n${data.get("message")}`);
      window.location.href = `mailto:${CONFIG.email}?subject=${subject}&body=${body}`;
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    setupMenu(); setupWhatsApp(); updateCartCount(); setupProductGrids(); setupProductDetail(); setupCart(); setupCheckout(); setupContactForm();
    document.addEventListener("click", (event) => {
      const quickAdd = event.target.closest("[data-quick-add]");
      if (quickAdd) { addToCart(quickAdd.dataset.quickAdd); quickAdd.textContent = "Added ✓"; window.setTimeout(() => { quickAdd.textContent = "Add to bag"; }, 1600); }
      const detailAdd = event.target.closest("[data-detail-add]");
      if (detailAdd) addToCart(detailAdd.dataset.detailAdd, document.querySelector("#product-size")?.value);
    });
  });
})();
