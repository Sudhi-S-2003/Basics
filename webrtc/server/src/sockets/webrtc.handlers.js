import logger from '../utils/logger.js';

export const registerWebRTCHandlers = (io, socket) => {
  const userId = socket.userId;

  // Initiate a call
  socket.on('call:initiate', async (data) => {
    try {
      const { targetUserId, conversationId } = data;

      logger.info(`Call initiated from ${userId} to ${targetUserId}`);

      // Notify the target user
      io.to(`user:${targetUserId}`).emit('call:incoming', {
        callerId: userId,
        conversationId,
        timestamp: Date.now(),
      });
    } catch (error) {
      logger.error('Error initiating call:', error);
      socket.emit('error', { message: 'Failed to initiate call' });
    }
  });

  // Send WebRTC offer
  socket.on('call:offer', async (data) => {
    try {
      const { targetUserId, offer, conversationId } = data;

      logger.info(`Call offer from ${userId} to ${targetUserId}`);

      // Forward offer to target user
      io.to(`user:${targetUserId}`).emit('call:offer', {
        callerId: userId,
        offer,
        conversationId,
      });
    } catch (error) {
      logger.error('Error sending call offer:', error);
      socket.emit('error', { message: 'Failed to send offer' });
    }
  });

  // Send WebRTC answer
  socket.on('call:answer', async (data) => {
    try {
      const { targetUserId, answer, conversationId } = data;

      logger.info(`Call answer from ${userId} to ${targetUserId}`);

      // Forward answer to caller
      io.to(`user:${targetUserId}`).emit('call:answer', {
        answerer: userId,
        answer,
        conversationId,
      });
    } catch (error) {
      logger.error('Error sending call answer:', error);
      socket.emit('error', { message: 'Failed to send answer' });
    }
  });

  // Exchange ICE candidates
  socket.on('call:ice-candidate', async (data) => {
    try {
      const { targetUserId, candidate, conversationId } = data;

      // Forward ICE candidate to peer
      io.to(`user:${targetUserId}`).emit('call:ice-candidate', {
        senderId: userId,
        candidate,
        conversationId,
      });
    } catch (error) {
      logger.error('Error exchanging ICE candidate:', error);
    }
  });

  // Hang up call
  socket.on('call:hangup', async (data) => {
    try {
      const { targetUserId, conversationId } = data;

      logger.info(`Call hangup from ${userId}`);

      // Notify peer
      io.to(`user:${targetUserId}`).emit('call:hangup', {
        userId,
        conversationId,
      });
    } catch (error) {
      logger.error('Error hanging up call:', error);
    }
  });

  // Call rejected
  socket.on('call:reject', async (data) => {
    try {
      const { callerId, conversationId } = data;

      logger.info(`Call rejected by ${userId}`);

      // Notify caller
      io.to(`user:${callerId}`).emit('call:rejected', {
        userId,
        conversationId,
      });
    } catch (error) {
      logger.error('Error rejecting call:', error);
    }
  });
};