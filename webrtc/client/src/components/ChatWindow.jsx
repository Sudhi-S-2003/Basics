
// ==========================================
// client/src/components/ChatWindow.jsx
// ==========================================
import React, { useState, useEffect, useRef } from 'react';
import { Send, Paperclip, Video, Phone } from 'lucide-react';
import { useChatStore } from '../store/chatStore';
import { useAuthStore } from '../store/authStore';
import socketService from '../services/socket';
import { format } from 'date-fns';

const ChatWindow = ({ onStartCall }) => {
  const { currentConversation, messages, sendMessage } = useChatStore();
  const { user } = useAuthStore();
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    sendMessage(messageInput);
    setMessageInput('');
  };

  const handleStartCall = () => {
    const otherParticipant = currentConversation.participants.find(
      (p) => p._id !== user._id
    );

    if (otherParticipant) {
      socketService.initiateCall(otherParticipant._id, currentConversation._id);
      onStartCall();
    }
  };

  if (!currentConversation) return null;

  const otherParticipant = currentConversation.participants.find(
    (p) => p._id !== user._id
  );

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white font-semibold">
            {currentConversation.type === 'group'
              ? currentConversation.name?.[0]?.toUpperCase()
              : otherParticipant?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <p className="font-semibold">
              {currentConversation.type === 'group'
                ? currentConversation.name
                : otherParticipant?.name}
            </p>
            <p className="text-sm text-gray-500">
              {otherParticipant?.isOnline ? 'Online' : 'Offline'}
            </p>
          </div>
        </div>

        {currentConversation.type === 'direct' && (
          <button
            onClick={handleStartCall}
            className="p-2 hover:bg-gray-100 rounded-full"
            title="Start video call"
          >
            <Video className="w-6 h-6 text-primary-600" />
          </button>
        )}
      </div>

  {/* Messages */}
<div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
  {messages.map((message) => {
    const isOwn =
      message.sender?._id === user._id ||
      message.sender === user._id ||
      message.isOwn;

    return (
      <div
        key={message._id}
        className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
      >
        <div
          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
            isOwn ? 'bg-primary-600 text-white' : 'bg-white text-gray-900'
          }`}
        >
          {!isOwn && currentConversation.type === 'group' && (
            <p className="text-xs font-semibold mb-1">{message.sender?.name}</p>
          )}

          <p className="break-words">{message.content}</p>

          <div className="flex items-center justify-between text-xs mt-1">
            <span className={isOwn ? 'text-primary-100' : 'text-gray-500'}>
              {format(new Date(message.createdAt), 'HH:mm')}
            </span>
            {isOwn && message.status === 'sending' && (
              <span className="ml-2 italic text-gray-200">Sending...</span>
            )}
            {isOwn && message.status === 'delivered' && (
              <span className="ml-2 text-green-400">✓</span>
            )}
            {isOwn && message.status === 'read' && (
              <span className="ml-2 text-blue-400">✓✓</span>
            )}
          </div>
        </div>
      </div>
    );
  })}
  <div ref={messagesEndRef} />
</div>


      {/* Input */}
      <form onSubmit={handleSend} className="bg-white border-t border-gray-200 p-4">
        <div className="flex items-center space-x-2">
          <button
            type="button"
            className="p-2 hover:bg-gray-100 rounded-full"
            title="Attach file"
          >
            <Paperclip className="w-5 h-5 text-gray-600" />
          </button>

          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500"
          />

          <button
            type="submit"
            disabled={!messageInput.trim()}
            className="p-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatWindow;