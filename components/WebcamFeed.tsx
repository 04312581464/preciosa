import React, { useRef, useEffect } from 'react';

const WebcamFeed: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const enableStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing webcam: ", err);
      }
    };

    enableStream();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="h-full w-full p-2 bg-gray-900 bg-opacity-50 border border-cyan-400/30 rounded-lg backdrop-blur-md flex flex-col">
      <h3 className="text-cyan-400 text-sm tracking-widest mb-2">VISUAL INPUT</h3>
      <div className="flex-grow rounded-md overflow-hidden">
        <video 
          ref={videoRef} 
          autoPlay 
          muted 
          className="w-full h-full object-cover transform scale-x-[-1]"
        ></video>
      </div>
    </div>
  );
};

export default WebcamFeed;
