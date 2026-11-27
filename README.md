# Vixofy

Vixofy is a mobile-friendly fashion storefront made with plain HTML, CSS, and JavaScript. It has no build step or package installation.

## Preview

Open `index.html` in a web browser. The site can also be deployed as a static website, for example with GitHub Pages.

## Pages

- `index.html` — home page and featured products
- `shop.html` — product collection with category and price sorting
- `product.html?id=1` — product details; change the number to select a product
- `cart.html` — saved shopping bag and order total
- `checkout.html` — delivery form and WhatsApp order message
- `about.html` — brand story
- `contact.html` — contact options and common questions

## Editing the store

- Edit product names, prices, sizes, and descriptions in `js/products.js`.
- Update the WhatsApp number, support email, and UPI ID near the top of `js/main.js`.
- Replace the sample photos in `images/` with real product photos, then update the matching image paths in `js/products.js`.
- Page content is in the HTML files, and the shared design is in `css/style.css`.

Orders are prepared in WhatsApp. Payment is arranged directly with the customer using UPI or Cash on Delivery; this project does not connect to an online payment gateway.
