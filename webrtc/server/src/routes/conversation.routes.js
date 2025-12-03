

// ============================================
// server/src/routes/conversation.routes.js
// ============================================
import express from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import Conversation from '../models/conversation.model.js';

const router = express.Router();

// Get all user's conversations
router.get('/', authenticate, async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const conversations = await Conversation.find({
      participants: req.userId,
    })
      .populate('participants', 'name email avatar isOnline lastSeen')
      .populate('lastMessage')
      .sort({ lastMessageAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Conversation.countDocuments({
      participants: req.userId,
    });

    res.json({
      conversations,
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

// Get or create direct conversation
router.post('/direct', authenticate, async (req, res, next) => {
  try {
    const { participantId } = req.body;

    if (!participantId) {
      return res.status(400).json({ error: 'Participant ID required' });
    }

    const conversation = await Conversation.findOrCreateDirect(
      req.userId,
      participantId
    );

    res.json({ conversation });
  } catch (error) {
    next(error);
  }
});

// Create group conversation
router.post('/group', authenticate, async (req, res, next) => {
  try {
    const { name, participants } = req.body;

    if (!name || !participants || participants.length < 2) {
      return res.status(400).json({
        error: 'Group name and at least 2 participants required',
      });
    }

    // Add creator to participants
    const allParticipants = [...new Set([req.userId.toString(), ...participants])];

    const conversation = await Conversation.create({
      type: 'group',
      name,
      participants: allParticipants,
      admins: [req.userId],
    });

    await conversation.populate('participants', 'name email avatar');

    res.status(201).json({ conversation });
  } catch (error) {
    next(error);
  }
});

// Get conversation by ID
router.get('/:conversationId', authenticate, async (req, res, next) => {
  try {
    const conversation = await Conversation.findById(req.params.conversationId)
      .populate('participants', 'name email avatar isOnline lastSeen')
      .populate('lastMessage');

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    // if (!conversation.isParticipant(req.userId)) {
    //   return res.status(403).json({ error: 'Not authorized' });
    // }

    res.json({ conversation });
  } catch (error) {
    next(error);
  }
});

export default router;
