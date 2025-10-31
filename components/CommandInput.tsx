import React, { useState, useRef, useEffect } from 'react';
import { MicrophoneIcon, SendIcon } from './icons';

// Fix for missing SpeechRecognition types
interface SpeechRecognitionErrorEvent extends Event {
  readonly error: string;
  readonly message: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onend: (() => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  start: () => void;
  stop: () => void;
}

interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  readonly isFinal: boolean;
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}

declare global {
  interface Window {
    SpeechRecognition: { new (): SpeechRecognition };
    webkitSpeechRecognition: { new (): SpeechRecognition };
  }
}

interface CommandInputProps {
  onSendMessage: (text: string) => void;
  isLoading: boolean;
}

const CommandInput: React.FC<CommandInputProps> = ({ onSendMessage, isLoading }) => {
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const transcriptRef = useRef<string>('');

  const onSendMessageRef = useRef(onSendMessage);
  useEffect(() => {
    onSendMessageRef.current = onSendMessage;
  }, [onSendMessage]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
        transcriptRef.current = transcript;
        setInputText(transcript);
      };
      
      recognition.onend = () => {
        setIsListening(false);
        if (transcriptRef.current.trim()) {
            onSendMessageRef.current(transcriptRef.current.trim());
        }
        setInputText('');
        transcriptRef.current = '';
      };

      recognition.onerror = (event) => {
        // Handle common, non-critical errors gracefully.
        if (event.error === 'no-speech' || event.error === 'aborted') {
          console.log("Speech recognition stopped: User was silent or aborted the action.");
        } else if (event.error === 'network') {
          console.log("Speech recognition failed: A network error occurred. This may be a temporary issue.");
        } else {
          console.error(`Speech recognition error: ${event.error} - ${event.message}`);
        }
        // `onend` will be called after this, which handles resetting the UI state.
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const handleMicClick = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setInputText('');
      transcriptRef.current = '';
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleSendMessage = () => {
    if (inputText.trim()) {
      onSendMessage(inputText);
      setInputText('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="h-full w-full flex flex-col p-4 bg-gray-900 bg-opacity-50 border border-cyan-400/30 rounded-lg backdrop-blur-md">
      <div className="flex-grow relative flex items-center">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isListening ? "Listening..." : "Enter command or ask a question..."}
          disabled={isLoading}
          className="w-full h-12 bg-black bg-opacity-50 border border-cyan-400/50 rounded-lg pl-4 pr-24 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
        />
        <div className="absolute right-2 flex items-center space-x-2">
            <button
                onClick={handleMicClick}
                className={`p-2 rounded-full transition-colors ${isListening ? 'bg-red-500 animate-pulse' : 'bg-cyan-600 hover:bg-cyan-500'}`}
                aria-label="Toggle voice command"
            >
                <MicrophoneIcon className="w-6 h-6 text-white"/>
            </button>
            <button
                onClick={handleSendMessage}
                disabled={isLoading || !inputText.trim()}
                className="p-2 rounded-full bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-600 disabled:opacity-50 transition-colors"
                aria-label="Send message"
            >
                <SendIcon className="w-6 h-6 text-white" />
            </button>
        </div>
      </div>
      {isLoading && <p className="text-center text-cyan-400 animate-pulse mt-2 text-sm">Aura is thinking...</p>}
    </div>
  );
};

export default CommandInput;