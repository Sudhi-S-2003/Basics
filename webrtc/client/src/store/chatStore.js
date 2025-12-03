// ==========================================
// client/src/store/chatStore.js
// ==========================================
import { create } from 'zustand';
import { conversationAPI, messageAPI } from '../services/api';
import socketService from '../services/socket';

export const useChatStore = create((set, get) => ({
  conversations: [],
  currentConversation: null,
  messages: [],
  isLoadingConversations: false,
  isLoadingMessages: false,
  typingUsers: new Set(),

  loadConversations: async () => {
    set({ isLoadingConversations: true });
    try {
      const response = await conversationAPI.getAll();
      const conversations = response.data.conversations;
      set({ conversations, isLoadingConversations: false });

      // Auto-select first conversation if exists
      if (conversations.length > 0) {
        get().selectConversation(conversations[0]._id);
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
      set({ isLoadingConversations: false });
    }
  },

  selectConversation: async (conversationId) => {
    set({ isLoadingMessages: true, messages: [] });

    try {
      const [convResponse, msgResponse] = await Promise.all([
        conversationAPI.getById(conversationId),
        messageAPI.getMessages(conversationId),
      ]);

      set({
        currentConversation: convResponse.data.conversation,
        messages: msgResponse.data.messages,
        isLoadingMessages: false,
      });

      // Join socket room
      socketService.joinConversation(conversationId);
    } catch (error) {
      console.error('Error selecting conversation:', error);
      set({ isLoadingMessages: false });
    }
  },

  sendMessage: (content, type = 'text') => {
    const { currentConversation, messages } = get();
    if (!currentConversation) return;

    const tempId = `temp-${Date.now()}`;
    const tempMessage = {
      _id: tempId,
      conversationId: currentConversation._id,
      content,
      type,
      createdAt: new Date(),
      status: 'sending',
      isOwn: true
    };

    // Optimistically add message
    set({ messages: [...messages, tempMessage] });

    // Send via socket
    socketService.sendMessage({
      conversationId: currentConversation._id,
      content,
      type,
      tempId,
    });
  },
  clearTempMessge: (tempId) => {
    const { messages } = get();

    const finalMessages = messages?.filter((message) => message._id !== tempId);
    set({ messages: [...finalMessages] });
  },

  addMessage: (message) => {
    set((state) => {
      const exists = state.messages.find((m) => m._id === message._id);
      if (exists) return state;

      // Remove temp message if matching tempId
      const filteredMessages = state.messages.filter(
        (m) => m._id !== message.tempId
      );

      return {
        messages: [...filteredMessages, message],
      };
    });
  },

  updateMessage: (messageId, updates) => {
    set((state) => ({
      messages: state.messages.map((m) =>
        m._id === messageId ? { ...m, ...updates } : m
      ),
    }));
  },

  addTypingUser: (userId) => {
    set((state) => ({
      typingUsers: new Set([...state.typingUsers, userId]),
    }));
  },

  removeTypingUser: (userId) => {
    set((state) => {
      const newSet = new Set(state.typingUsers);
      newSet.delete(userId);
      return { typingUsers: newSet };
    });
  },
}));
