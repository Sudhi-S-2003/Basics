// ==========================================
// client/src/services/socket.js
// ==========================================
import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
  }

  connect(token) {
    if (this.socket?.connected) return;

    this.socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
      auth: { token },
      transports: ['websocket', 'polling'],
    });

    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket.id);
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  on(event, callback) {
    if (!this.socket) return;
    this.socket.on(event, callback);
    
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  off(event, callback) {
    if (!this.socket) return;
    this.socket.off(event, callback);
    
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  emit(event, data) {
    if (!this.socket) return;
    this.socket.emit(event, data);
  }

  // Conversation events
  joinConversation(conversationId) {
    this.emit('conversation:join', conversationId);
  }

  leaveConversation(conversationId) {
    this.emit('conversation:leave', conversationId);
  }

  // Message events
  sendMessage(data) {
    this.emit('message:send', data);
  }

  markAsRead(messageId, conversationId) {
    this.emit('message:read', { messageId, conversationId });
  }

  // Typing events
  startTyping(conversationId) {
    this.emit('typing:start', { conversationId });
  }

  stopTyping(conversationId) {
    this.emit('typing:stop', { conversationId });
  }

  // WebRTC events
  initiateCall(targetUserId, conversationId) {
    this.emit('call:initiate', { targetUserId, conversationId });
  }

  sendOffer(targetUserId, offer, conversationId) {
    this.emit('call:offer', { targetUserId, offer, conversationId });
  }

  sendAnswer(targetUserId, answer, conversationId) {
    this.emit('call:answer', { targetUserId, answer, conversationId });
  }

  sendIceCandidate(targetUserId, candidate, conversationId) {
    this.emit('call:ice-candidate', { targetUserId, candidate, conversationId });
  }

  hangupCall(targetUserId, conversationId) {
    this.emit('call:hangup', { targetUserId, conversationId });
  }

  rejectCall(callerId, conversationId) {
    this.emit('call:reject', { callerId, conversationId });
  }
}

export default new SocketService();