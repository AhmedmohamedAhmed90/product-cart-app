export class CartItem {
  constructor(item) {
    this.item = item;
    this.element = null;
  }

  render() {
    const template = document.getElementById('cart-item-component');
    if (!template) {
      console.error('Cart item template not found');
      return null;
    }

    this.element = template.content.cloneNode(true);
    
    this.element.querySelector('.item-title').textContent = this.item.title;
    this.element.querySelector('.quantity').textContent = this.item.quantity;
    this.element.querySelector('.item-price').textContent = `$${(this.item.price * this.item.quantity).toFixed(2)}`;
    
    const decreaseBtn = this.element.querySelector('.decrease');
    const increaseBtn = this.element.querySelector('.increase');
    const removeBtn = this.element.querySelector('.remove');
    
    decreaseBtn.addEventListener('click', () => this.handleQuantityChange(-1));
    increaseBtn.addEventListener('click', () => this.handleQuantityChange(1));
    removeBtn.addEventListener('click', () => this.handleRemove());
    
    return this.element;
  }

  handleQuantityChange(change) {
    const quantityChangeEvent = new CustomEvent('quantityChange', {
      detail: {
        title: this.item.title,
        change: change
      }
    });
    document.dispatchEvent(quantityChangeEvent);
  }

  handleRemove() {
    const removeItemEvent = new CustomEvent('removeItem', {
      detail: {
        title: this.item.title
      }
    });
    document.dispatchEvent(removeItemEvent);
  }
} 