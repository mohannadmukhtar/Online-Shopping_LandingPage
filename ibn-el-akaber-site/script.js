const STORE_PHONE = "201008554527";
const CART_STORAGE_KEY = "ibn-el-akaber-cart";

// Replace this object with API calls later. Example:
// const products = await fetch("/api/products").then((response) => response.json());
const products = [
  {
    id: "signature-black-set",
    title: "Signature Black Set",
    category: "Premium Casual",
    price: 1450,
    currency: "EGP",
    sizes: ["M", "L", "XL", "XXL"],
    image: "https://i.ibb.co/V0W06G1m/1780231031450.png",
    alt: "Signature black outfit",
    stock: 12
  },
  {
    id: "urban-confidence",
    title: "Urban Confidence",
    category: "Smart Casual",
    price: 1250,
    currency: "EGP",
    sizes: ["S", "M", "L", "XL"],
    image: "https://i.ibb.co/yFRjyxzn/1780231036630.png",
    alt: "Modern men's outfit",
    stock: 10
  },
  {
    id: "heritage-detail",
    title: "Heritage Detail",
    category: "Classic Wear",
    price: 980,
    currency: "EGP",
    sizes: ["M", "L", "XL"],
    image: "https://i.ibb.co/qP7pPFd/1780231022177.png",
    alt: "Classic men's wear",
    stock: 8
  },
  {
    id: "refined-essential",
    title: "Refined Essential",
    category: "Everyday Luxury",
    price: 850,
    currency: "EGP",
    sizes: ["S", "M", "L", "XL", "XXL"],
    image: "https://i.ibb.co/FbL1w8gw/1780231012948.png",
    alt: "Premium men's top",
    stock: 15
  },
  {
    id: "golden-hour-fit",
    title: "Golden Hour Fit",
    category: "Modern Style",
    price: 1180,
    currency: "EGP",
    sizes: ["M", "L", "XL"],
    image: "https://i.ibb.co/Lzr8b3QT/1780231004448.png",
    alt: "Elegant men's outfit",
    stock: 9
  },
  {
    id: "clean-authority",
    title: "Clean Authority",
    category: "Premium Fit",
    price: 1350,
    currency: "EGP",
    sizes: ["M", "L", "XL", "XXL"],
    image: "https://i.ibb.co/mrjqtSw8/1780230999115.png",
    alt: "Sharp men's fashion item",
    stock: 11
  }
];

const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const productGrid = document.querySelector("[data-products]");
const cartDrawer = document.querySelector("[data-cart-drawer]");
const cartItems = document.querySelector("[data-cart-items]");
const cartCount = document.querySelector("[data-cart-count]");
const cartSubtotal = document.querySelector("[data-cart-subtotal]");
const cartTotal = document.querySelector("[data-cart-total]");
const lightbox = document.querySelector("[data-lightbox-modal]");
const lightboxImage = document.querySelector("[data-lightbox-image]");
const lightboxClose = document.querySelector("[data-lightbox-close]");
const testimonials = Array.from(document.querySelectorAll(".testimonial"));
let testimonialIndex = 0;

const formatPrice = (amount) =>
  new Intl.NumberFormat("en-EG", {
    style: "currency",
    currency: "EGP",
    maximumFractionDigits: 0
  }).format(amount);

const getStoredCart = () => {
  try {
    return JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [];
  } catch {
    return [];
  }
};

let cart = getStoredCart();

const saveCart = () => {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
};

const findProduct = (productId) => products.find((product) => product.id === productId);

const setHeaderState = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 24);
};

const observeReveal = (element) => {
  revealObserver.observe(element);
};

const renderProducts = () => {
  productGrid.innerHTML = products
    .map(
      (product) => `
        <article class="product-card reveal" data-product-id="${product.id}">
          <img src="${product.image}" alt="${product.alt}" loading="lazy" />
          <div class="product-info">
            <p>${product.category}</p>
            <h3>${product.title}</h3>
            <strong class="product-price">${formatPrice(product.price)}</strong>
            <span class="product-stock">${product.stock > 0 ? "In stock" : "Sold out"}</span>
          </div>
          <div class="product-actions">
            <button type="button" class="quick-view" data-lightbox="${product.image}">Quick View</button>
            <button type="button" class="add-to-cart" data-add-cart="${product.id}" ${product.stock <= 0 ? "disabled" : ""}>
              Add to Cart
            </button>
          </div>
        </article>
      `
    )
    .join("");

  productGrid.querySelectorAll(".reveal").forEach(observeReveal);
  productGrid.querySelectorAll("[data-lightbox]").forEach((trigger) => {
    trigger.addEventListener("click", () => openLightbox(trigger.dataset.lightbox));
  });
  productGrid.querySelectorAll("[data-add-cart]").forEach((button) => {
    button.addEventListener("click", () => addToCart(button.dataset.addCart));
  });
};

const cartQuantity = () => cart.reduce((total, item) => total + item.quantity, 0);
const cartAmount = () =>
  cart.reduce((total, item) => {
    const product = findProduct(item.productId);
    return product ? total + product.price * item.quantity : total;
  }, 0);

