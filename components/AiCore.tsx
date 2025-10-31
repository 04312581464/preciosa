import React from 'react';

interface AiCoreProps {
  isThinking: boolean;
}

const AiCore: React.FC<AiCoreProps> = ({ isThinking }) => {
  const thinkingClass = isThinking ? 'animate-pulse-fast' : 'animate-pulse-slow';

  return (
    <div className="absolute w-full h-full flex items-center justify-center opacity-30">
      <style>{`
        @keyframes pulse-slow {
          0%, 100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(0, 255, 255, 0.7); }
          70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(0, 255, 255, 0); }
        }
        @keyframes pulse-fast {
          0%, 100% { transform: scale(0.95); box-shadow: 0 0 0 5px rgba(0, 255, 255, 1); }
          50% { transform: scale(1.05); box-shadow: 0 0 0 20px rgba(0, 255, 255, 0); }
        }
        .animate-pulse-slow { animation: pulse-slow 4s infinite; }
        .animate-pulse-fast { animation: pulse-fast 1s infinite; }
        
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes spin-reverse-slow { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }

        .animate-spin-slow { animation: spin-slow 20s linear infinite; }
        .animate-spin-reverse-slow { animation: spin-reverse-slow 30s linear infinite; }
      `}</style>
      <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
        {/* Outer Ring */}
        <div className={`absolute w-full h-full border border-cyan-500/50 rounded-full animate-spin-reverse-slow ${isThinking ? 'animation-duration-10s' : ''}`}></div>
        {/* Middle Ring */}
        <div className={`absolute w-2/3 h-2/3 border border-cyan-500/70 rounded-full animate-spin-slow ${isThinking ? 'animation-duration-5s' : ''}`}></div>
        {/* Core */}
        <div className={`w-1/2 h-1/2 bg-cyan-500/20 rounded-full ${thinkingClass}`}></div>
      </div>
    </div>
  );
};

export default AiCore;
