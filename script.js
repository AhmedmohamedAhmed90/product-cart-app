import { loadProducts } from './js/products.js';
import { setupCart } from './js/cart.js';
import { loadCartFromStorage } from './js/storage.js';
import { showModal, setupModal, renderMainLayout } from './js/ui.js';
import { userManager } from './js/users.js';
import { componentLoader } from './js/component-loader.js';

function loadCSSFiles() {
  const cssFiles = [
    './styles/main.css',
    './styles/products.css',
    './styles/cart.css',
    './styles/modal.css',
    './styles/user-interface.css'
  ];

  cssFiles.forEach(cssFile => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = cssFile;
    document.head.appendChild(link);
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  console.log('DOM Content Loaded - Starting application...');
  
  loadCSSFiles();
  
  try {
    console.log('Loading components...');
    await componentLoader.loadAllComponents();
  } catch (error) {
    console.error('Error loading components:', error);
  }
  
  try {
    console.log('Rendering main layout...');
    renderMainLayout();
  } catch (error) {
    console.error('Error rendering main layout:', error);
  }
  
  try {
    console.log('Loading products...');
    loadProducts();
  } catch (error) {
    console.error('Error loading products:', error);
  }
  
  try {
    console.log('Setting up cart...');
    setupCart();
  } catch (error) {
    console.error('Error setting up cart:', error);
  }
  
  try {
    console.log('Loading cart from storage...');
    loadCartFromStorage();
  } catch (error) {
    console.error('Error loading cart from storage:', error);
  }
  
  try {
    console.log('Setting up modal...');
    setupModal();
  } catch (error) {
    console.error('Error setting up modal:', error);
  }
  
  try {
    console.log('Setting up user interface...');
    setupUserInterface();
  } catch (error) {
    console.error('Error setting up user interface:', error);
  }
  
  console.log('Application initialization complete');
});

function setupUserInterface() {
  try {
    const currentUser = userManager.getCurrentUser();
    const user = userManager.getUser(currentUser);
    
    if (user) {
      const welcomeDiv = document.createElement('div');
      welcomeDiv.className = 'user-welcome';
      welcomeDiv.innerHTML = `
        <p>Welcome, ${user.name}!</p>
        <button id="user-menu-btn">Account</button>
      `;
      welcomeDiv.style.cssText = `
        position: fixed;
        top: 1rem;
        right: 1rem;
        background: white;
        padding: 0.5rem 1rem;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        z-index: 100;
      `;
      document.body.appendChild(welcomeDiv);
      
      const userMenuBtn = document.getElementById('user-menu-btn');
      if (userMenuBtn) {
        userMenuBtn.addEventListener('click', showUserMenu);
      }
    }
  } catch (error) {
    console.error('Error in setupUserInterface:', error);
  }
}

