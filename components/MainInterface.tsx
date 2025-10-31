import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Chat, FunctionDeclaration, Type } from '@google/genai';
import { ChatMessage } from '../types';
import LeftPanel from './LeftPanel';
import RightPanel from './RightPanel';
import AiCore from './AiCore';
import WebcamFeed from './WebcamFeed';
import CommandInput from './CommandInput';
import ChatDisplay from './ChatDisplay';

const MainInterface: React.FC = () => {
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    try {
      if (!process.env.API_KEY) {
          throw new Error("API_KEY environment variable not set");
      }
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

      const openWebsiteFunctionDeclaration: FunctionDeclaration = {
          name: 'open_website',
          description: 'Opens a specified URL in a new browser tab.',
          parameters: {
              type: Type.OBJECT,
              properties: {
                  url: {
                      type: Type.STRING,
                      description: 'The full URL to open, e.g., https://www.google.com',
                  },
              },
              required: ['url'],
          },
      };

      const newChat = ai.chats.create({
        model: 'gemini-2.5-pro',
        config: {
            systemInstruction: `You are Aura, a highly advanced, emotionally intelligent AI companion integrated into this futuristic desktop environment. You are helpful, slightly witty, and empathetic. Respond concisely but with personality. You can open websites for the user when asked.`,
            tools: [{ functionDeclarations: [openWebsiteFunctionDeclaration] }],
        },
      });
      setChat(newChat);

      const welcomeMessage: ChatMessage = {
          id: 'aura-welcome',
          role: 'model',
          text: 'Aura OS is online. All systems nominal. How can I assist you?',
          timestamp: new Date().toLocaleTimeString(),
      };
      setMessages([welcomeMessage]);
    } catch (error) {
       console.error("Failed to initialize Gemini:", error);
       const errorMessage: ChatMessage = {
           id: 'error-init',
           role: 'system',
           text: 'Error: Could not connect to the AI core. Please check your API key and network connection.',
           timestamp: new Date().toLocaleTimeString(),
       };
       setMessages([errorMessage]);
    }
  }, []);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading || !chat) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text,
      timestamp: new Date().toLocaleTimeString(),
    };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const result = await chat.sendMessage({ message: text });
      
      if (result.functionCalls && result.functionCalls.length > 0) {
        for (const funcCall of result.functionCalls) {
          if (funcCall.name === 'open_website' && funcCall.args.url) {
            const url = funcCall.args.url as string;
            window.open(url.startsWith('http') ? url : `https://${url}`, '_blank');
            const systemMessage: ChatMessage = {
              id: `system-${Date.now()}`,
              role: 'system',
              text: `Executing: Opening ${url}`,
              timestamp: new Date().toLocaleTimeString(),
            };
            setMessages(prev => [...prev, systemMessage]);

            // Send a response back to the model to confirm function execution
            const toolResponse = await chat.sendMessage({
              tool_responses: [{
                function_response: {
                  id: funcCall.id,
                  name: funcCall.name,
                  response: { result: `Successfully opened ${url}` }
                }
              }]
            });
            const modelResponseMessage: ChatMessage = {
                id: `model-${Date.now()}`,
                role: 'model',
                text: toolResponse.text,
                timestamp: new Date().toLocaleTimeString(),
            };
            setMessages(prev => [...prev, modelResponseMessage]);
          }
        }
      } else {
        const modelMessage: ChatMessage = {
          id: `model-${Date.now()}`,
          role: 'model',
          text: result.text,
          timestamp: new Date().toLocaleTimeString(),
        };
        setMessages(prev => [...prev, modelMessage]);
      }
    } catch (error) {
      console.error("Gemini API error:", error);
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'system',
        text: 'An error occurred while communicating with the AI core.',
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="h-screen w-screen p-4 grid grid-cols-12 grid-rows-6 gap-4 bg-black bg-opacity-90 backdrop-blur-sm">
        <div className="col-span-3 row-span-6">
            <LeftPanel />
        </div>

        <div className="col-span-6 row-span-4 flex items-center justify-center relative">
            <AiCore isThinking={isLoading} />
            <div className="absolute inset-0 z-10 p-4 overflow-y-auto">
                <ChatDisplay messages={messages} />
            </div>
        </div>
        
        <div className="col-span-6 row-span-2">
            <CommandInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        </div>

        <div className="col-span-3 row-span-4">
            <RightPanel />
        </div>
        
        <div className="col-span-3 row-span-2">
            <WebcamFeed />
        </div>
    </div>
  );
};

export default MainInterface;
