import Message from '../models/message.model.js';
import Conversation from '../models/conversation.model.js';
import logger from '../utils/logger.js';

export const registerSocketHandlers = (io, socket) => {
  const userId = socket.userId;

  // Join a conversation room
  socket.on('conversation:join', async (conversationId) => {
    try {
      const conversation = await Conversation.findById(conversationId);
      
      if (!conversation || !conversation.isParticipant(userId)) {
        socket.emit('error', { message: 'Not authorized to join this conversation' });
        return;
      }

      socket.join(`conversation:${conversationId}`);
      logger.info(`User ${userId} joined conversation ${conversationId}`);

      // Mark undelivered messages as delivered
      const undeliveredMessages = await Message.find({
        conversationId,
        sender: { $ne: userId },
        'deliveredTo.user': { $ne: userId },
      });

      for (const message of undeliveredMessages) {
        await message.markAsDelivered(userId);
        
        // Notify sender of delivery
        io.to(`user:${message.sender}`).emit('message:delivered', {
          messageId: message._id,
          conversationId,
          deliveredTo: userId,
        });
      }
    } catch (error) {
      logger.error('Error joining conversation:', error);
      socket.emit('error', { message: 'Failed to join conversation' });
    }
  });

  // Leave a conversation room
  socket.on('conversation:leave', (conversationId) => {
    socket.leave(`conversation:${conversationId}`);
    logger.info(`User ${userId} left conversation ${conversationId}`);
  });

  // Send a message
  socket.on('message:send', async (data) => {
    try {
      const { conversationId, content, type = 'text', replyTo } = data;

      // Verify conversation membership
      const conversation = await Conversation.findById(conversationId);
      
      if (!conversation || !conversation.isParticipant(userId)) {
        socket.emit('error', { message: 'Not authorized' });
        return;
      }

      // Create message
      const message = await Message.create({
        conversationId,
        sender: userId,
        content,
        type,
        replyTo,
      });

      // Populate sender info
      await message.populate('sender', 'name avatar');

      // Update conversation's last message
      conversation.lastMessage = message._id;
      conversation.lastMessageAt = message.createdAt;
      await conversation.save();

      // Emit to all participants in the conversation
      io.to(`conversation:${conversationId}`).emit('message:new', {
        message,
        conversationId,
      });

      // Send delivery notifications to online users
      const onlineParticipants = await getOnlineParticipants(conversation.participants, userId);
      
      for (const participantId of onlineParticipants) {
        await message.markAsDelivered(participantId);
        io.to(`user:${participantId}`).emit('message:delivered', {
          messageId: message._id,
          conversationId,
        });
      }

      // Acknowledge to sender
      socket.emit('message:ack', {
        tempId: data.tempId, // Client-side temporary ID
        messageId: message._id,
      });

      logger.info(`Message sent in conversation ${conversationId}`);
    } catch (error) {
      logger.error('Error sending message:', error);
      socket.emit('error', { message: 'Failed to send message' });
    }
  });

  // Mark message as read
  socket.on('message:read', async (data) => {
    try {
      const { messageId, conversationId } = data;

      const message = await Message.findById(messageId);
      
      if (!message) {
        return;
      }

      await message.markAsRead(userId);

      // Notify sender
      io.to(`user:${message.sender}`).emit('message:read', {
        messageId,
        conversationId,
        readBy: userId,
      });
    } catch (error) {
      logger.error('Error marking message as read:', error);
    }
  });

  // Typing indicator
  socket.on('typing:start', async (data) => {
    const { conversationId } = data;
    
    socket.to(`conversation:${conversationId}`).emit('typing:start', {
      userId,
      conversationId,
    });
  });

  socket.on('typing:stop', async (data) => {
    const { conversationId } = data;
    
    socket.to(`conversation:${conversationId}`).emit('typing:stop', {
      userId,
      conversationId,
    });
  });

  // Presence update
  socket.on('presence:update', async (data) => {
    const { status } = data;
    
    // Broadcast to all connections
    socket.broadcast.emit('presence:update', {
      userId,
      status,
      timestamp: Date.now(),
    });
  });
};

// Helper function to get online participants
const getOnlineParticipants = async (participants, excludeUserId) => {
  // This would check Redis for online status
  // For simplicity, returning empty array - implement based on your needs
  return [];
};