function showUserMenu() {
  try {
    const currentUser = userManager.getCurrentUser();
    const user = userManager.getUser(currentUser);
    const stats = userManager.getUserStats(currentUser);
    
    const menu = document.createElement('div');
    menu.className = 'user-menu';
    menu.innerHTML = `
      <div class="user-menu-content">
        <h3>Account</h3>
        <p><strong>Name:</strong> ${user ? user.name : 'Unknown'}</p>
        <p><strong>Total Orders:</strong> ${stats ? stats.totalOrders : 0}</p>
        <p><strong>Total Spent:</strong> $${stats ? stats.totalSpent.toFixed(2) : '0.00'}</p>
        <p><strong>Favorite Items:</strong> ${stats && stats.favoriteItems ? stats.favoriteItems.join(', ') : 'None yet'}</p>
        
        <div class="menu-actions">
          <button id="change-name">Change Name</button>
          <button id="add-voucher">Add Voucher</button>
          <button id="view-history">View Order History</button>
          <button id="close-menu">Close</button>
        </div>
      </div>
    `;
    
    menu.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    `;
    
    const content = menu.querySelector('.user-menu-content');
    content.style.cssText = `
      background: white;
      padding: 2rem;
      border-radius: 12px;
      max-width: 400px;
      width: 90%;
      max-height: 80vh;
      overflow-y: auto;
    `;
    
    const menuActions = menu.querySelector('.menu-actions');
    menuActions.style.cssText = `
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-top: 1rem;
    `;
    
    const buttons = menuActions.querySelectorAll('button');
    buttons.forEach(button => {
      button.style.cssText = `
        padding: 0.5rem 1rem;
        border: 1px solid hsl(14, 86%, 42%);
        background: white;
        color: hsl(14, 86%, 42%);
        border-radius: 6px;
        cursor: pointer;
        font-size: 0.875rem;
        transition: all 0.2s;
      `;
      
      button.addEventListener('mouseenter', () => {
        button.style.background = 'hsl(14, 86%, 42%)';
        button.style.color = 'white';
      });
      
      button.addEventListener('mouseleave', () => {
        button.style.background = 'white';
        button.style.color = 'hsl(14, 86%, 42%)';
      });
    });
    
    document.body.appendChild(menu);
    
    const closeBtn = menu.querySelector('#close-menu');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => menu.remove());
    }
    
    const viewHistoryBtn = menu.querySelector('#view-history');
    if (viewHistoryBtn) {
      viewHistoryBtn.addEventListener('click', () => {
        menu.remove();
        showOrderHistory();
      });
    }
    
    const changeNameBtn = menu.querySelector('#change-name');
    if (changeNameBtn) {
      changeNameBtn.addEventListener('click', () => {
        menu.remove();
        showChangeNameDialog();
      });
    }
    
    const addVoucherBtn = menu.querySelector('#add-voucher');
    if (addVoucherBtn) {
      addVoucherBtn.addEventListener('click', () => {
        menu.remove();
        showVoucherDialog();
      });
    }
    
    menu.addEventListener('click', (e) => {
      if (e.target === menu) menu.remove();
    });
  } catch (error) {
    console.error('Error in showUserMenu:', error);
  }
}

function showOrderHistory() {
  try {
    const currentUser = userManager.getCurrentUser();
    const history = userManager.getUserOrderHistory(currentUser);
    
    const historyModal = document.createElement('div');
    historyModal.className = 'history-modal';
    historyModal.innerHTML = `
      <div class="history-content">
        <h3>Order History</h3>
        ${history.length === 0 ? '<p>No orders yet.</p>' : ''}
        ${history.map(order => `
          <div class="order-item">
            <h4>Order #${order.orderNumber || 'Unknown'}</h4>
            <p><strong>Date:</strong> ${new Date(order.date).toLocaleDateString()}</p>
            <p><strong>Total:</strong> $${order.total ? order.total.toFixed(2) : '0.00'}</p>
            <p><strong>Items:</strong> ${order.items ? order.items.map(item => `${item.quantity}x ${item.title}`).join(', ') : 'No items'}</p>
          </div>
        `).join('')}
        <button id="close-history">Close</button>
      </div>
    `;
    
    historyModal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    `;
    
    const content = historyModal.querySelector('.history-content');
    content.style.cssText = `
      background: white;
      padding: 2rem;
      border-radius: 12px;
      max-width: 600px;
      width: 90%;
      max-height: 80vh;
      overflow-y: auto;
    `;
    
    const orderItems = historyModal.querySelectorAll('.order-item');
    orderItems.forEach(item => {
      item.style.cssText = `
        border: 1px solid hsl(13, 31%, 94%);
        border-radius: 8px;
        padding: 1rem;
        margin-bottom: 1rem;
      `;
    });
    
    document.body.appendChild(historyModal);
    
    const closeBtn = historyModal.querySelector('#close-history');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => historyModal.remove());
    }
    
    historyModal.addEventListener('click', (e) => {
      if (e.target === historyModal) historyModal.remove();
    });
  } catch (error) {
    console.error('Error in showOrderHistory:', error);
  }
}

