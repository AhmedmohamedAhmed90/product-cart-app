export class Modal {
  constructor() {
    this.element = null;
  }

  showOrderConfirmation(cart, receiptGenerator) {
    const template = document.getElementById('modal-component');
    if (!template) {
      console.error('Modal template not found');
      return;
    }

    this.element = template.content.cloneNode(true);
    const modalItems = this.element.querySelector('#modal-items');
    
    const modalContent = receiptGenerator.generateModalContent(cart);
    modalItems.innerHTML = modalContent.items;
    this.element.querySelector('#modal-total').textContent = modalContent.total;

    const printBtn = this.element.querySelector('#print-receipt');
    printBtn.addEventListener('click', () => {
      receiptGenerator.printReceipt(cart);
    });
    
    this.element.querySelector('.modal').addEventListener('click', (e) => {
      if (e.target.classList.contains('modal')) {
        this.close();
      }
    });
    
    document.body.appendChild(this.element);
  }

  showUserMenu(user, stats) {
    const modalHTML = `
      <div class="modal">
        <div class="modal-content">
          <h3>Account</h3>
          <p><strong>Name:</strong> ${user.name}</p>
          <p><strong>Total Orders:</strong> ${stats.totalOrders}</p>
          <p><strong>Total Spent:</strong> $${stats.totalSpent.toFixed(2)}</p>
          <p><strong>Favorite Items:</strong> ${stats.favoriteItems.join(', ') || 'None yet'}</p>
          <button id="view-history">View Order History</button>
          <button id="close-menu">Close</button>
        </div>
      </div>
    `;
    
    this.element = document.createElement('div');
    this.element.innerHTML = modalHTML;
    this.element = this.element.firstElementChild;
    
    this.element.querySelector('#close-menu').addEventListener('click', () => this.close());
    this.element.querySelector('#view-history').addEventListener('click', () => {
      this.close();
      document.dispatchEvent(new CustomEvent('showOrderHistory'));
    });
    
    this.element.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal')) {
        this.close();
      }
    });
    
    document.body.appendChild(this.element);
  }

  showOrderHistory(history) {
    const historyHTML = `
      <div class="modal">
        <div class="modal-content">
          <h3>Order History</h3>
          ${history.length === 0 ? '<p>No orders yet.</p>' : ''}
          ${history.map(order => `
            <div class="order-item">
              <h4>Order #${order.orderNumber}</h4>
              <p><strong>Date:</strong> ${new Date(order.date).toLocaleDateString()}</p>
              <p><strong>Total:</strong> $${order.total.toFixed(2)}</p>
              <p><strong>Items:</strong> ${order.items.map(item => `${item.quantity}x ${item.title}`).join(', ')}</p>
            </div>
          `).join('')}
          <button id="close-history">Close</button>
        </div>
      </div>
    `;
    
    this.element = document.createElement('div');
    this.element.innerHTML = historyHTML;
    this.element = this.element.firstElementChild;
    
    this.element.querySelector('#close-history').addEventListener('click', () => this.close());
    this.element.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal')) {
        this.close();
      }
    });
    
    document.body.appendChild(this.element);
  }

  close() {
    if (this.element) {
      this.element.remove();
      this.element = null;
    }
  }
} 