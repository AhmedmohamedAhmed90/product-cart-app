import { renderProduct } from './ui.js';

export async function loadProducts() {
  try {
    console.log('Loading products...');
    const res = await fetch('./data/data.json');
    if (!res.ok) {
      throw new Error(`Failed to load products: ${res.status} ${res.statusText}`);
    }
    const products = await res.json();
    console.log('Products loaded:', products);
    
    const productList = document.getElementById('product-list');
    if (!productList) {
      throw new Error('Product list element not found');
    }
    
    productList.innerHTML = '<div class="loading">Loading products...</div>';
    
    productList.innerHTML = '';
    
    if (!Array.isArray(products) || products.length === 0) {
      productList.innerHTML = '<div class="loading">No products found.</div>';
      return;
    }
    
    products.forEach((product, index) => {
      console.log(`Rendering product ${index + 1}:`, product);
      renderProduct(product);
    });
    
    console.log(`Successfully rendered ${products.length} products`);
  } catch (error) {
    console.error('Error loading products:', error);
    const productList = document.getElementById('product-list');
    if (productList) {
      productList.innerHTML = `<div class="loading">Error loading products: ${error.message}. Please refresh the page.</div>`;
    }
  }
}
