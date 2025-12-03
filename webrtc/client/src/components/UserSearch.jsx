
// ==========================================
// client/src/components/UserSearch.jsx
// ==========================================
import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { userAPI, conversationAPI } from '../services/api';
import { useChatStore } from '../store/chatStore';
import toast from 'react-hot-toast';

const UserSearch = ({ onClose }) => {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { loadConversations, selectConversation } = useChatStore();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    try {
      const response = await userAPI.search(query);
      setUsers(response.data.users);
    } catch (error) {
      toast.error('Search failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectUser = async (userId) => {
    try {
      const response = await conversationAPI.createDirect(userId);
      await loadConversations();
      selectConversation(response.data.conversation._id);
      onClose();
    } catch (error) {
      toast.error('Failed to create conversation');
    }
  };

  return (
    <div className="absolute inset-0 bg-white z-10 flex flex-col">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="font-semibold">Search Users</h3>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSearch} className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </form>

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-4 text-center">Searching...</div>
        ) : (
          users.map((user) => (
            <div
              key={user._id}
              onClick={() => handleSelectUser(user._id)}
              className="p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white font-semibold">
                  {user.name[0].toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UserSearch;