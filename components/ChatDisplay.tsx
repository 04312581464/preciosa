import React, { useRef, useEffect } from 'react';
import { ChatMessage } from '../types';

interface ChatDisplayProps {
  messages: ChatMessage[];
}

const ChatDisplay: React.FC<ChatDisplayProps> = ({ messages }) => {
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const renderMessage = (msg: ChatMessage) => {
    const baseClass = "max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-lg text-sm";
    
    switch (msg.role) {
      case 'user':
        return (
          <div key={msg.id} className="flex justify-end mb-3">
            <div className={`${baseClass} bg-cyan-800 bg-opacity-50`}>
              {msg.text}
            </div>
          </div>
        );
      case 'model':
        return (
          <div key={msg.id} className="flex justify-start mb-3">
            <div className={`${baseClass} bg-gray-700 bg-opacity-50`}>
              <span className="font-bold text-cyan-400 block mb-1">Aura:</span>
              {msg.text}
            </div>
          </div>
        );
      case 'system':
        return (
          <div key={msg.id} className="text-center my-2">
            <p className="text-xs text-yellow-400 italic tracking-wider">{msg.text}</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-full w-full overflow-y-auto pr-2">
      {messages.map(renderMessage)}
      <div ref={endOfMessagesRef} />
    </div>
  );
};

export default ChatDisplay;
