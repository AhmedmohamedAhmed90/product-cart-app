import { componentLoader } from './component-loader.js';

export function renderMainLayout() {
  try {
    const app = document.getElementById('app');
    if (!app) {
      console.error('App container not found');
      return;
    }

    const productsSection = componentLoader.getTemplate('products-section-template');
    const cartSection = componentLoader.getTemplate('cart-section-template');

    if (productsSection && cartSection) {
      app.appendChild(productsSection);
      app.appendChild(cartSection);
      console.log('Main layout rendered successfully');
    } else {
      console.error('Failed to load layout templates');
    }
  } catch (error) {
    console.error('Error rendering main layout:', error);
  }
}

export function renderProduct(product) {
  try {
    console.log('Rendering product:', product);
    
    const template = componentLoader.getTemplate('product-template');
    if (!template) {
      console.error('Product template not found');
      return;
    }
    
    const img = template.querySelector('.product-img');
    if (img && product.image && product.image.desktop) {
      img.src = product.image.desktop;
      img.alt = product.name || 'Product image';
      
      img.onload = function() {
        console.log('Image loaded successfully:', product.name);
      };
      img.onerror = function() {
        console.log('Desktop image failed, trying thumbnail:', product.name);
        if (product.image.thumbnail) {
          this.src = product.image.thumbnail;
        }
      };
    }
    
    const titleElement = template.querySelector('.product-title');
    if (titleElement && product.name) {
      titleElement.textContent = product.name;
    }
    
    const priceElement = template.querySelector('.product-price');
    if (priceElement && typeof product.price === 'number') {
      priceElement.textContent = `$${product.price.toFixed(2)}`;
    }
    
    if (product.category) {
      const category = document.createElement('p');
      category.className = 'product-category';
      category.textContent = product.category;
      category.style.color = 'hsl(7, 20%, 60%)';
      category.style.fontSize = '0.875rem';
      category.style.marginBottom = '0.5rem';
      
      const title = template.querySelector('.product-title');
      if (title && title.parentNode) {
        title.parentNode.insertBefore(category, title.nextSibling);
      }
    }
    
    const productList = document.getElementById('product-list');
    if (productList) {
      productList.appendChild(template);
      console.log('Product added to DOM:', product.name);
    } else {
      console.error('Product list element not found');
    }
  } catch (error) {
    console.error('Error rendering product:', error, product);
  }
}

