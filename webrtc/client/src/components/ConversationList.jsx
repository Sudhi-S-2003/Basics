// ==========================================
// client/src/components/ConversationList.jsx
// ==========================================
import React, { useState } from 'react';
import { Search, Plus, LogOut } from 'lucide-react';
import { useChatStore } from '../store/chatStore';
import { useAuthStore } from '../store/authStore';
import { format } from 'date-fns';
import UserSearch from './UserSearch';

const ConversationList = () => {
  const { conversations, selectConversation, currentConversation } = useChatStore();
  const { user, logout } = useAuthStore();
  const [showSearch, setShowSearch] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-white font-semibold">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <div className="font-semibold">{user?.name}</div>
            <div className="text-xs text-gray-500">Online</div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="p-2 hover:bg-gray-100 rounded-full"
          title="Logout"
        >
          <LogOut className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Search bar */}
      <div className="p-4 border-b border-gray-200">
        <button
          onClick={() => setShowSearch(!showSearch)}
          className="w-full flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
        >
          <Plus className="w-5 h-5 text-gray-600" />
          <span className="text-gray-600">New Conversation</span>
        </button>
      </div>

      {showSearch && (
        <UserSearch onClose={() => setShowSearch(false)} />
      )}

      {/* Conversations list */}
      <div className="flex-1 overflow-y-auto">
        {conversations.map((conversation) => {
          const otherParticipant = conversation.participants.find(
            (p) => p._id !== user?._id
          );
          const isActive = currentConversation?._id === conversation._id;

          return (
            <div
              key={conversation._id}
              onClick={() => selectConversation(conversation._id)}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                isActive ? 'bg-primary-50' : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-white font-semibold">
                    {conversation.type === 'group'
                      ? conversation.name?.[0]?.toUpperCase()
                      : otherParticipant?.name?.[0]?.toUpperCase()}
                  </div>
                  {conversation.type === 'direct' && otherParticipant?.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold truncate">
                      {conversation.type === 'group'
                        ? conversation.name
                        : otherParticipant?.name}
                    </p>
                    {conversation.lastMessageAt && (
                      <span className="text-xs text-gray-500">
                        {format(new Date(conversation.lastMessageAt), 'HH:mm')}
                      </span>
                    )}
                  </div>
                  {conversation.lastMessage && (
                    <p className="text-sm text-gray-600 truncate">
                      {conversation.lastMessage.content}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {conversations.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No conversations yet. Start a new one!
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationList;