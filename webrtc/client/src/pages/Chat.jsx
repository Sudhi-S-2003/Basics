
// ==========================================
// client/src/pages/Chat.jsx
// ==========================================
import React, { useEffect, useState } from 'react';
import { useChatStore } from '../store/chatStore';
import { useAuthStore } from '../store/authStore';
import socketService from '../services/socket';
import ConversationList from '../components/ConversationList';
import ChatWindow from '../components/ChatWindow';
import VideoCall from '../components/VideoCall';

const Chat = () => {
  const { loadConversations, addMessage, updateMessage, currentConversation, clearTempMessge } = useChatStore();
  console.log({ currentConversation })
  const { user } = useAuthStore();
  const [isCallActive, setIsCallActive] = useState(false);
  const [callData, setCallData] = useState(null);

  useEffect(() => {
    loadConversations();

    // Setup socket listeners
    socketService.on('message:new', ({ message }) => {
      addMessage(message);
    });
    socketService.on('message:ack', ({ tempId }) => {
      clearTempMessge(tempId);
    });

    socketService.on('message:delivered', ({ messageId }) => {
      updateMessage(messageId, { status: 'delivered' });
    });

    socketService.on('message:read', ({ messageId }) => {
      updateMessage(messageId, { status: 'read' });
    });

    socketService.on('call:incoming', (data) => {
      setCallData(data);
      setIsCallActive(true);
    });

    return () => {
      socketService.off('message:new');
      socketService.off('message:delivered');
      socketService.off('message:read');
      socketService.off('call:incoming');
    };
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      <ConversationList />

      <div className="flex-1 flex flex-col">
        {currentConversation ? (
          <ChatWindow onStartCall={() => setIsCallActive(true)} />
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a conversation to start chatting
          </div>
        )}
      </div>

      {isCallActive && (
        <VideoCall
          callData={callData}
          onClose={() => {
            setIsCallActive(false);
            setCallData(null);
          }}
        />
      )}
    </div>
  );
};

export default Chat;