function showChangeNameDialog() {
  try {
    const currentUser = userManager.getCurrentUser();
    const user = userManager.getUser(currentUser);
    
    const dialog = document.createElement('div');
    dialog.className = 'name-dialog';
    dialog.innerHTML = `
      <div class="dialog-content">
        <h3>Change Your Name</h3>
        <p>Current name: <strong>${user ? user.name : 'Guest'}</strong></p>
        <div class="input-group">
          <label for="new-name">New Name:</label>
          <input type="text" id="new-name" placeholder="Enter your new name" value="${user ? user.name : ''}">
        </div>
        <div class="dialog-actions">
          <button id="save-name">Save</button>
          <button id="cancel-name">Cancel</button>
        </div>
      </div>
    `;
    
    dialog.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    `;
    
    const content = dialog.querySelector('.dialog-content');
    content.style.cssText = `
      background: white;
      padding: 2rem;
      border-radius: 12px;
      max-width: 400px;
      width: 90%;
    `;
    
    const inputGroup = dialog.querySelector('.input-group');
    inputGroup.style.cssText = `
      margin: 1rem 0;
    `;
    
    const label = dialog.querySelector('label');
    label.style.cssText = `
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
      color: hsl(14, 65%, 9%);
    `;
    
    const input = dialog.querySelector('#new-name');
    input.style.cssText = `
      width: 100%;
      padding: 0.75rem;
      border: 1px solid hsl(13, 31%, 94%);
      border-radius: 6px;
      font-size: 1rem;
      box-sizing: border-box;
    `;
    
    const dialogActions = dialog.querySelector('.dialog-actions');
    dialogActions.style.cssText = `
      display: flex;
      gap: 0.5rem;
      justify-content: flex-end;
      margin-top: 1.5rem;
    `;
    
    const buttons = dialogActions.querySelectorAll('button');
    buttons.forEach(button => {
      button.style.cssText = `
        padding: 0.5rem 1rem;
        border: 1px solid hsl(14, 86%, 42%);
        background: white;
        color: hsl(14, 86%, 42%);
        border-radius: 6px;
        cursor: pointer;
        font-size: 0.875rem;
        transition: all 0.2s;
      `;
      
      button.addEventListener('mouseenter', () => {
        button.style.background = 'hsl(14, 86%, 42%)';
        button.style.color = 'white';
      });
      
      button.addEventListener('mouseleave', () => {
        button.style.background = 'white';
        button.style.color = 'hsl(14, 86%, 42%)';
      });
    });
    
    document.body.appendChild(dialog);
    
    input.focus();
    
    const saveBtn = dialog.querySelector('#save-name');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        const newName = input.value.trim();
        if (newName) {
          userManager.saveUser(currentUser, { ...user, name: newName });
          dialog.remove();
          
          const welcomeDiv = document.querySelector('.user-welcome');
          if (welcomeDiv) {
            welcomeDiv.innerHTML = `
              <p>Welcome, ${newName}!</p>
              <button id="user-menu-btn">Account</button>
            `;
            const userMenuBtn = welcomeDiv.querySelector('#user-menu-btn');
            if (userMenuBtn) {
              userMenuBtn.addEventListener('click', showUserMenu);
            }
          }
          
          alert('Name updated successfully!');
        } else {
          alert('Please enter a valid name');
        }
      });
    }
    
    const cancelBtn = dialog.querySelector('#cancel-name');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => dialog.remove());
    }
    
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        saveBtn.click();
      }
    });
    
    dialog.addEventListener('click', (e) => {
      if (e.target === dialog) dialog.remove();
    });
  } catch (error) {
    console.error('Error in showChangeNameDialog:', error);
  }
}

function showVoucherDialog() {
  try {
    const dialog = document.createElement('div');
    dialog.className = 'voucher-dialog';
    dialog.innerHTML = `
      <div class="dialog-content">
        <h3>Add Discount Voucher</h3>
        <p>Enter a voucher code to get additional discounts on your order.</p>
        <div class="input-group">
          <label for="voucher-code">Voucher Code:</label>
          <input type="text" id="voucher-code" placeholder="Enter voucher code">
        </div>
        <div class="voucher-info">
          <p><strong>Available Vouchers:</strong></p>
          <ul>
            <li><code>WELCOME10</code> - 10% off your first order</li>
            <li><code>SAVE20</code> - 20% off orders over $30</li>
            <li><code>FREESHIP</code> - Free shipping on orders over $25</li>
          </ul>
        </div>
        <div class="dialog-actions">
          <button id="apply-voucher">Apply Voucher</button>
          <button id="cancel-voucher">Cancel</button>
        </div>
      </div>
    `;
    
    dialog.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    `;
    
    const content = dialog.querySelector('.dialog-content');
    content.style.cssText = `
      background: white;
      padding: 2rem;
      border-radius: 12px;
      max-width: 500px;
      width: 90%;
      max-height: 80vh;
      overflow-y: auto;
    `;
    
    const inputGroup = dialog.querySelector('.input-group');
    inputGroup.style.cssText = `
      margin: 1rem 0;
    `;
    
    const label = dialog.querySelector('label');
    label.style.cssText = `
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
      color: hsl(14, 65%, 9%);
    `;
    
    const input = dialog.querySelector('#voucher-code');
    input.style.cssText = `
      width: 100%;
      padding: 0.75rem;
      border: 1px solid hsl(13, 31%, 94%);
      border-radius: 6px;
      font-size: 1rem;
      box-sizing: border-box;
      text-transform: uppercase;
    `;
    
    const voucherInfo = dialog.querySelector('.voucher-info');
    voucherInfo.style.cssText = `
      margin: 1rem 0;
      padding: 1rem;
      background: hsl(13, 31%, 94%);
      border-radius: 6px;
    `;
    
    const voucherList = voucherInfo.querySelector('ul');
    voucherList.style.cssText = `
      margin: 0.5rem 0;
      padding-left: 1.5rem;
    `;
    
    const voucherItems = voucherList.querySelectorAll('li');
    voucherItems.forEach(item => {
      item.style.cssText = `
        margin: 0.25rem 0;
      `;
    });
    
    const codeElements = voucherInfo.querySelectorAll('code');
    codeElements.forEach(code => {
      code.style.cssText = `
        background: white;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-family: monospace;
        font-weight: 600;
      `;
    });
    
    const dialogActions = dialog.querySelector('.dialog-actions');
    dialogActions.style.cssText = `
      display: flex;
      gap: 0.5rem;
      justify-content: flex-end;
      margin-top: 1.5rem;
    `;
    
    const buttons = dialogActions.querySelectorAll('button');
    buttons.forEach(button => {
      button.style.cssText = `
        padding: 0.5rem 1rem;
        border: 1px solid hsl(14, 86%, 42%);
        background: white;
        color: hsl(14, 86%, 42%);
        border-radius: 6px;
        cursor: pointer;
        font-size: 0.875rem;
        transition: all 0.2s;
      `;
      
      button.addEventListener('mouseenter', () => {
        button.style.background = 'hsl(14, 86%, 42%)';
        button.style.color = 'white';
      });
      
      button.addEventListener('mouseleave', () => {
        button.style.background = 'white';
        button.style.color = 'hsl(14, 86%, 42%)';
      });
    });
    
    document.body.appendChild(dialog);
    
    input.focus();
    
    const applyBtn = dialog.querySelector('#apply-voucher');
    if (applyBtn) {
      applyBtn.addEventListener('click', () => {
        const voucherCode = input.value.trim().toUpperCase();
        if (voucherCode) {
          applyVoucher(voucherCode);
          dialog.remove();
        } else {
          alert('Please enter a voucher code');
        }
      });
    }
    
    const cancelBtn = dialog.querySelector('#cancel-voucher');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => dialog.remove());
    }
    
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        applyBtn.click();
      }
    });
    
    dialog.addEventListener('click', (e) => {
      if (e.target === dialog) dialog.remove();
    });
  } catch (error) {
    console.error('Error in showVoucherDialog:', error);
  }
}