export function updateCartUI(cart) {
  const container = document.getElementById('cart-items');
  const count = document.getElementById('cart-count');
  const total = document.getElementById('cart-total');
  
  container.innerHTML = '';
  
  if (cart.length === 0) {
    container.innerHTML = `
      <div class="cart-empty">
        <img src="./assets/images/illustration-empty-cart.svg" alt="Empty cart">
        <p>Your cart is empty</p>
        <p>Add some delicious desserts to get started!</p>
      </div>
    `;
    count.textContent = '0';
    total.textContent = '0.00';
    return;
  }
  
  let totalPrice = 0;
  let discountApplied = false;
  
  cart.forEach(item => {
    const template = componentLoader.getTemplate('cart-item-template');
    if (template) {
      template.querySelector('.item-title').textContent = item.title;
      template.querySelector('.quantity').textContent = item.quantity;
      const itemTotal = item.price * item.quantity;
      template.querySelector('.item-price').textContent = `$${itemTotal.toFixed(2)}`;
      totalPrice += itemTotal;
      container.appendChild(template);
    }
  });

  count.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  let voucherApplied = false;
  let voucherInfo = null;
  try {
    const appliedVoucher = localStorage.getItem('appliedVoucher');
    if (appliedVoucher) {
      voucherInfo = JSON.parse(appliedVoucher);
      if (totalPrice >= voucherInfo.minOrder) {
        voucherApplied = true;
        if (voucherInfo.discount > 0) {
          totalPrice *= (1 - voucherInfo.discount);
        }
      }
    }
  } catch (error) {
    console.error('Error checking voucher:', error);
  }
  
  if (!voucherApplied && totalPrice > 50) {
    totalPrice *= 0.9;
    discountApplied = true;
  }
  
  total.textContent = totalPrice.toFixed(2);
  
  if (voucherApplied && voucherInfo) {
    const voucherMsg = document.createElement('div');
    voucherMsg.style.cssText = `
      background: hsl(159, 69%, 38%);
      color: white;
      padding: 0.75rem;
      border-radius: 6px;
      margin: 0.5rem 0;
      font-size: 0.875rem;
      font-weight: 600;
      display: flex;
      justify-content: space-between;
      align-items: center;
    `;
    
    voucherMsg.innerHTML = `
      <span>🎉 ${voucherInfo.description}</span>
      <button id="remove-voucher" style="background: none; border: none; color: white; cursor: pointer; font-size: 1.2rem;">×</button>
    `;
    
    container.appendChild(voucherMsg);
    
    const removeBtn = voucherMsg.querySelector('#remove-voucher');
    if (removeBtn) {
      removeBtn.addEventListener('click', () => {
        localStorage.removeItem('appliedVoucher');
        updateCartUI(cart);
      });
    }
  }
  
  if (discountApplied && !voucherApplied) {
    const discountMsg = document.createElement('p');
    discountMsg.style.cssText = `
      color: hsl(159, 69%, 38%);
      font-size: 0.875rem;
      font-weight: 600;
      margin-top: 0.5rem;
    `;
    discountMsg.textContent = '🎉 10% discount applied!';
    container.appendChild(discountMsg);
  }
}

export function showModal(cart) {
  const modalTemplate = componentLoader.getTemplate('modal-template');
  if (!modalTemplate) {
    console.error('Modal template not found');
    return;
  }
  
  const modalItems = modalTemplate.querySelector('#modal-items');
  let total = 0;
  
  const receiptHeader = document.createElement('h3');
  receiptHeader.textContent = 'Order Summary';
  receiptHeader.style.marginBottom = '1rem';
  receiptHeader.style.color = 'hsl(14, 65%, 9%)';
  modalItems.appendChild(receiptHeader);
  
  cart.forEach(item => {
    const line = document.createElement('div');
    line.style.display = 'flex';
    line.style.justifyContent = 'space-between';
    line.style.padding = '0.5rem 0';
    line.style.borderBottom = '1px solid hsl(13, 31%, 94%)';
    
    const itemInfo = document.createElement('span');
    itemInfo.textContent = `${item.quantity}x ${item.title}`;
    
    const itemPrice = document.createElement('span');
    itemPrice.textContent = `$${(item.quantity * item.price).toFixed(2)}`;
    itemPrice.style.fontWeight = '600';
    
    line.appendChild(itemInfo);
    line.appendChild(itemPrice);
    modalItems.appendChild(line);
    total += item.quantity * item.price;
  });
  
  let voucherApplied = false;
  let voucherInfo = null;
  try {
    const appliedVoucher = localStorage.getItem('appliedVoucher');
    if (appliedVoucher) {
      voucherInfo = JSON.parse(appliedVoucher);
      if (total >= voucherInfo.minOrder) {
        voucherApplied = true;
        if (voucherInfo.discount > 0) {
          const discountAmount = total * voucherInfo.discount;
          total -= discountAmount;
          
          const voucherLine = document.createElement('div');
          voucherLine.style.display = 'flex';
          voucherLine.style.justifyContent = 'space-between';
          voucherLine.style.padding = '0.5rem 0';
          voucherLine.style.borderBottom = '1px solid hsl(13, 31%, 94%)';
          voucherLine.style.color = 'hsl(159, 69%, 38%)';
          
          const voucherLabel = document.createElement('span');
          voucherLabel.textContent = `Voucher: ${voucherInfo.code}`;
          
          const voucherAmount = document.createElement('span');
          voucherAmount.textContent = `-$${discountAmount.toFixed(2)}`;
          voucherAmount.style.fontWeight = '600';
          
          voucherLine.appendChild(voucherLabel);
          voucherLine.appendChild(voucherAmount);
          modalItems.appendChild(voucherLine);
        }
      }
    }
  } catch (error) {
    console.error('Error checking voucher in modal:', error);
  }
  
  if (!voucherApplied && total > 50) {
    const discountLine = document.createElement('div');
    discountLine.style.display = 'flex';
    discountLine.style.justifyContent = 'space-between';
    discountLine.style.padding = '0.5rem 0';
    discountLine.style.borderBottom = '1px solid hsl(13, 31%, 94%)';
    discountLine.style.color = 'hsl(159, 69%, 38%)';
    
    const discountLabel = document.createElement('span');
    discountLabel.textContent = 'Discount (10%)';
    
    const discountAmount = document.createElement('span');
    discountAmount.textContent = `-$${(total / 0.9 * 0.1).toFixed(2)}`;
    discountAmount.style.fontWeight = '600';
    
    discountLine.appendChild(discountLabel);
    discountLine.appendChild(discountAmount);
    modalItems.appendChild(discountLine);
    
    total *= 0.9;
  }
  
  modalTemplate.querySelector('#modal-total').textContent = total.toFixed(2);
  
  const orderNumber = document.createElement('p');
  orderNumber.textContent = `Order #${Date.now().toString().slice(-6)}`;
  orderNumber.style.fontSize = '0.875rem';
  orderNumber.style.color = 'hsl(7, 20%, 60%)';
  orderNumber.style.marginTop = '1rem';
  modalItems.appendChild(orderNumber);

  modalTemplate.querySelector('#print-receipt').addEventListener('click', () => {
    printReceipt(cart, total);
  });
  
  document.body.appendChild(modalTemplate);
}

