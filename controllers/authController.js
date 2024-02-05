const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Account with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const latestUser = await User.findOne({}, {}, { sort: { 'userId': -1 } });
    let latestUserId = 0;

    if (latestUser) {
      latestUserId = latestUser.userId || 0;
    }

    const newUser = new User({ userId: latestUserId + 1, email, password: hashedPassword, name });
    
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) return res.status(401).json({ message: 'Invalid credentials' });

    const accessToken = jwt.sign({ email: user.email, name: user.name }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ email: user.email, name: user.name }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

    res.json({ accessToken, refreshToken });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const invalidRefreshTokens = [];

const logout = (req, res) => {
  const refreshToken = req.header('Authorization');

  if (invalidRefreshTokens.includes(refreshToken)) {
    return res.status(401).json({ message: 'Refresh token is already invalidated' });
  }

  invalidRefreshTokens.push(refreshToken);

  res.json({ message: 'Logout successful' });
};

module.exports = { register, login, logout };