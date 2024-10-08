exports.getDashboard = async (req, res) => {
    res.json({ message: 'Admin dashboard data' });
  };
  
  exports.getAllUsers = async (req, res) => {
    try {
      const users = await User.find({}).select('-password');
      res.json(users);
    } catch (error) {
      res.status(500).send(error);
    }
  };