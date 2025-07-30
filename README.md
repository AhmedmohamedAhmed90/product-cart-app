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
├── components/                 # HTML component templates
│   ├── product-card.html      # Individual product display
│   ├── cart-item.html         # Cart item with controls
│   ├── modal.html             # Order confirmation modal
│   ├── products-section.html  # Products grid section
│   └── cart-section.html      # Shopping cart section
├── styles/                    # Modular CSS files
│   ├── main.css              # Base styles and layout
│   ├── products.css          # Product grid and cards
│   ├── cart.css              # Cart styling and buttons
│   ├── modal.css             # Modal and dialog styles
│   └── user-interface.css    # User menu and dialogs
├── js/                       # JavaScript modules
│   ├── component-loader.js   # Dynamic component loading
│   ├── products.js           # Product loading and rendering
│   ├── cart.js               # Cart functionality
│   ├── ui.js                 # UI rendering functions
│   ├── storage.js            # Local storage utilities
│   └── users.js              # User management system
├── data/                     # Application data
│   └── data.json            # Product catalog
├── assets/                   # Static assets
│   └── images/              # Product images and icons
├── index.html               # Main HTML file (minimal)
├── script.js                # Application entry point
└── README.md                # This file
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
