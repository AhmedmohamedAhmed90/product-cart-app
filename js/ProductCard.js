export class ProductCard {
  constructor(product) {
    this.product = product;
    this.element = null;
  }

  render() {
    const template = document.getElementById('product-card-component');
    if (!template) {
      console.error('Product card template not found');
      return null;
    }

    this.element = template.content.cloneNode(true);
    
    const img = this.element.querySelector('.product-img');
    img.src = this.product.image.desktop;
    img.alt = this.product.name;
    
    img.onload = () => {
    };
    img.onerror = () => {
      img.src = this.product.image.thumbnail;
    };
    
    this.element.querySelector('.product-category').textContent = this.product.category;
    this.element.querySelector('.product-title').textContent = this.product.name;
    this.element.querySelector('.product-price').textContent = `$${this.product.price.toFixed(2)}`;
    
    const addToCartBtn = this.element.querySelector('.add-to-cart');
    addToCartBtn.addEventListener('click', (e) => {
      this.handleAddToCart(e);
    });
    
    return this.element;
  }

  handleAddToCart(event) {
    const button = event.target;
    
    const addToCartEvent = new CustomEvent('addToCart', {
      detail: {
        title: this.product.name,
        price: this.product.price
      }
    });
    
    document.dispatchEvent(addToCartEvent);
    
    button.textContent = 'Added!';
    button.style.background = 'hsl(159, 69%, 38%)';
    
    setTimeout(() => {
      button.innerHTML = `
        <svg class="cart-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14 3H12.5L11.5 1H4.5L3.5 3H2L3 5H14L14 3ZM4.5 2H11.5L12.5 4H3.5L4.5 2Z" fill="currentColor"/>
          <path d="M13 6H3L2 8H14L13 6ZM3 9H2V11H14V9H3Z" fill="currentColor"/>
        </svg>
        Add to Cart
      `;
      button.style.background = 'hsl(20, 50%, 98%)';
      button.style.color = 'hsl(14, 65%, 9%)';
    }, 1000);
  }
} 