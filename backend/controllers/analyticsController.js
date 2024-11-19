const Order = require('../models/Order');
const Product = require('../models/Product');
const Category = require('../models/Category');
const User = require('../models/User');

const getAnalytics = async (req, res) => {
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
        const categoryName = product.category.name || 'Sin categoría';
        acc[categoryName] = (acc[categoryName] || 0) + product.quantity;
      }
      return acc;
    }, {});

    const ordersByStatus = orders.reduce((acc, order) => {
      const status = order.status.toLowerCase();
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    const analyticsData = {
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

    res.json(analyticsData);
  } catch (error) {
    console.error('Error en getAnalytics:', error);
    res.status(500).json({ error: 'Error al obtener analytics' });
  }
};

module.exports = { getAnalytics };