export function setupModal() {
  document.body.addEventListener('click', e => {
    if (e.target.classList.contains('modal')) {
      e.target.remove();
    }
  });
}

function printReceipt(cart, total) {
  const printWindow = window.open('', '_blank');
  const orderNumber = Date.now().toString().slice(-6);
  const date = new Date().toLocaleDateString();
  const time = new Date().toLocaleTimeString();
  
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Receipt</title>
      <style>
        body { font-family: 'Courier New', monospace; font-size: 12px; }
        .receipt { max-width: 300px; margin: 0 auto; }
        .header { text-align: center; border-bottom: 1px solid #000; padding-bottom: 10px; margin-bottom: 10px; }
        .item { display: flex; justify-content: space-between; margin: 5px 0; }
        .total { border-top: 1px solid #000; padding-top: 10px; margin-top: 10px; font-weight: bold; }
        .footer { text-align: center; margin-top: 20px; font-size: 10px; }
      </style>
    </head>
    <body>
      <div class="receipt">
        <div class="header">
          <h2>Dessert Shop</h2>
          <p>Order #${orderNumber}</p>
          <p>${date} ${time}</p>
        </div>
        ${cart.map(item => `
          <div class="item">
            <span>${item.quantity}x ${item.title}</span>
            <span>$${(item.quantity * item.price).toFixed(2)}</span>
          </div>
        `).join('')}
        ${total > 50 ? `
          <div class="item">
            <span>Discount (10%)</span>
            <span>-$${(total / 0.9 * 0.1).toFixed(2)}</span>
          </div>
        ` : ''}
        <div class="total">
          <span>Total:</span>
          <span>$${total.toFixed(2)}</span>
        </div>
        <div class="footer">
          <p>Thank you for your order!</p>
          <p>We hope you enjoy your desserts!</p>
        </div>
      </div>
    </body>
    </html>
  `);
  
  printWindow.document.close();
  printWindow.print();
}
