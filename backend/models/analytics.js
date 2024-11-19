const Order = require('./Order');
const Product = require('./Product');
const Category = require('./Category');
const User = require('./User');

const getAnalyticsData = async () => {
  try {
    const [orders, products, categories, users] = await Promise.all([
      Order.find().populate('items.product'),
      Product.find().populate('category'),
      Category.find(),
      User.find()
    ]);

    const salesByMonth = orders.reduce((acc, order) => {
      const month = new Date(order.createdAt).toLocaleString('default', { month: 'short' });
      acc[month] = (acc[month] || 0) + order.total;
      return acc;
    }, {});

    const topProducts = orders.reduce((acc, order) => {
      order.items.forEach(item => {
        acc[item.name] = (acc[item.name] || 0) + item.quantity;
      });
      return acc;
    }, {});

    const stockByCategory = products.reduce((acc, product) => {
      if (product.category) {
        acc[product.category.name] = (acc[product.category.name] || 0) + product.quantity;
      }
      return acc;
    }, {});

    const ordersByStatus = orders.reduce((acc, order) => {
      acc[order.status.toLowerCase()] = (acc[order.status.toLowerCase()] || 0) + 1;
      return acc;
    }, {});

    return {
      salesByMonth: Object.entries(salesByMonth).map(([month, total]) => ({
        month,
        total
      })),
      topProducts: Object.entries(topProducts)
        .map(([name, quantity]) => ({ name, quantity }))
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 5),
      stockByCategory: Object.entries(stockByCategory).map(([category, stock]) => ({
        category,
        stock
      })),
      ordersByStatus,
      totalUsers: users.length,
      totalOrders: orders.length,
      totalProducts: products.length,
      averageOrderValue: orders.length 
        ? orders.reduce((acc, order) => acc + order.total, 0) / orders.length 
        : 0
    };
  } catch (error) {
    console.error('Error getting analytics data:', error);
    throw error;
  }
};

module.exports = { getAnalyticsData };