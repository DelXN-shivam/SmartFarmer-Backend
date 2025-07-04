import User from "../models/User";

export const registerUser = async (req, res, next) => {
  try {
    const { contact } = req.body;

    const userExists = await User.findOne({ contact });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
        contact
    });

    const token = generateToken({ id: user._id});

    res.status(201).json({
      _id: user._id,
      contact : user.contact,
      token
    });
  } catch (error) {
    logger.error('Registration error', error);
    next(error);
  }
};