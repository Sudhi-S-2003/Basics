import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { conversationAPI, messageAPI } from '../services/api';
import socketService from '../services/socket';

// Async thunks
export const loadConversations = createAsyncThunk(
  'chat/loadConversations',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await conversationAPI.getAll();
      const conversations = response.data.conversations;
      if (conversations.length > 0) {
        dispatch(selectConversation(conversations[0]._id));
      }
      return conversations;
    } catch (error) {
      console.error('Error loading conversations:', error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const selectConversation = createAsyncThunk(
  'chat/selectConversation',
  async (conversationId, { rejectWithValue }) => {
    try {
      const [convResponse, msgResponse] = await Promise.all([
        conversationAPI.getById(conversationId),
        messageAPI.getMessages(conversationId),
      ]);

      // Join socket room
      socketService.joinConversation(conversationId);

      return {
        conversation: convResponse.data.conversation,
        messages: msgResponse.data.messages,
      };
    } catch (error) {
      console.error('Error selecting conversation:', error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    conversations: [],
    currentConversation: null,
    messages: [],
    isLoadingConversations: false,
    isLoadingMessages: false,
    typingUsers: new Set(),
  },
  reducers: {
    sendMessage: (state, action) => {
      const { content, type = 'text' } = action.payload;
      if (!state.currentConversation) return;

      const tempId = `temp-${Date.now()}`;
      const tempMessage = {
        _id: tempId,
        conversationId: state.currentConversation._id,
        content,
        type,
        createdAt: new Date(),
        status: 'sending',
      };

      state.messages.push(tempMessage);

      socketService.sendMessage({
        conversationId: state.currentConversation._id,
        content,
        type,
        tempId,
      });
    },
    addMessage: (state, action) => {
      const message = action.payload;
      const exists = state.messages.find((m) => m._id === message._id);
      if (exists) return;

      state.messages = state.messages.filter(
        (m) => m._id !== message.tempId
      );

      state.messages.push(message);
    },
    updateMessage: (state, action) => {
      const { messageId, updates } = action.payload;
      state.messages = state.messages.map((m) =>
        m._id === messageId ? { ...m, ...updates } : m
      );
    },
    addTypingUser: (state, action) => {
      state.typingUsers = new Set([...state.typingUsers, action.payload]);
    },
    removeTypingUser: (state, action) => {
      const newSet = new Set(state.typingUsers);
      newSet.delete(action.payload);
      state.typingUsers = newSet;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadConversations.pending, (state) => {
        state.isLoadingConversations = true;
      })
      .addCase(loadConversations.fulfilled, (state, action) => {
        state.conversations = action.payload;
        state.isLoadingConversations = false;
      })
      .addCase(loadConversations.rejected, (state) => {
        state.isLoadingConversations = false;
      })
      .addCase(selectConversation.pending, (state) => {
        state.isLoadingMessages = true;
        state.messages = [];
      })
      .addCase(selectConversation.fulfilled, (state, action) => {
        state.currentConversation = action.payload.conversation;
        state.messages = action.payload.messages;
        state.isLoadingMessages = false;
      })
      .addCase(selectConversation.rejected, (state) => {
        state.isLoadingMessages = false;
      });
  },
});

export const {
  sendMessage,
  addMessage,
  updateMessage,
  addTypingUser,
  removeTypingUser,
} = chatSlice.actions;

export default chatSlice.reducer;
