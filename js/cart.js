import { updateCartUI } from './ui.js';
import { saveCartToStorage, getCart } from './storage.js';
import { showModal } from './ui.js';
import { userManager } from './users.js';

let cart = [];

export function setupCart() {
  document.addEventListener('click', e => {
    if (e.target.classList.contains('add-to-cart')) {
      const productEl = e.target.closest('.product-card');
      const title = productEl.querySelector('.product-title').textContent;
      const price = parseFloat(productEl.querySelector('.product-price').textContent.replace('$', ''));
      addToCart({ title, price });
      
      e.target.textContent = 'Added!';
      e.target.style.background = 'hsl(159, 69%, 38%)';
      setTimeout(() => {
        e.target.textContent = 'Add to Cart';
        e.target.style.background = 'hsl(14, 86%, 42%)';
      }, 1000);
    }

    if (e.target.classList.contains('increase')) {
      updateQuantity(e.target.closest('.cart-item'), 1);
    }

    if (e.target.classList.contains('decrease')) {
      updateQuantity(e.target.closest('.cart-item'), -1);
    }

    if (e.target.classList.contains('remove')) {
      removeFromCart(e.target.closest('.cart-item'));
    }

    if (e.target.id === 'confirm-order') {
      if (cart.length === 0) {
        alert('Your cart is empty! Add some items before confirming your order.');
        return;
      }
      
      const currentUser = userManager.getCurrentUser();
      if (currentUser) {
        userManager.addOrderToHistory(currentUser, [...cart]);
      }
      
      showModal(cart);
      
      localStorage.removeItem('appliedVoucher');
    }

    if (e.target.id === 'new-order') {
      if (confirm('Are you sure you want to start a new order? This will clear your current cart.')) {
        cart = [];
        updateCartUI(cart);
        saveCartToStorage(cart);
        localStorage.removeItem('appliedVoucher');
      }
    }
  });
}

function addToCart(product) {
  const existing = cart.find(p => p.title === product.title);
  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  updateCartUI(cart);
  saveCartToStorage(cart);
  checkAndApplyVoucher();
}

function updateQuantity(itemEl, change) {
  const title = itemEl.querySelector('.item-title').textContent;
  const item = cart.find(p => p.title === title);
  if (!item) return;
  
  item.quantity += change;
  if (item.quantity <= 0) {
    cart = cart.filter(p => p.title !== title);
  }
  updateCartUI(cart);
  saveCartToStorage(cart);
  checkAndApplyVoucher();
}

function removeFromCart(itemEl) {
  const title = itemEl.querySelector('.item-title').textContent;
  cart = cart.filter(p => p.title !== title);
  updateCartUI(cart);
  saveCartToStorage(cart);
  checkAndApplyVoucher();
}

function checkAndApplyVoucher() {
  try {
    const appliedVoucher = localStorage.getItem('appliedVoucher');
    if (appliedVoucher) {
      const voucher = JSON.parse(appliedVoucher);
      const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      if (totalPrice < voucher.minOrder) {
        localStorage.removeItem('appliedVoucher');
        updateCartUI(cart);
      }
    }
  } catch (error) {
    console.error('Error checking voucher:', error);
  }
}

export function loadCart(c) {
  cart = c;
  updateCartUI(cart);
  checkAndApplyVoucher();
}