const renderCart = () => {
  cartCount.textContent = String(cartQuantity());
  cartSubtotal.textContent = formatPrice(cartAmount());
  cartTotal.textContent = formatPrice(cartAmount());

  if (!cart.length) {
    cartItems.innerHTML = '<p class="empty-cart">Your cart is empty.</p>';
    return;
  }

  cartItems.innerHTML = cart
    .map((item) => {
      const product = findProduct(item.productId);
      if (!product) return "";
      return `
        <article class="cart-item">
          <img src="${product.image}" alt="${product.alt}" loading="lazy" />
          <div>
            <h3>${product.title}</h3>
            <p>${product.category}</p>
            <strong>${formatPrice(product.price)}</strong>
            <div class="quantity-control" aria-label="Quantity for ${product.title}">
              <button type="button" data-cart-decrease="${product.id}" aria-label="Decrease quantity">-</button>
              <span>${item.quantity}</span>
              <button type="button" data-cart-increase="${product.id}" aria-label="Increase quantity">+</button>
              <button type="button" data-cart-remove="${product.id}" class="remove-item">Remove</button>
            </div>
          </div>
        </article>
      `;
    })
    .join("");

  cartItems.querySelectorAll("[data-cart-decrease]").forEach((button) => {
    button.addEventListener("click", () => updateCartQuantity(button.dataset.cartDecrease, -1));
  });
  cartItems.querySelectorAll("[data-cart-increase]").forEach((button) => {
    button.addEventListener("click", () => updateCartQuantity(button.dataset.cartIncrease, 1));
  });
  cartItems.querySelectorAll("[data-cart-remove]").forEach((button) => {
    button.addEventListener("click", () => removeFromCart(button.dataset.cartRemove));
  });
};

const addToCart = (productId) => {
  const existingItem = cart.find((item) => item.productId === productId);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ productId, quantity: 1 });
  }
  saveCart();
  renderCart();
  openCart();
};

const updateCartQuantity = (productId, change) => {
  cart = cart
    .map((item) => (item.productId === productId ? { ...item, quantity: item.quantity + change } : item))
    .filter((item) => item.quantity > 0);
  saveCart();
  renderCart();
};

const removeFromCart = (productId) => {
  cart = cart.filter((item) => item.productId !== productId);
  saveCart();
  renderCart();
};

const openCart = () => {
  cartDrawer.classList.add("is-open");
  cartDrawer.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
};

const closeCart = () => {
  cartDrawer.classList.remove("is-open");
  cartDrawer.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
};

const checkoutOnWhatsApp = () => {
  if (!cart.length) {
    openCart();
    return;
  }
  const lines = cart.map((item) => {
    const product = findProduct(item.productId);
    return `${product.title} x${item.quantity} - ${formatPrice(product.price * item.quantity)}`;
  });
  const message = encodeURIComponent(
    `Hello Ibn El-Akaber, I want to order:\n${lines.join("\n")}\nTotal: ${formatPrice(cartAmount())}`
  );
  window.open(`https://wa.me/${STORE_PHONE}?text=${message}`, "_blank", "noopener,noreferrer");
};

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

navToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

nav.addEventListener("click", (event) => {
  if (event.target.matches("a")) {
    nav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  }
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);

document.querySelectorAll(".reveal").forEach(observeReveal);

const openLightbox = (src) => {
  lightboxImage.src = src;
  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
  lightboxClose.focus();
  document.body.style.overflow = "hidden";
};

const closeLightbox = () => {
  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
  lightboxImage.src = "";
  document.body.style.overflow = cartDrawer.classList.contains("is-open") ? "hidden" : "";
};

document.querySelectorAll("[data-lightbox]").forEach((trigger) => {
  trigger.addEventListener("click", () => openLightbox(trigger.dataset.lightbox));
});

document.querySelector("[data-cart-open]").addEventListener("click", openCart);
document.querySelector("[data-cart-close]").addEventListener("click", closeCart);
document.querySelector("[data-checkout]").addEventListener("click", checkoutOnWhatsApp);
cartDrawer.addEventListener("click", (event) => {
  if (event.target === cartDrawer) closeCart();
});

lightboxClose.addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (lightbox.classList.contains("is-open")) closeLightbox();
    if (cartDrawer.classList.contains("is-open")) closeCart();
  }
});

const showTestimonial = (nextIndex) => {
  testimonials[testimonialIndex].classList.remove("active");
  testimonialIndex = (nextIndex + testimonials.length) % testimonials.length;
  testimonials[testimonialIndex].classList.add("active");
};

document.querySelector("[data-prev]").addEventListener("click", () => showTestimonial(testimonialIndex - 1));
document.querySelector("[data-next]").addEventListener("click", () => showTestimonial(testimonialIndex + 1));
setInterval(() => showTestimonial(testimonialIndex + 1), 5200);

document.querySelector(".contact-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const data = new FormData(form);
  const name = data.get("name");
  const phone = data.get("phone");
  const message = data.get("message");
  const whatsappText = encodeURIComponent(`Hello Ibn El-Akaber, my name is ${name}. Phone: ${phone}. ${message}`);
  document.querySelector("[data-form-note]").textContent = "Opening WhatsApp with your message...";
  window.open(`https://wa.me/${STORE_PHONE}?text=${whatsappText}`, "_blank", "noopener,noreferrer");
  form.reset();
});

renderProducts();
renderCart();
