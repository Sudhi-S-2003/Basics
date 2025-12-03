
// ==========================================
// client/src/components/VideoCall.jsx
// ==========================================
import React, { useEffect, useRef, useState } from 'react';
import { X, Mic, MicOff, Video, VideoOff, PhoneOff } from 'lucide-react';
import socketService from '../services/socket';
import webrtcService from '../services/webrtc';
import { useChatStore } from '../store/chatStore';
import { useAuthStore } from '../store/authStore';

const VideoCall = ({ callData, onClose }) => {
  const { currentConversation } = useChatStore();
  const { user } = useAuthStore();
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [callStatus, setCallStatus] = useState('connecting');
  
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  useEffect(() => {
    initializeCall();

    // Setup WebRTC signaling listeners
    socketService.on('call:offer', handleOffer);
    socketService.on('call:answer', handleAnswer);
    socketService.on('call:ice-candidate', handleIceCandidate);
    socketService.on('call:hangup', handleHangup);

    return () => {
      cleanup();
      socketService.off('call:offer', handleOffer);
      socketService.off('call:answer', handleAnswer);
      socketService.off('call:ice-candidate', handleIceCandidate);
      socketService.off('call:hangup', handleHangup);
    };
  }, []);

  const initializeCall = async () => {
    try {
      // Get local media stream
      const stream = await webrtcService.getLocalStream();
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Create peer connection
      webrtcService.createPeerConnection(
        (candidate) => {
          const targetUser = getTargetUserId();
          socketService.sendIceCandidate(
            targetUser,
            candidate,
            currentConversation._id
          );
        },
        (remoteStream) => {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = remoteStream;
          }
          setCallStatus('connected');
        }
      );

      // If caller, create and send offer
      if (!callData) {
        const offer = await webrtcService.createOffer();
        const targetUser = getTargetUserId();
        socketService.sendOffer(targetUser, offer, currentConversation._id);
      }

      setCallStatus('calling');
    } catch (error) {
      console.error('Failed to initialize call:', error);
      setCallStatus('failed');
    }
  };

  const handleOffer = async ({ callerId, offer }) => {
    try {
      await webrtcService.setRemoteDescription(offer);
      const answer = await webrtcService.createAnswer();
      socketService.sendAnswer(callerId, answer, currentConversation._id);
    } catch (error) {
      console.error('Failed to handle offer:', error);
    }
  };

  const handleAnswer = async ({ answer }) => {
    try {
      await webrtcService.setRemoteDescription(answer);
    } catch (error) {
      console.error('Failed to handle answer:', error);
    }
  };

  const handleIceCandidate = async ({ candidate }) => {
    try {
      await webrtcService.addIceCandidate(candidate);
    } catch (error) {
      console.error('Failed to add ICE candidate:', error);
    }
  };

  const handleHangup = () => {
    cleanup();
    onClose();
  };

  const getTargetUserId = () => {
    if (callData) {
      return callData.callerId;
    }
    
    const otherParticipant = currentConversation.participants.find(
      (p) => p._id !== user._id
    );
    return otherParticipant._id;
  };

  const toggleAudio = () => {
    if (webrtcService.localStream) {
      const audioTrack = webrtcService.localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
      }
    }
  };

  const toggleVideo = () => {
    if (webrtcService.localStream) {
      const videoTrack = webrtcService.localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    }
  };

  const hangup = () => {
    const targetUser = getTargetUserId();
    socketService.hangupCall(targetUser, currentConversation._id);
    cleanup();
    onClose();
  };

  const cleanup = () => {
    webrtcService.cleanup();
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Remote video */}
      <div className="flex-1 relative">
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />

        {/* Status indicator */}
        {callStatus !== 'connected' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="text-white text-xl">
              {callStatus === 'connecting' && 'Connecting...'}
              {callStatus === 'calling' && 'Calling...'}
              {callStatus === 'failed' && 'Call Failed'}
            </div>
          </div>
        )}

        {/* Local video */}
        <div className="absolute bottom-4 right-4 w-48 h-36 bg-gray-900 rounded-lg overflow-hidden">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Controls */}
      <div className="bg-gray-900 p-6 flex items-center justify-center space-x-4">
        <button
          onClick={toggleAudio}
          className={`p-4 rounded-full ${
            isAudioEnabled ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'
          }`}
        >
          {isAudioEnabled ? (
            <Mic className="w-6 h-6 text-white" />
          ) : (
            <MicOff className="w-6 h-6 text-white" />
          )}
        </button>

        <button
          onClick={toggleVideo}
          className={`p-4 rounded-full ${
            isVideoEnabled ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'
          }`}
        >
          {isVideoEnabled ? (
            <Video className="w-6 h-6 text-white" />
          ) : (
            <VideoOff className="w-6 h-6 text-white" />
          )}
        </button>

        <button
          onClick={hangup}
          className="p-4 rounded-full bg-red-600 hover:bg-red-700"
        >
          <PhoneOff className="w-6 h-6 text-white" />
        </button>
      </div>
    </div>
  );
};

export default VideoCall;