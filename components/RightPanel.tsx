import React, { useState, useEffect } from 'react';
import StatCard from './StatCard';

const RightPanel: React.FC = () => {
  const [time, setTime] = useState(new Date());
  const [internetSpeed, setInternetSpeed] = useState({
      down: 431.2,
      up: 88.7
  });

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    const speedTimer = setInterval(() => {
        setInternetSpeed(prevSpeed => {
            const downFluctuation = (Math.random() - 0.5) * 20; // Fluctuate by up to +/- 10 Mbps
            const upFluctuation = (Math.random() - 0.5) * 5;   // Fluctuate by up to +/- 2.5 Mbps

            // Clamp values to a realistic range
            const newDown = Math.max(100, Math.min(600, prevSpeed.down + downFluctuation));
            const newUp = Math.max(20, Math.min(120, prevSpeed.up + upFluctuation));

            return {
                down: newDown,
                up: newUp
            };
        });
    }, 2500);
    return () => {
        clearInterval(timer);
        clearInterval(speedTimer);
    };
  }, []);

  return (
    <div className="h-full flex flex-col p-4 bg-gray-900 bg-opacity-50 border border-cyan-400/30 rounded-lg backdrop-blur-md">
      <h2 className="text-cyan-400 text-lg tracking-widest mb-4">NETWORK & TIME</h2>
      <div className="text-5xl font-bold mb-6 text-center">
        {time.toLocaleTimeString()}
      </div>
      <div className="space-y-3">
          <StatCard label="IP ADDRESS" value="192.168.1.101" isStatic={true} />
          <StatCard label="WI-FI" value="AURA-NET-5G" isStatic={true} />
          <StatCard label="INTERNET SPEED" value={`↓ ${internetSpeed.down.toFixed(1)} Mbps / ↑ ${internetSpeed.up.toFixed(1)} Mbps`} />
      </div>
    </div>
  );
};

export default RightPanel;