import React, { useState, useEffect } from 'react';
import AuthScreen from './components/AuthScreen';
import MainInterface from './components/MainInterface';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading sequence
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);
  
  const handleAuthentication = () => {
    setIsAuthenticated(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-cyan-400 font-mono">
        <div className="animate-pulse text-2xl tracking-widest">INITIALIZING AURA OS...</div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-black text-white font-mono overflow-hidden">
      {!isAuthenticated ? (
        <AuthScreen onAuthenticated={handleAuthentication} />
      ) : (
        <MainInterface />
      )}
    </div>
  );
};

export default App;
