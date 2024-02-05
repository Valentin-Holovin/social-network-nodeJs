const User = require('../models/User');

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('email name photo userId');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getProfile = async (req, res) => {
  try {
    const { email, name, userId, photo } = req.user;

    const userProfile = { email, name, userId, photo };
    res.json(userProfile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const deleteUserById = async (req, res) => {
  try {
    const userId = req.params.userId;
    const deletedUser = await User.findOneAndDelete({ userId: userId });

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully', deletedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { name, email } = req.body;

    const user = await User.findOne({ userId: userId });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (name) {
      user.name = name;
    }
    if (email) {
      const existingUser = await User.findOne({ email });
      if (existingUser && existingUser.userId !== userId) {
        return res.status(400).json({ message: 'Email is already in use' });
      }
      user.email = email;
    }

    if (req.file) {
      user.photo = req.file.path;
    }

    await user.save();

    res.json({ message: 'User updated successfully', updatedUser: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const deletePhoto = async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findOne({ userId: userId });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.photo) {
      return res.status(400).json({ message: 'User does not have a photo to delete' });
    }

    user.photo = null;
    await user.save();

    res.json({ message: 'Photo deleted successfully', updatedUser: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = { getAllUsers, getProfile, deleteUserById, updateUser, deletePhoto };
