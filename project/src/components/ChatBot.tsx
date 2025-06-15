// ChatBot.tsx
import React, { useState } from 'react';
import { useChatBot } from '../context/ChatBotContext';

const ChatBot: React.FC = () => {
  const { isOpen, toggleChat, messages, sendMessage, isLoading } = useChatBot();
  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (input.trim()) {
      await sendMessage(input);
      setInput('');
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      <button
        onClick={toggleChat}
        className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700"
      >
        💬
      </button>

      {isOpen && (
        <div className="w-80 h-96 bg-white rounded-lg shadow-2xl mt-2 flex flex-col">
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`text-sm ${
                  msg.type === 'user' ? 'text-right' : 'text-left'
                }`}
              >
                <span
                  className={`inline-block px-3 py-2 rounded-lg ${
                    msg.type === 'user' ? 'bg-blue-100' : 'bg-gray-200'
                  }`}
                >
                  {msg.content}
                </span>
              </div>
            ))}
            {isLoading && <div className="text-xs text-gray-400">Bot is typing...</div>}
          </div>

          <div className="p-2 border-t flex">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Ask something..."
              className="flex-1 px-2 py-1 text-sm border rounded mr-2"
            />
            <button
              onClick={handleSend}
              className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
