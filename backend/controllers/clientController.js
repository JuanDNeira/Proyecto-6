exports.getProfile = async (req, res) => {
    res.json(req.user);
  };
  
  exports.updateProfile = async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));
  
    if (!isValidOperation) {
      return res.status(400).send({ error: 'Invalid updates!' });
    }
  
    try {
      updates.forEach(update => req.user[update] = req.body[update]);
      await req.user.save();
      res.json(req.user);
    } catch (error) {
      res.status(400).send(error);
    }
  };
  