import User from '../models/User.js';

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.status(200).json(users);
  } catch (error) {
    console.error('Error in getAllUsers controller: ' + error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({ _id: id }).select('-password');
    res.status(200).json(user);
  } catch (error) {
    console.error('Error in getUserById controller: ' + error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email } = req.body;

    const user = await User.findOneAndUpdate(
      { _id: id },
      { firstName, lastName, email },
      { returnDocument: 'after' },
    );

    if (!user) return res.status(400).json({ message: 'Invalid creditials' });

    res.status(200).json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('Error in updateUser controller: ' + error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findOneAndDelete({ _id: id });

    if (!user) return res.status(400).json({ message: 'Invalid creditials' });

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error in deleteUser controller: ' + error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};
