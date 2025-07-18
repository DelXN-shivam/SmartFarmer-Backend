import User from '../models/User.js';
import { generateToken } from '../middleware/authentication.js';
import logger from '../config/logger.js';

export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      // role
    });

    const token = generateToken({ id: user._id });
    // const token = generateToken({ id: user._id, role: user.role });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      // role: user.role,
      token
    });
  } catch (error) {
    logger.error('Registration error', error);
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      // const token = generateToken({ id: user._id, role: user.role });
      const token = generateToken({ id: user._id });

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        // role: user.role,
        token
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    logger.error('Login error', error);
    next(error);
  }
};

export const  getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    logger.error('Get profile error', error);
    next(error);
  }
};

export const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.name = req.body.name || user.name;
    // user.role = req.body.role || user.role;
    
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      // role: updatedUser.role
    });
  } catch (error) {
    logger.error('Update profile error', error);
    next(error);
  }
};
