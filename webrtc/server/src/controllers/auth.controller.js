import User from '../models/User.model.js';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../services/token.service.js';
import {
  saveRefreshToken,
  deleteRefreshToken,
  deleteAllUserTokens,
} from '../config/redis.js';
import logger from '../utils/logger.js';

export const register = async (req, res, next) => {
  try {
    const { email, password, name } = req.validatedBody || req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    // Create new user
    const user = await User.create({
      email,
      password,
      name,
    });

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Save refresh token to Redis
    await saveRefreshToken(user._id.toString(), refreshToken, {
      userAgent: req.headers['user-agent'],
      ip: req.ip,
    });

    logger.info(`New user registered: ${email}`);

    res.status(201).json({
      message: 'User registered successfully',
      user: user.toPublicProfile(),
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.validatedBody || req.body;

    // Find user with password field
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Save refresh token to Redis
    await saveRefreshToken(user._id.toString(), refreshToken, {
      userAgent: req.headers['user-agent'],
      ip: req.ip,
    });

    // Update last seen
    user.lastSeen = new Date();
    await user.save();

    logger.info(`User logged in: ${email}`);

    res.status(200).json({
      message: 'Login successful',
      user: user.toPublicProfile(),
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

export const refreshAccessToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token required' });
    }

    // Verify refresh token
    const decoded = await verifyRefreshToken(refreshToken);

    if (!decoded) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    // Check if user exists
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Generate new tokens (token rotation)
    const newAccessToken = generateAccessToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    // Delete old refresh token
    await deleteRefreshToken(decoded.userId, refreshToken);

    // Save new refresh token
    await saveRefreshToken(user._id.toString(), newRefreshToken, {
      userAgent: req.headers['user-agent'],
      ip: req.ip,
    });

    res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (refreshToken && req.userId) {
      // Delete specific refresh token
      await deleteRefreshToken(req.userId.toString(), refreshToken);
    }

    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    next(error);
  }
};

export const logoutAll = async (req, res, next) => {
  try {
    // Delete all refresh tokens for this user
    await deleteAllUserTokens(req.userId.toString());

    res.status(200).json({ message: 'Logged out from all devices' });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    res.status(200).json({
      user: req.user.toPublicProfile(),
    });
  } catch (error) {
    next(error);
  }
};