import { User } from '../models/model.js';
import bcrypt from 'bcryptjs';

// Get user profile
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id
    const user = await User.findOne({ _id: userId }).select('_id email name');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userObj = user.toObject();
    userObj.id = userObj._id;
    delete userObj._id;
    res.json(userObj);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user' });
  }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const data = { ...req.body };
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    const user = await User.findByIdAndUpdate(
        userId,
        data,
        { new: true, fields: { _id: 1, email: 1, name: 1 } }
    );
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const userObj = user.toObject();
    userObj.id = userObj._id;
    delete userObj._id;
    res.json(userObj);
  } catch (err) {
    res.status(500).json({ message: 'Error updating user' });
  }
};
