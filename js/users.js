export class UserManager {
  constructor() {
    this.currentUser = this.getCurrentUser();
    this.users = this.getAllUsers();
  }

  getCurrentUser() {
    return localStorage.getItem('currentUser') || null;
  }

  setCurrentUser(userId) {
    localStorage.setItem('currentUser', userId);
    this.currentUser = userId;
  }

  getAllUsers() {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : {};
  }

  saveUsers() {
    localStorage.setItem('users', JSON.stringify(this.users));
  }

  saveUser(userId, userData = {}) {
    this.users[userId] = {
      id: userId,
      name: userData.name || 'Guest',
      email: userData.email || '',
      preferences: userData.preferences || {},
      orderHistory: userData.orderHistory || [],
      createdAt: userData.createdAt || new Date().toISOString(),
      lastVisit: new Date().toISOString()
    };
    this.saveUsers();
  }

  getUser(userId) {
    return this.users[userId] || null;
  }

  addOrderToHistory(userId, order) {
    if (!this.users[userId]) {
      this.saveUser(userId);
    }
    
    const orderRecord = {
      id: Date.now().toString(),
      items: order,
      total: this.calculateOrderTotal(order),
      date: new Date().toISOString(),
      orderNumber: Date.now().toString().slice(-6)
    };
    
    this.users[userId].orderHistory.push(orderRecord);
    this.users[userId].lastVisit = new Date().toISOString();
    this.saveUsers();
  }

  calculateOrderTotal(order) {
    let total = order.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (total > 50) total *= 0.9;
    return total;
  }

  getUserOrderHistory(userId) {
    const user = this.getUser(userId);
    return user ? user.orderHistory : [];
  }

  updateUserPreferences(userId, preferences) {
    if (!this.users[userId]) {
      this.saveUser(userId);
    }
    this.users[userId].preferences = { ...this.users[userId].preferences, ...preferences };
    this.saveUsers();
  }

  generateUserId() {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  getGuestUser() {
    let guestId = localStorage.getItem('guestUserId');
    if (!guestId) {
      guestId = this.generateUserId();
      localStorage.setItem('guestUserId', guestId);
      this.saveUser(guestId, { name: 'Guest User' });
    }
    return guestId;
  }

  switchToGuest() {
    const guestId = this.getGuestUser();
    this.setCurrentUser(guestId);
    return guestId;
  }

  getUserStats(userId) {
    const user = this.getUser(userId);
    if (!user) return null;

    const totalOrders = user.orderHistory.length;
    const totalSpent = user.orderHistory.reduce((sum, order) => sum + order.total, 0);
    const favoriteItems = this.getFavoriteItems(userId);

    return {
      totalOrders,
      totalSpent,
      favoriteItems,
      memberSince: user.createdAt,
      lastVisit: user.lastVisit
    };
  }

  getFavoriteItems(userId) {
    const user = this.getUser(userId);
    if (!user) return [];

    const itemCounts = {};
    user.orderHistory.forEach(order => {
      order.items.forEach(item => {
        itemCounts[item.title] = (itemCounts[item.title] || 0) + item.quantity;
      });
    });

    return Object.entries(itemCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([title]) => title);
  }
}

export const userManager = new UserManager();

if (!userManager.getCurrentUser()) {
  userManager.switchToGuest();
} 