import React, { useRef, useEffect, useState } from 'react';

interface AuthScreenProps {
  onAuthenticated: () => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onAuthenticated }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [scanActive, setScanActive] = useState(false);
  const [authText, setAuthText] =
    useState("Awaiting Biometric Confirmation");

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        setAuthText("Camera Access Denied. Please enable camera permissions.");
      }
    };
    startCamera();
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleAuth = () => {
    setScanActive(true);
    setAuthText("Scanning...");
    setTimeout(() => {
      setAuthText("Biometrics Verified. Welcome, User.");
      setTimeout(onAuthenticated, 1500);
    }, 3000);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-cyan-300 font-mono">
      <h1 className="text-3xl mb-4 tracking-widest animate-pulse">AURA - SECURE ACCESS</h1>
      <div className="relative w-80 h-80 md:w-96 md:h-96 rounded-full overflow-hidden border-2 border-cyan-400 shadow-[0_0_20px_rgba(0,255,255,0.5)]">
        <video ref={videoRef} autoPlay muted className="w-full h-full object-cover transform scale-x-[-1]"></video>
        {scanActive && (
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="h-1 bg-cyan-400 animate-scan-y"></div>
          </div>
        )}
         <style>{`
          @keyframes scan-y {
            0% { transform: translateY(0); }
            100% { transform: translateY(100vh); }
          }
          .animate-scan-y {
            animation: scan-y 3s linear;
          }
        `}</style>
      </div>
      <p className="mt-6 text-lg">{authText}</p>
      <button 
        onClick={handleAuth}
        disabled={scanActive}
        className="mt-4 px-8 py-3 border border-cyan-400 text-cyan-400 uppercase tracking-widest
                   hover:bg-cyan-400 hover:text-black transition-all duration-300
                   disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Authenticate
      </button>
    </div>
  );
};

export default AuthScreen;
