import { loadCart } from './cart.js';

export function saveCartToStorage(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

export function loadCartFromStorage() {
  const saved = localStorage.getItem('cart');
  if (saved) loadCart(JSON.parse(saved));
}

export function getCart() {
  const saved = localStorage.getItem('cart');
  return saved ? JSON.parse(saved) : [];
}
