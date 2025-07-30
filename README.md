# Product Cart App

### 🛒 **Shopping Cart**
- Add/remove products from cart
- Quantity controls with +/- buttons
- Real-time cart total calculation
- Persistent cart storage (localStorage)
- Empty cart state with illustration

### 🎫 **Discount System**
- Automatic 10% discount on orders over $50
- Voucher system with multiple codes:
  - `WELCOME10` - 10% off first order
  - `SAVE20` - 20% off orders over $30
  - `FREESHIP` - Free shipping on orders over $25
- Voucher validation and application
- Visual voucher indicators in cart

### 👤 **User Management**
- Guest user system with automatic creation
- User profile management
- Change user name functionality
- Order history tracking
- User statistics (total orders, spending, favorite items)

### 📱 **Responsive Design**
- Mobile-first responsive layout
- Adaptive grid system for products
- Touch-friendly interface
- Optimized for all screen sizes

### 🎨 **Modern UI/UX**
- Clean, minimalist design
- Smooth animations and transitions
- Hover effects and visual feedback
- Professional color scheme
- Shopping cart icons and visual elements

### 📄 **Order Management**
- Order confirmation modal
- Detailed order summary
- Print receipt functionality
- Order history view
- Order numbering system

## File Structure

```
product-cart-app/
├── assets/
│   └── images/                # Product images and icons
├── components/                # HTML component templates
│   ├── cart-item.html
│   ├── cart-section.html
│   ├── modal.html
│   ├── product-card.html
│   └── products-section.html
├── data/
│   └── data.json              # Product catalog
├── js/                        # JavaScript modules
│   ├── CartItem.js
│   ├── Modal.js
│   ├── ProductCard.js
│   ├── cart.js
│   ├── component-loader.js
│   ├── products.js
│   ├── storage.js
│   ├── ui.js
│   └── users.js
├── styles/                    # Modular CSS files
│   ├── cart.css
│   ├── main.css
│   ├── modal.css
│   ├── products.css
│   └── user-interface.css
├── index.html                 # Main HTML file (minimal)
├── script.js                  # Application entry point
└── README.md                  # This file
```

## How to Run the App


### Method 1: Using Python (Recommended)
```bash
# Navigate to the project directory
cd product-cart-app

# Start a local HTTP server
python -m http.server 8000

# Open your browser and go to:
# http://localhost:8000
```

### Method 2: Using Node.js
```bash
# Install a simple HTTP server globally
npm install -g http-server

# Navigate to the project directory
cd product-cart-app

# Start the server
http-server -p 8000
