// ============================================
// server/src/routes/user.routes.js
// ============================================
import express from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { apiLimiter } from '../middleware/rateLimiter.middleware.js';

const router = express.Router();

router.get('/search', authenticate, apiLimiter, async (req, res, next) => {
  try {
    const { q, page = 1, limit = 20 } = req.query;
    const User = (await import('../models/User.model.js')).default;
    
    const skip = (page - 1) * limit;
    
    const query = q
      ? {
          $or: [
            { name: { $regex: q, $options: 'i' } },
            { email: { $regex: q, $options: 'i' } },
          ],
          _id: { $ne: req.userId },
        }
      : { _id: { $ne: req.userId } };

    const users = await User.find(query)
      .select('name email avatar statusMessage isOnline lastSeen')
      .limit(parseInt(limit))
      .skip(skip);

    const total = await User.countDocuments(query);

    res.json({
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
});

router.get('/:userId', authenticate, async (req, res, next) => {
  try {
    const User = (await import('../models/User.model.js')).default;
    const user = await User.findById(req.params.userId).select(
      'name email avatar statusMessage isOnline lastSeen'
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    next(error);
  }
});

router.patch('/profile', authenticate, async (req, res, next) => {
  try {
    const { name, statusMessage, avatar } = req.body;
    const User = (await import('../models/User.model.js')).default;

    const updates = {};
    if (name) updates.name = name;
    if (statusMessage !== undefined) updates.statusMessage = statusMessage;
    if (avatar !== undefined) updates.avatar = avatar;

    const user = await User.findByIdAndUpdate(req.userId, updates, {
      new: true,
      runValidators: true,
    }).select('-password');

    res.json({ user });
  } catch (error) {
    next(error);
  }
});

export default router;