function applyVoucher(voucherCode) {
  try {
    const validVouchers = {
      'WELCOME10': { discount: 0.10, description: '10% off your first order', minOrder: 0 },
      'SAVE20': { discount: 0.20, description: '20% off orders over $30', minOrder: 30 },
      'FREESHIP': { discount: 0, description: 'Free shipping on orders over $25', minOrder: 25, freeShipping: true }
    };
    
    const voucher = validVouchers[voucherCode];
    if (!voucher) {
      alert('Invalid voucher code. Please try again.');
      return;
    }
    
    localStorage.setItem('appliedVoucher', JSON.stringify({
      code: voucherCode,
      ...voucher,
      appliedAt: new Date().toISOString()
    }));
    
    updateCartWithVoucher();
    
    alert(`Voucher applied successfully! ${voucher.description}`);
  } catch (error) {
    console.error('Error applying voucher:', error);
    alert('Error applying voucher. Please try again.');
  }
}

function updateCartWithVoucher() {
  try {
    const appliedVoucher = localStorage.getItem('appliedVoucher');
    if (appliedVoucher) {
      const voucher = JSON.parse(appliedVoucher);
      
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      let totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      if (totalPrice >= voucher.minOrder) {
        if (voucher.discount > 0) {
          totalPrice *= (1 - voucher.discount);
        }
        
        const cartContainer = document.getElementById('cart-items');
        if (cartContainer) {
          const voucherInfo = document.createElement('div');
          voucherInfo.style.cssText = `
            background: hsl(159, 69%, 38%);
            color: white;
            padding: 0.5rem;
            border-radius: 6px;
            margin: 0.5rem 0;
            font-size: 0.875rem;
            font-weight: 600;
          `;
          voucherInfo.textContent = `🎉 ${voucher.description} applied!`;
          cartContainer.appendChild(voucherInfo);
        }
        
        const totalElement = document.getElementById('cart-total');
        if (totalElement) {
          totalElement.textContent = totalPrice.toFixed(2);
        }
      }
    }
  } catch (error) {
    console.error('Error updating cart with voucher:', error);
  }
}
