// ============================================
// server/src/routes/message.routes.js
// ============================================
import express from 'express';
import multer from 'multer';
import { authenticate } from '../middleware/auth.middleware.js';
import { uploadLimiter, messageLimiter } from '../middleware/rateLimiter.middleware.js';
import Message from '../models/message.model.js';
import Conversation from '../models/conversation.model.js';
import { uploadFile } from '../services/upload.service.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/temp/' });

// Get messages for a conversation
router.get('/:conversationId', authenticate, async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    const { page = 1, limit = 50, before } = req.query;

    // Verify conversation access
    const conversation = await Conversation.findById(conversationId);
    if (!conversation || !conversation.isParticipant(req.userId)) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const query = {
      conversationId,
      isDeleted: false,
    };

    // Cursor-based pagination
    if (before) {
      query.createdAt = { $lt: new Date(before) };
    }

    const messages = await Message.find(query)
      .populate('sender', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json({ messages: messages.reverse() });
  } catch (error) {
    next(error);
  }
});

// Upload file
router.post(
  '/upload',
  authenticate,
  uploadLimiter,
  upload.single('file'),
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const fileData = await uploadFile(req.file);

      res.json({
        file: fileData,
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;